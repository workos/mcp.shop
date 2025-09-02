<p align="center">
  <h1 align="center">mcp.shop</h1>
</p>

<p align="center">
  The world's first MCP-based web shop, built with WorkOS AuthKit and Next.js mcp-adaptor.
</p>

<p align="center">
  <a href="https://mcp.shop/">Live Demo</a> • <a href="#overview">Overview</a> • <a href="#architecture">Architecture</a> • <a href="#prerequisites">Prerequisites</a> • <a href="#setup">Setup</a>
</p>

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

   Copy [`.env.example`](./.env.example) to `.env.local` and set each value.

   > **Note:**
   >
   > - You can find your WorkOS credentials in the [WorkOS dashboard](https://workos.com/docs/user-management/vanilla/nodejs/1-configure-your-project). 
   > - Make sure to set your redirect URI (`http://localhost:3000/callback` for local development or `https://<deployed-url>/callback` for production) in the dashboard.
   > - Make sure you have enabled **Dynamic Client Registration** on the dashboard. It should be under **Developer** -> **Application** -> **Configuration** page on the dashboard

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

[MIT](LICENSE)
