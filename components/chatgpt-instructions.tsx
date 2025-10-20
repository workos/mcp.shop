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
              <h1 className="text-xl font-bold font-untitled force-untitled">
                Order with ChatGPT
              </h1>
              <p
                className="break-words font-untitled force-untitled mb-1 mt-2"
                style={{ fontSize: "13.8px" }}
              >
                Now you can order your MCP Shop tee directly through ChatGPT using the Apps SDK integration.
              </p>
              <p
                className="break-words mt-2 font-untitled force-untitled mb-6"
                style={{ fontSize: "13.8px" }}
              >
                Simply visit our{" "}
                <Link
                  href="https://chatgpt.com/g/g-68112k8tk-mcp-shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mcp-link inline-flex items-center gap-1 no-underline"
                >
                  ChatGPT GPT{" "}
                  <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
                </Link>
                {" "}and place your order through the conversation interface.
              </p>

              <div className="bg-neutral-900 rounded-lg p-4 mb-6">
                <h2 className="font-untitled force-untitled text-base font-semibold mb-3 text-white">
                  How to add MCP URL to ChatGPT
                </h2>
                <p
                  className="break-words font-untitled force-untitled mb-3"
                  style={{ fontSize: "13.8px" }}
                >
                  To connect the MCP Shop server to ChatGPT, use the following URL:
                </p>
                <code className="block bg-neutral-800 p-3 rounded mb-3 text-white/80 font-mono text-sm">
                  https://mcp.shop/mcp
                </code>
                <p
                  className="break-words font-untitled force-untitled text-white/70"
                  style={{ fontSize: "13.8px" }}
                >
                  This enables you to order shirts directly through ChatGPT using the Apps SDK integration.
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <a
                  href="https://chatgpt.com/g/g-68112k8tk-mcp-shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    color="gray"
                    variant="solid"
                    highContrast
                    size="3"
                    className="font-untitled force-untitled"
                  >
                    Open ChatGPT GPT
                    <ExternalLinkIcon className="inline w-4 h-4 ml-1" />
                  </Button>
                </a>
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
      >
        {openButtonLabel}
      </Button>
    </>
  );
};

