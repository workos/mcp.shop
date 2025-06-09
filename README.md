# mcp.shop

The world's first MCP-based web shop.

## Overview

This project demonstrates how to use AuthKit with MCP to create a secure web shop where users can:
- Connect to an MCP server
- Authenticate via AuthKit
- Order t-shirts using MCP tools
- View order details (admin users only)

## Architecture

The application is built on:
- [Next.js B2B Starter Kit](https://workos.com/blog/nextjs-b2b-starter-kit) for the website
- [Vercel MCP Adapter](https://github.com/vercel/mcp-adapter) for MCP integration
- [WorkOS AuthKit with MCP](https://workos.com/docs/user-management/mcp) for authentication

Key components:
- Authentication logic: `lib/with-authkit.ts`
- Client registration: `app/.well-known/`
- MCP implementation: `app/[transport]/route.ts`

## Prerequisites

- Node.js (latest LTS version recommended)
- WorkOS account with AuthKit configured
- Redis service (e.g., Upstash)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following:
   ```
   # WorkOS AuthKit configuration
   WORKOS_API_KEY=your_api_key
   WORKOS_CLIENT_ID=your_client_id
   
   # Redis configuration
   REDIS_URL=your_redis_url
   ```

   You can find your WorkOS credentials in the [WorkOS dashboard](https://workos.com/docs/user-management/vanilla/nodejs/1-configure-your-project).

4. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at:
- Website: [http://localhost:3000](http://localhost:3000)
- MCP Server: `/mcp`

## Connecting to MCP

To connect your chat client to the development server, add the following configuration to your MCP config file (e.g., `.cursor/mcp.json`):

```json
{
    "mcpServers": {
        "mcp.shop": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "http://localhost:3000/mcp"]
        }
    }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]