import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 py-4 px-6 flex items-center justify-between bg-black">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Image
          src="https://images.workoscdn.com/images/54fa0640-e1d8-4a4c-be3c-ecb445989a94.png?auto=format&fit=clip&q=80"
          alt="Logo"
          href="https://www.workos.com/"
          target="_blank"
          height={75}
          width={75}
          className="mr-2"
        />
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
