import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface SubItem {
  name: string;
  href: string;
  icon?: React.ElementType;
}

interface NavDropdownProps {
  name: string;
  items?: SubItem[];
  isActive: boolean;
  onHover: (name: string) => void;
  onLeave: () => void;
}

export const NavDropdown = ({ name, items, isActive, onHover, onLeave }: NavDropdownProps) => {
  const pathname = usePathname();

  return (
    <div className="relative" onMouseEnter={() => items && onHover(name)} onMouseLeave={onLeave}>
      <button
        className={`text-gray-600 hover:text-blue-600 transition-colors py-2 flex items-center
          ${isActive ? "text-blue-600" : ""}`}
      >
        {name === "İSG Yönetimi" ? "İSG Yönetimi" : name}
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform ${isActive ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {items && isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50"
          >
            {items.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLeave}
                  className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors
                    ${pathname === item.href ? "text-blue-600 bg-blue-50/50 font-medium" : ""}`}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {item.name === "Risk Assessment" ? "Risk Değerlendirmesi" : item.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
