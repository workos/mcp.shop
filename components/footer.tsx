import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 py-4 px-6 flex items-center justify-between bg-black">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Image
          src="https://images.workoscdn.com/images/54fa0640-e1d8-4a4c-be3c-ecb445989a94.png?auto=format&fit=clip&q=80"
          alt="Logo"
          href="https://workos.com/?utm_source=mcp_shop&utm_medium=referral&utm_campaign=workos_mcp"
          target="_blank"
          height={75}
          width={75}
          className="mr-2"
        />
      </div>
      {/* Social icons on the right */}
      <div className="flex items-center gap-4">
        <Link
          href="https://x.com/WorkOS?utm_source=mcp_shop&utm_medium=referral&utm_campaign=workos_mcp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaXTwitter className="w-5 h-5 text-neutral-400 hover:text-sky-400 transition" />
        </Link>
        <Link
          href="https://www.linkedin.com/company/workos-inc?utm_source=mcp_shop&utm_medium=referral&utm_campaign=workos_mcp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-5 h-5 text-neutral-400 hover:text-blue-400 transition" />
        </Link>
        <Link
          href="https://www.youtube.com/@WorkOS?utm_source=mcp_shop&utm_medium=referral&utm_campaign=workos_mcp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FaYoutube className="w-5 h-5 text-neutral-400 hover:text-blue-400 transition" />
        </Link>
      </div>
    </footer>
  );
}
