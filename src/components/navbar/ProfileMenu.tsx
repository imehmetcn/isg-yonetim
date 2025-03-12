import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, LogOut, ChevronDown } from "lucide-react";

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userName?: string | null;
}

export const ProfileMenu = ({ isOpen, setIsOpen, userName }: ProfileMenuProps) => {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-gray-700">{userName || "Kullanıcı"}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50"
          >
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Profil
            </Link>
            <Link
              href="/notifications"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
