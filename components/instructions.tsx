"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button } from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import {
  ChevronDownIcon,
  Cross2Icon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

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
  const [accordionOpen, setAccordionOpen] = React.useState<string | undefined>(
    undefined
  );
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
          className="fixed inset-0 m-auto w-[600px] max-w-[600px] p-3 sm:p-6 md:p-6 border border-neutral-700 rounded-xl bg-background text-foreground overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
          closedby="any"
          ref={dialogRef}
          onClose={() => {
            setAccordionOpen(undefined);
            setDialogOpen(false);
          }}
        >
          <div className="relative w-full">
            <button
              aria-label="Close instructions dialog"
              className="absolute -right-2 -top-2 text-xl sm:text-2xl hover:text-3xl transition-all text-white font-light p-2 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full bg-transparent cursor-pointer hover:bg-neutral-800"
              onClick={() => {
                dialogRef.current?.close();
                setAccordionOpen(undefined);
                setDialogOpen(false);
              }}
              type="button"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
            <div className="w-full overflow-x-hidden pt-0">
              <h1 className="text-xl font-bold font-untitled force-untitled">
                Ordering an MCP tee
              </h1>
              <p
                className="break-words font-untitled force-untitled mb-1 mt-2"
                style={{ fontSize: "13.8px" }}
              >
                Place your order by connecting your favorite MCP-compatible LLM
                to MCP Shop&apos;s MCP server.
              </p>
              <p
                className="break-words mt-2 font-untitled force-untitled mb-6"
                style={{ fontSize: "13.8px" }}
              >
                MCP Shop uses{" "}
                <Link
                  href="https://www.authkit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mcp-link inline-flex items-center gap-1 no-underline"
                >
                  AuthKit{" "}
                  <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
                </Link>
                , so after you&apos;ve installed the MCP server, you&apos;ll be
                prompted to sign up for an MCP Shop account.
              </p>
              <Accordion.Root
                type="single"
                collapsible
                className="w-full flex flex-col gap-2"
                value={accordionOpen}
                onValueChange={setAccordionOpen}
              >
                <Accordion.Item value="claude-integrations">
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between text-left text-base text-white py-4 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 shadow transition group cursor-pointer">
                      <span className="flex items-center">
                        <span className="font-untitled force-untitled mr-1 text-white/70">
                          Option 1:
                        </span>
                        <span className="not-italic font-normal font-untitled force-untitled">
                          Ordering with Claude Integrations
                        </span>
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild forceMount={true}>
                    <AnimatePresence initial={false}>
                      {accordionOpen === "claude-integrations" && (
                        <motion.div
                          key="claude-integrations"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            type: "tween",
                            duration: 0.55,
                            ease: "easeInOut",
                          }}
                          className="px-4 pt-2 pb-4 text-base text-white/90 bg-neutral-950 rounded-b-lg overflow-hidden"
                        >
                          <div>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              Claude recently added{" "}
                              <Link
                                href="https://www.anthropic.com/news/integrations"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                support for Integrations
                              </Link>
                              , which support remote MCP servers. With WorkOS,
                              we can add authorization to that MCP server.
                            </p>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              If your Claude account has Integrations available,
                              go to the Integrations section of the Settings
                              menu, select &quot;Add more&quot;, and enter
                              &quot;MCP Shop&quot; in the name, and{" "}
                              <code>https://mcp.shop/sse</code> in the URL
                              field.
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
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="local-mcp">
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between text-left text-base text-white py-4 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 shadow transition group cursor-pointer">
                      <span className="flex items-center">
                        <span className="font-untitled force-untitled mr-1 text-white/70">
                          Option 2:
                        </span>
                        <span className="not-italic font-normal font-untitled force-untitled">
                          Local MCP
                        </span>
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild forceMount={true}>
                    <AnimatePresence initial={false}>
                      {accordionOpen === "local-mcp" && (
                        <motion.div
                          key="local-mcp"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            type: "tween",
                            duration: 0.55,
                            ease: "easeInOut",
                          }}
                          className="px-4 pt-2 pb-4 text-base text-white/90 bg-neutral-950 rounded-b-lg overflow-hidden"
                        >
                          <div>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              You can also order MCP swag via a local MCP server
                              via{" "}
                              <Link
                                href="https://github.com/geelen/mcp-remote"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                <code>mcp-remote</code>
                              </Link>
                              .
                            </p>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              In Claude, add the following to your{" "}
                              <Link
                                href="https://modelcontextprotocol.io/quickstart/user"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                <code>claude_desktop_config.json</code> file
                              </Link>
                              . If you already have stuff in there, make sure to
                              add it, and not replace it. (And maybe back up the
                              file first!)
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
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              Setup for other tools (like{" "}
                              <Link
                                href="https://block.github.io/goose/"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                Goose
                              </Link>
                              ) is generally pretty similar: a{" "}
                              <code>command</code> string, and an `args` list of
                              strings. Support for remote MCP servers is still
                              new, so for now a lot of tools will require a
                              proxy like <code>mcp-remote</code>.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
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
          setAccordionOpen(undefined);
          setDialogOpen(true);
        }}
      >
        {openButtonLabel}
      </Button>
    </>
  );
};
