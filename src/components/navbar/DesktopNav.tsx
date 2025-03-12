import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavDropdown } from "./NavDropdown";
import { useSession } from "next-auth/react";

interface NavItem {
  name: string;
  href?: string;
  items?: {
    name: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

interface DesktopNavProps {
  navItems: NavItem[];
  activeDropdown: string | null;
  onDropdownHover: (name: string) => void;
  onDropdownLeave: () => void;
}

export const DesktopNav = ({
  navItems,
  activeDropdown,
  onDropdownHover,
  onDropdownLeave,
}: DesktopNavProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map(item => (
        <div key={item.name}>
          {item.href ? (
            <Link
              href={item.href}
              className={`text-gray-600 hover:text-blue-600 transition-colors relative group py-2 flex items-center
                ${pathname === item.href ? "text-blue-600 font-medium" : ""}`}
            >
              {item.name === "Home" ? "Anasayfa" : item.name}
              <motion.span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform origin-left
                  ${pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                initial={false}
              />
            </Link>
          ) : (
            <NavDropdown
              name={item.name}
              items={item.items}
              isActive={activeDropdown === item.name}
              onHover={onDropdownHover}
              onLeave={onDropdownLeave}
            />
          )}
        </div>
      ))}
      {session ? (
        <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
          Profil
        </Link>
      ) : (
        <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
          Giriş Yap
        </Link>
      )}
    </nav>
  );
};
