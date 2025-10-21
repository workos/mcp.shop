"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@radix-ui/themes";
import {
  Cross2Icon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";

declare module "react" {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    closedby?: "none" | "any" | "closerequest";
  }
}

interface ChatGPTInstructionsProps {
  openButtonClassname?: string;
  openButtonLabel: string;
}

export const ChatGPTInstructions = ({ openButtonLabel }: ChatGPTInstructionsProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Show the dialog when dialogOpen becomes true
  React.useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal();
    }
  }, [dialogOpen]);

  return (
    <>
      {dialogOpen && (
        <dialog
          className="fixed inset-0 m-auto w-[600px] max-w-[90vw] lg:max-w-[600px] p-3 sm:p-6 md:p-6 border border-neutral-700 rounded-xl bg-background text-foreground overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
          closedby="any"
          ref={dialogRef}
          onClose={() => {
            setDialogOpen(false);
          }}
        >
          <div className="relative w-full">
            <button
              aria-label="Close ChatGPT instructions dialog"
              className="absolute -right-2 -top-2 text-xl sm:text-2xl hover:text-3xl transition-all text-white font-light p-2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full bg-transparent cursor-pointer hover:bg-neutral-800"
              onClick={() => {
                dialogRef.current?.close();
                setDialogOpen(false);
              }}
              type="button"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
            <div className="w-full overflow-x-hidden pt-0">
              <div className="mb-6">
                <h1 className="text-xl font-bold font-untitled force-untitled mb-2 text-white">
                  Unlock a Top-Secret Apps SDK Only Shirt
                </h1>
                <p
                  className="break-words font-untitled force-untitled text-white/60"
                  style={{ fontSize: "13.8px" }}
                >
                  Follow these steps to access the exclusive RUN MCP shirt design through ChatGPT's Apps SDK.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-neutral-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-sm">
                      1
                    </span>
                    <div className="flex-1">
                      <p
                        className="font-untitled force-untitled text-white/80"
                        style={{ fontSize: "13.8px" }}
                      >
                        Turn on ChatGPT developer mode at{" "}
                        <Link
                          href="https://chatgpt.com/#settings/Connectors/Advanced"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mcp-link inline-flex items-center gap-1 no-underline"
                        >
                          this link
                          <ExternalLinkIcon className="inline w-3 h-3 align-baseline" />
                        </Link>
                        , which allows you to add new connectors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-sm">
                      2
                    </span>
                    <div className="flex-1">
                      <p
                        className="font-untitled force-untitled text-white/80"
                        style={{ fontSize: "13.8px" }}
                      >
                        Create a <strong className="text-white">New Connector</strong> with OAuth turned on. This server is protected by AuthKit.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-sm">
                      3
                    </span>
                    <div className="flex-1">
                      <p
                        className="font-untitled force-untitled text-white/80 mb-2"
                        style={{ fontSize: "13.8px" }}
                      >
                        Add <strong className="text-white">MCP Shop</strong>. Set the MCP Server URL to:
                      </p>
                      <code className="block bg-neutral-800 p-2 rounded text-white/70 font-mono text-xs">
                        https://mcp.shop/mcp
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/70 text-sm">
                      4
                    </span>
                    <div className="flex-1">
                      <p
                        className="font-untitled force-untitled text-white/80"
                        style={{ fontSize: "13.8px" }}
                      >
                        You can now <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-white/70">@mcp.shop</code> and ask it to show you the store items.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-4">
                <p
                  className="font-untitled force-untitled text-white/70 text-center"
                  style={{ fontSize: "13.8px" }}
                >
                  Once connected, you'll unlock access to the exclusive <strong className="text-white">RUN MCP</strong> shirt design.
                </p>
              </div>
            </div>
          </div>
        </dialog>
      )}

      <Button
        color="gray"
        variant="outline"
        highContrast
        size="3"
        onClick={() => {
          setDialogOpen(true);
        }}
        className="relative"
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-white/70">
            New
          </span>
          {openButtonLabel}
        </span>
      </Button>
    </>
  );
};

