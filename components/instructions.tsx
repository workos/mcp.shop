"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button } from "@radix-ui/themes";

declare module "react" {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    closedby?: string;
  }
}

interface InstructionsProps {
  openButtonClassname?: string;
  openButtonLabel: string;
}

export const Instructions = ({ openButtonLabel }: InstructionsProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog
        className="fixed inset-0 m-auto w-[80%] sm:w-[85%] md:w-[80%] max-w-3xl p-3 sm:p-6 md:p-8 border border-neutral-700 rounded-xl bg-background text-foreground overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
        closedby="any"
        ref={dialogRef}
      >
        <div className="relative w-full">
          {/* <button
            className="absolute right-0 top-0 text-2xl sm:text-3xl hover:text-4xl transition-all text-blue-500 font-bold p-2 z-10"
            onClick={() => {
              dialogRef.current?.close();
            }}
          >
            ⊗
          </button> */}
          <div className="w-full overflow-x-hidden pt-4 md:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
              MCP Shop Instructions
            </h1>
            <p className="mt-2 mb-1 text-base break-words">
              Welcome to MCP Shop&apos;s LLM storefront! Place your order by
              connecting your favorite MCP-compatible LLM to MCP Shop&apos;s MCP
              server.
            </p>
            <p className="text-base mt-2 break-words">
              MCP Shop uses <Link href="https://www.authkit.com">AuthKit</Link>,
              so after you&apos;ve installed the MCP server, you&apos;ll be
              prompted to sign up for an MCP Shop account.
            </p>
            <h4 className="text-base sm:text-lg font-bold my-3 pt-4">
              Option 1: Claude Integrations
            </h4>
            <p className="my-3 text-base break-words">
              Claude recently added{" "}
              <Link href="https://www.anthropic.com/news/integrations">
                support for Integrations
              </Link>
              , which support remote MCP servers. With WorkOS, we can add
              authorization to that MCP server.
            </p>
            <p className="my-3 text-base break-words">
              If your Claude account has Integrations available, go to the
              Integrations section of the Settings menu, select &quot;Add
              more&quot;, and enter &quot;MCP Shop&quot; in the name, and{" "}
              <code>https://mcp.shop/sse</code> in the URL field.
            </p>
            <div className="w-full flex justify-center">
              <Image
                alt="Screenshot of Claude Desktop's Settings screen, with the add-custom-integration screen showing."
                className="w-full max-w-[100%] sm:max-w-[90%] md:max-w-[80%] my-3 pt-4"
                height={2068}
                src="/add-custom-integration.png"
                width={2048}
              />
            </div>
            <h4 className="text-base sm:text-lg font-bold my-3 pt-4">
              Option 2: Local MCP
            </h4>
            <p className="my-3 text-base break-words">
              You can also order MCP swag via a local MCP server via{" "}
              <Link href="https://github.com/geelen/mcp-remote">
                <code>mcp-remote</code>
              </Link>
              .
            </p>
            <p className="my-3 text-base break-words">
              In Claude, add the following to your{" "}
              <Link href="https://modelcontextprotocol.io/quickstart/user">
                <code>claude_desktop_config.json</code> file
              </Link>
              . If you already have stuff in there, make sure to add it, and not
              replace it. (And maybe back up the file first!)
            </p>
            <div className="w-full overflow-x-auto">
              <pre className="my-3 p-2 sm:p-4 text-xs sm:text-sm border rounded-lg border-neutral-700 bg-neutral-900 whitespace-pre-wrap sm:whitespace-pre">{`{
  "mcpServers": {
    "mcp.shop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.shop/mcp"]
    }
  }
}`}</pre>
            </div>
            <p className="my-3 text-base break-words">
              Setup for other tools (like{" "}
              <Link href="https://block.github.io/goose/">Goose</Link>) is
              generally pretty similar: a <code>command</code> string, and an
              `args` list of strings. Support for remote MCP servers is still
              new, so for now a lot of tools will require a proxy like{" "}
              <code>mcp-remote</code>.
            </p>
            <div className="flex justify-center w-full">
              <Button
                color="gray"
                variant="outline"
                highContrast
                size="3"
                onClick={() => {
                  dialogRef.current?.close();
                }}
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      <Button
        color="gray"
        variant="outline"
        highContrast
        size="3"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        {openButtonLabel}
      </Button>
    </>
  );
};
