import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 py-4 px-6 flex items-center justify-between bg-black">
      {/* Logo on the left */}
      <div className="flex items-center">
        <span className="ml-2 text-sm text-neutral-400">MCP Shop</span>
      </div>
      {/* Social icons on the right */}
      <div className="flex items-center gap-4">
        <Link
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter className="w-5 h-5 text-neutral-400 hover:text-sky-400 transition" />
        </Link>
        <Link
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub className="w-5 h-5 text-neutral-400 hover:text-white transition" />
        </Link>
        <Link
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-5 h-5 text-neutral-400 hover:text-blue-400 transition" />
        </Link>
      </div>
    </footer>
  );
}
