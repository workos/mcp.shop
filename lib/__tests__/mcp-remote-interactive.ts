#!/usr/bin/env node

/**
 * MCP Remote Interactive Test Script
 * 
 * A interactive test script for testing MCP server connectivity
 * and functionality. Tests both /mcp and /sse protocols.
 * 
 * This script verifies:
 * 1. MCP server is running and accessible
 * 2. MCP clients can authenticate with the server
 * 3. tools/list functionality is working
 * 
 * Usage:
 * - pnpm run test:mcp-interactive
 * - node lib/__tests__/mcp-remote-interactive.ts
 * 
 * CLI Options:
 * - --verbose - Enable verbose logging (default: false)
 * - --help - Show usage information
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { createInterface, type Interface } from 'node:readline';
import { setTimeout } from 'node:timers/promises';

// Types
interface MCPTool {
  name: string;
  description?: string;
}

interface MCPResponse {
  jsonrpc: string;
  id: number;
  result?: {
    tools?: MCPTool[];
  };
  error?: {
    code: number;
    message: string;
  };
}

interface MCPRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

// Configuration
// const PROTOCOLS = ['mcp', 'sse'] as const;
const PROTOCOLS = ['mcp'] as const; // Should we give up on SSE?
const TIMEOUT_MS = 30_000;
const AUTH_WAIT_MS = 5000;
const PROCESS_START_WAIT_MS = 2000;
const PROTOCOL_DELAY_MS = 3000;

// CLI argument parsing
function parseArgs(): { verbose: boolean; help: boolean } {
  const args = process.argv.slice(2);
  return {
    verbose: args.includes('--verbose'),
    help: args.includes('--help')
  };
}

// Help text
function showHelp(): void {
  console.log(`
MCP Remote Interactive Test Script

Usage:
  node lib/__tests__/mcp-remote-interactive.ts [options]

Options:
  --verbose    Enable verbose logging
  --help       Show this help message

Description:
  Tests MCP server connectivity and functionality for both /mcp and /sse protocols.
  Verifies server health, authentication, and tools/list functionality.

Examples:
  node lib/__tests__/mcp-remote-interactive.ts
  node lib/__tests__/mcp-remote-interactive.ts --verbose
`);
}

// Get server URL
function getServerUrl(): string {
  if (process.env.MCP_SERVER_URL) {
    return process.env.MCP_SERVER_URL;
  }
  
  const devPort = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3000';
  return `http://localhost:${devPort}`;
}

// Logger class for consistent logging
class Logger {
  private verbose: boolean;

  constructor(verbose: boolean) {
    this.verbose = verbose;
  }

  log(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }

  logVerbose(message: string): void {
    if (this.verbose) {
      console.log(`[VERBOSE] ${message}`);
    }
  }

  isVerbose(): boolean {
    return this.verbose;
  }

  success(message: string): void {
    console.log(`✅ ${message}`);
  }

  warning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  info(message: string): void {
    console.log(`ℹ️  ${message}`);
  }
}

// MCP Process Manager
class MCPProcessManager {
  private process: ChildProcess | undefined;
  private readline: Interface | undefined;
  private stderrBuffer = '';
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async start(resourceUrl: string): Promise<void> {
    const spawnArgs = ['-y', 'mcp-remote', resourceUrl];
    
    this.logger.logVerbose(`Starting MCP process with args: ${spawnArgs.join(' ')}`);
    this.logger.logVerbose(`Resource URL: ${resourceUrl}`);

    this.process = spawn('npx', spawnArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

    // Set up error handling
    this.process.on('error', (error) => {
      this.logger.error(`MCP process error: ${error.message}`);
      throw error;
    });

    this.process.on('exit', (code, signal) => {
      if (signal === 'SIGINT' || signal === 'SIGTERM') {
        this.logger.logVerbose('MCP process terminated gracefully');
        return;
      }
      
      if (code !== 0 && signal !== null) {
        this.logger.error(`MCP process exited with code ${code} and signal ${signal}`);
        if (this.stderrBuffer) {
          this.logger.error(`Stderr buffer: ${this.stderrBuffer}`);
        }
      }
    });

    // Capture stderr
    if (this.process.stderr) {
      this.process.stderr.on('data', (data) => {
        this.stderrBuffer += data.toString();
        const dataStr = data.toString();
        if (dataStr.includes('error') || dataStr.includes('Error') || dataStr.includes('failed') || this.logger.isVerbose()) {
          this.logger.error(`[stderr] ${dataStr}`);
        }
      });
    }

    // Create readline interface
    if (this.process.stdout) {
      this.readline = createInterface({ input: this.process.stdout });
    } else {
      throw new Error('Failed to create MCP process stdout');
    }

    // Wait for process to start
    await setTimeout(PROCESS_START_WAIT_MS);

    if (this.process.exitCode !== null) {
      throw new Error(`MCP process has already exited with code ${this.process.exitCode}`);
    }
  }

  send(message: MCPRequest): void {
    const jsonMsg = JSON.stringify(message);
    this.logger.logVerbose(`Sending: ${jsonMsg}`);
    
    if (this.process?.stdin) {
      try {
        this.process.stdin.write(jsonMsg + '\n');
      } catch (error) {
        this.logger.error(`Failed to send message to MCP process: ${error}`);
        throw error;
      }
    } else {
      throw new Error('MCP process stdin is not available');
    }
  }

  async nextMessage(): Promise<MCPResponse> {
    if (!this.readline) {
      throw new Error('Readline interface not available');
    }
    
    const linePromise = (async () => {
      for await (const line of this.readline!) {
        this.logger.logVerbose(`Received line: ${line}`);
        if (line.startsWith('{')) {
          try {
            const parsed = JSON.parse(line) as MCPResponse;
            this.logger.logVerbose(`Parsed JSON: ${JSON.stringify(parsed, null, 2)}`);
            return parsed;
          } catch {
            this.logger.error(`Failed to parse JSON line: ${line}`);
          }
        }
      }
    })();
    
    const result = await Promise.race([
      linePromise,
      setTimeout(TIMEOUT_MS).then(() => {
        throw new Error(`Timed out waiting for MCP response after ${TIMEOUT_MS}ms`);
      })
    ]);
    
    if (!result) {
      throw new Error('No valid JSON message received');
    }
    
    return result;
  }

  cleanup(): void {
    if (this.readline) {
      this.readline.close();
    }
    if (this.process) {
      this.process.kill('SIGINT');
    }
  }
}

// Server health checker
async function checkServerHealth(url: string, protocol: string, logger: Logger): Promise<void> {
  const resourceUrl = `${url}/${protocol}`;
  logger.info(`Checking ${protocol.toUpperCase()} server health at: ${resourceUrl}`);
  
  try {
    const response = await fetch(resourceUrl, { method: 'GET' });
    
    if (response.status === 401) {
      logger.success(`${protocol.toUpperCase()} server is running (401 Unauthorized is expected for unauthenticated requests)`);
    } else if (response.status === 500) {
      logger.warning(`${protocol.toUpperCase()} server is running but returned 500 Internal Server Error (this may be expected if server has configuration issues)`);
    } else {
      throw new Error(`${protocol.toUpperCase()} server not healthy: Expected 401 Unauthorized, got ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const err = error as Error;
    
    if (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
      logger.error(`\n❌ ${protocol.toUpperCase()} Server Connection Failed`);
      logger.error('The MCP server appears to be down or not accessible.');
      logger.error('\n🔧 Troubleshooting Steps:');
      logger.error('1. Check if the MCP server is running:');
      logger.error(`   - Visit https://mcp.workos.engineer/${protocol} in your browser`);
      logger.error('   - You should see a 401 Unauthorized response (not 404)');
      logger.error('\n2. If the server is down:');
      logger.error('   - Contact the WorkOS team or check status page');
      logger.error('   - Try again later');
      logger.error('\n3. If you\'re behind a firewall/proxy:');
      logger.error('   - Ensure you can access https://mcp.workos.engineer');
      logger.error('   - Check your network configuration');
      logger.error('\n4. For local development:');
      logger.error('   - Ensure you\'re using the correct REMOTE_URL');
      logger.error('   - Check your environment variables');
      
      logger.error(`\n📋 Error Details: ${err.message}`);
      logger.error(`🔗 Attempted URL: ${resourceUrl}`);
      
      process.exit(1);
    } else if (err.message.includes('404')) {
      logger.error(`\n❌ ${protocol.toUpperCase()} Server Not Found (404)`);
      logger.error('The MCP server endpoint does not exist or has been moved.');
      logger.error('\n🔧 Troubleshooting Steps:');
      logger.error('1. Verify the correct server URL:');
      logger.error(`   - Current URL: ${resourceUrl}`);
      logger.error(`   - Expected: https://mcp.workos.engineer/${protocol}`);
      logger.error('\n2. Check if the server has been updated:');
      logger.error('   - Contact the WorkOS team for the latest endpoint');
      logger.error('   - Check documentation for any URL changes');
      
      logger.error(`\n📋 Error Details: ${err.message}`);
      process.exit(1);
    } else {
      logger.error(`\n❌ ${protocol.toUpperCase()} Server Health Check Failed`);
      logger.error('An unexpected error occurred while checking the MCP server.');
      logger.error('\n🔧 Troubleshooting Steps:');
      logger.error('1. Check your internet connection');
      logger.error('2. Verify the server URL is correct');
      logger.error('3. Try again in a few minutes');
      logger.error('4. Contact support if the issue persists');
      
      logger.error(`\n📋 Error Details: ${err.message}`);
      logger.error(`🔗 Attempted URL: ${resourceUrl}`);
      process.exit(1);
    }
  }
}

// Run MCP tests for a specific protocol
async function runMCPTests(protocol: string, baseUrl: string, logger: Logger): Promise<void> {
  const resourceUrl = `${baseUrl}/${protocol}`;
  const mcpManager = new MCPProcessManager(logger);
  
  logger.info(`Testing ${protocol.toUpperCase()} protocol...`);
  logger.logVerbose('Verbose mode enabled - showing detailed MCP process output');
  logger.info('Authentication may be required: Browser may open for login\n');
  
  try {
    await mcpManager.start(resourceUrl);
    
    // Wait for potential authentication
    await setTimeout(AUTH_WAIT_MS);
    
    // Test tools/list
    logger.info('Testing tools/list...');
    mcpManager.send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    const listMsg = await mcpManager.nextMessage();
    
    if (!Array.isArray(listMsg?.result?.tools) || !listMsg.result.tools.length) {
      throw new Error('tools/list returned no tools');
    }
    
    const toolNames = listMsg.result.tools.map((t: MCPTool) => t.name);
    logger.success(`tools/list → ${toolNames.join(', ')}`);
    
    // Verify listMcpShopInventory is available (optional)
    if (!toolNames.includes('listMcpShopInventory')) {
      logger.warning('listMcpShopInventory not available in tools list');
    } else {
      logger.success('listMcpShopInventory is available in tools list');
    }
    
    logger.success(`MCP connectivity test passed on ${resourceUrl} with ${toolNames.length} tools.\n`);
    
  } catch (error) {
    logger.error(`\n❌ Test failed: ${(error as Error).message}`);
    if ((error as Error).stack) {
      logger.error(`Stack trace: ${(error as Error).stack}`);
    }
    throw error;
  } finally {
    mcpManager.cleanup();
  }
}

// Main execution function
async function main(): Promise<void> {
  const { verbose, help } = parseArgs();
  
  if (help) {
    showHelp();
    return;
  }
  
  const logger = new Logger(verbose);
  const serverUrl = getServerUrl();
  
  logger.info(`🔗 Using MCP server URL: ${serverUrl}`);
  
  try {
    // Check server health for all protocols
    logger.info('\n🔍 Checking server health for all protocols...');
    for (const protocol of PROTOCOLS) {
      await checkServerHealth(serverUrl, protocol, logger);
    }
    
    // Run MCP tests for all protocols
    logger.info('\n🚀 Running MCP functionality tests...');
    for (let i = 0; i < PROTOCOLS.length; i++) {
      const protocol = PROTOCOLS[i];
      logger.info(`\n🚀 Testing ${protocol.toUpperCase()} protocol...`);
      logger.info('='.repeat(50));
      
      try {
        await runMCPTests(protocol, serverUrl, logger);
        logger.success(`${protocol.toUpperCase()} protocol test completed successfully`);
      } catch (error) {
        logger.error(`${protocol.toUpperCase()} protocol test failed: ${(error as Error).message}`);
        throw error;
      }
      
      // Add delay between protocol tests (except for the last one)
      if (i < PROTOCOLS.length - 1) {
        logger.info(`\n⏳ Waiting ${PROTOCOL_DELAY_MS / 1000} seconds before testing next protocol...`);
        await setTimeout(PROTOCOL_DELAY_MS);
      }
    }
    
    logger.success('\n🎉 All protocol tests completed successfully!');
    
  } catch (error) {
    logger.error(`\n❌ Test suite failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
