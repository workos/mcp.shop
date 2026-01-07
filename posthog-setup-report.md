# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your MCP Shop Next.js project. The integration includes:

- **Client-side tracking** via `instrumentation-client.ts` (Next.js 15.3+ approach) with automatic pageviews, exception capture, and debug mode in development
- **Server-side tracking** via `posthog-node` SDK with a reusable client helper in `lib/posthog-server.ts`
- **User identification** on both client and server to correlate behavior across sessions and platforms
- **12 custom events** tracking key business actions including orders, user engagement, MCP tool usage, and error monitoring
- **Environment variables** configured for PostHog API key and host

## Events Instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `order_placed` | User successfully places a t-shirt order | `lib/orders.ts` |
| `order_failed` | User's order fails due to validation or system issues | `lib/orders.ts` |
| `mcp_instructions_dialog_opened` | User opens the MCP ordering instructions modal | `components/instructions.tsx` |
| `chatgpt_instructions_dialog_opened` | User opens the ChatGPT Apps SDK instructions modal | `components/chatgpt-instructions.tsx` |
| `mcp_option_expanded` | User expands a specific MCP integration option accordion | `components/instructions.tsx` |
| `sign_out` | User clicks the sign out button | `components/navbar.tsx` |
| `orders_page_viewed` | Authenticated user views their orders page | `app/orders/page.tsx` |
| `admin_order_sent_toggled` | Admin marks or unmarks an order as sent | `app/admin/orders/orders-table.tsx` |
| `admin_order_deleted` | Admin soft-deletes an order | `app/admin/orders/orders-table.tsx` |
| `auth_error` | Authentication error occurs during OAuth callback | `app/callback/route.ts` |
| `token_verification_failed` | JWT token verification fails during MCP auth | `lib/with-authkit.ts` |
| `mcp_tool_invoked` | An MCP tool is invoked (order_shirt or show_store_content) | `app/[transport]/route.ts` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog initialization |
| `lib/posthog-server.ts` | Server-side PostHog client helper |
| `.env` | Environment variables for PostHog configuration |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/280642/dashboard/995831) - Key business metrics for MCP Shop

### Insights
- [Orders Placed Over Time](https://us.posthog.com/project/280642/insights/mChuHPMl) - Track successful order placements over time
- [Order Success vs Failure Rate](https://us.posthog.com/project/280642/insights/PU0Qveni) - Compare successful vs failed orders to identify conversion issues
- [MCP Tool Usage](https://us.posthog.com/project/280642/insights/rjRrr1Z6) - Track how users interact with MCP tools
- [User Engagement Funnel](https://us.posthog.com/project/280642/insights/67QlXbg4) - Track user journey from viewing orders to placing an order
- [Authentication Errors](https://us.posthog.com/project/280642/insights/taa7oqi4) - Monitor authentication and token verification failures

## Configuration

Environment variables have been set up in `.env`:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_yfLDVrL0RqY0kYfo39YZ9Z0SSdm3jNFa1KFVUBG3AtF
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your production environment (e.g., Vercel) as well.
