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
  InfoCircledIcon,
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
    undefined,
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
          className="fixed inset-0 m-auto w-[600px] max-w-[90vw] lg:max-w-[600px] p-3 sm:p-6 md:p-6 border border-neutral-700 rounded-xl bg-background text-foreground overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
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
                  href="https://workos.com/authkit?utm_source=mcp_shop&utm_medium=referral&utm_campaign=workos_mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mcp-link inline-flex items-center gap-1 no-underline"
                >
                  AuthKit{" "}
                  <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
                </Link>
                . After you’ve installed the MCP server, you’ll be prompted to
                sign up for an MCP Shop account.
              </p>
              <Accordion.Root
                type="single"
                collapsible
                className="w-full flex flex-col gap-2"
                value={accordionOpen}
                onValueChange={setAccordionOpen}
              >
                <Accordion.Item value="cursor-integration">
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between text-left text-base text-white py-4 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 shadow transition group cursor-pointer">
                      <span className="flex items-center">
                        <span className="font-untitled force-untitled mr-1 text-white/70">
                          Option 1:
                        </span>
                        <span className="not-italic font-normal font-untitled force-untitled">
                          Connect to Cursor
                        </span>
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild forceMount={true}>
                    <AnimatePresence initial={false}>
                      {accordionOpen === "cursor-integration" && (
                        <motion.div
                          key="cursor-integration"
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
                              Use this Cursor Deeplink button to connect the MCP
                              server to your Cursor app. It can then be access
                              via the Cursor agent chat.
                            </p>
                            <div className="flex md:flex-row flex-col justify-left items-center gap-4">
                              <a
                                href="https://cursor.com/install-mcp?name=mcp.shop&config=eyJjb21tYW5kIjoibnB4IC15IG1jcC1yZW1vdGUgaHR0cHM6Ly9tY3Auc2hvcC9tY3AifQ%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                              >
                                {/* TODO: Add a Next.js Image instead of img here */}
                                <img
                                  src="mcp-install-light.png"
                                  alt="Add mcp.shop to Cursor"
                                  style={{ maxHeight: "32px" }}
                                />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="claude-integrations">
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between text-left text-base text-white py-4 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 shadow transition group cursor-pointer">
                      <span className="flex items-center">
                        <span className="font-untitled force-untitled mr-1 text-white/70">
                          Option 2:
                        </span>
                        <span className="not-italic font-normal font-untitled force-untitled">
                          Order with Claude Integrations
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
                                target="_blank"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                support for Integrations
                                <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
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
                              menu, select Add more. Enter &quot;MCP Shop&quot;
                              in the name, and <code>https://mcp.shop/sse</code>{" "}
                              in the URL field.
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
                          Option 3:
                        </span>
                        <span className="not-italic font-normal font-untitled force-untitled">
                          Order with Local MCP
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
                              You can also order from MCP Shop with a local MCP
                              server via{" "}
                              <Link
                                href="https://github.com/geelen/mcp-remote"
                                target="_blank"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                mcp-remote
                                <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
                              </Link>
                              .
                            </p>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              In&nbsp;
                              <Link
                                href="https://modelcontextprotocol.io/quickstart/user"
                                target="_blank"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                {" "}
                                Claude Desktop
                                <ExternalLinkIcon className="inline w-4 h-4 align-baseline" />
                              </Link>
                              , open the <code>claude_desktop_config.json</code>{" "}
                              file and add the following:
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
                            <div className="p-3 flex items-start gap-2 bg-neutral-900 rounded-md mt-2">
                              <InfoCircledIcon className="w-4 h-4 mt-0.5 text-white/70 shrink-0" />
                              <span
                                className="font-untitled force-untitled"
                                style={{ fontSize: "13.8px" }}
                              >
                                If you already have other MCP servers installed,
                                make sure to add it and not replace them.
                              </span>
                            </div>
                            <p
                              className="my-3 break-words font-untitled force-untitled"
                              style={{ fontSize: "13.8px" }}
                            >
                              Setting up other tools (such as{" "}
                              <Link
                                href="https://block.github.io/goose/"
                                className="mcp-link inline-flex items-center gap-1 no-underline"
                                style={{ fontSize: "13.8px" }}
                              >
                                Goose
                              </Link>
                              ) follows a similar pattern: you’ll define a{" "}
                              <code>command</code> string along with an{" "}
                              <code>args</code> array of strings. Since support
                              for remote MCP servers is still evolving, many
                              tools currently require a proxy like{" "}
                              <code>mcp-remote</code>&nbsp;to interface with
                              these servers.
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
