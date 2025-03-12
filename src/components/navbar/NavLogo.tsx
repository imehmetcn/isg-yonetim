import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const NavLogo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-8 h-8"
      >
        <Image
          src="/icon.svg"
          alt="İSG Platform Logo"
          width={32}
          height={32}
          priority
          className="rounded-lg"
        />
      </motion.div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        İSG Platform
      </span>
    </Link>
  );
};
