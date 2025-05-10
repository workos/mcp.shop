"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface InstructionsProps {
  openButtonLabel: string;
}

export const Instructions = ({ openButtonLabel }: InstructionsProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog
        className="fixed inset-0 m-auto max-w-3xl p-8 rounded-xl border border-purple-700 bg-background text-foreground shadow-xl shadow-purple-950"
        closedby="any"
        ref={dialogRef}
      >
        <button
          className="absolute right-2 top-1 text-4xl hover:text-5xl transition-all text-purple-500 font-bold"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          ⊗
        </button>
        <p className="mt-2 mb-1">
          Welcome to MCP Shop’s LLM storefront! Place your order by connecting
          your favorite MCP-compatible LLM to MCP Shop’s MCP server.
        </p>
        <h4 className="text-lg font-bold my-1">Claude Integrations</h4>
        <p className="my-1">
          Claude recently added{" "}
          <Link href="https://www.anthropic.com/news/integrations">
            support for Integrations
          </Link>
          , which support remote MCP servers. With WorkOS, we can add
          authorization to that MCP server.
        </p>
        <p className="my-1">
          If your Claude account has Integrations available, go to the
          Integrations section of the Settings menu, select “Add more”, and
          enter “MCP Shop” in the name, and <code>https://mcp.shop/sse</code> in
          the URL field.
        </p>
        <Image
          alt="Screenshot of Claude Desktop’s Settings screen, with the add-custom-integration screen showing."
          className="m-auto my-1 max-w-1/2"
          height={2068}
          src="/add-custom-integration.png"
          width={2048}
        />
        <h4 className="text-lg font-bold my-1">Local MCP</h4>
        <p className="my-1">
          You can also order MCP swag via a local MCP server via{" "}
          <Link href="https://github.com/geelen/mcp-remote">
            <code>mcp-remote</code>
          </Link>
          .
        </p>
        <p className="my-1">
          In Claude, add the following to your{" "}
          <Link href="https://modelcontextprotocol.io/quickstart/user">
            <code>claude_desktop_config.json</code> file
          </Link>
          . If you already have stuff in there, make sure to add it, and not
          replace it. (And maybe back up the file first!)
        </p>
        <pre className="my-2 p-4 border rounded-lg border-neutral-700 bg-neutral-900">{`{
  "mcpServers": {
    "mcp.shop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.shop/mcp"]
    }
  }
}`}</pre>
        <p className="my-1">
          Setup for other tools (like{" "}
          <Link href="https://block.github.io/goose/">Goose</Link>) is generally
          pretty similar: a <code>command</code> string, and an `args` list of
          strings. Support for remote MCP servers is still new, so for now a lot
          of tools will require a proxy like <code>mcp-remote</code>.
        </p>
        <div className="flex justify-center">
          <button
            className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-md hover:shadow-purple-500/40 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={() => {
              dialogRef.current?.close();
            }}
          >
            OK
          </button>
        </div>
      </dialog>

      <button
        className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-md hover:shadow-purple-500/40 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        {openButtonLabel}
      </button>
    </>
  );
};
