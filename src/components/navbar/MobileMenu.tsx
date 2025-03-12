import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface NavItem {
  name: string;
  href?: string;
  items?: {
    name: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  session?: Session | null;
}

export const MobileMenu = ({ isOpen, navItems }: MobileMenuProps) => {
  const pathname = usePathname();
  const { data: sessionData } = useSession();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden fixed inset-x-0 top-16 bg-white shadow-lg overflow-hidden z-40"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map(item => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors
                        ${pathname === item.href ? "text-blue-600 bg-blue-50/50 font-medium" : "text-gray-700"}`}
                    >
                      {item.name === "Home" ? "Anasayfa" : item.name}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-sm font-medium text-gray-500">{item.name}</div>
                      {item.items?.map(subItem => {
                        const Icon = subItem.icon;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center px-6 py-2 text-gray-700 hover:bg-blue-50 transition-colors
                              ${pathname === subItem.href ? "text-blue-600 bg-blue-50/50 font-medium" : ""}`}
                          >
                            {Icon && <Icon className="w-4 h-4 mr-2" />}
                            {subItem.name === "Risk Assessment"
                              ? "Risk Değerlendirmesi"
                              : subItem.name}
                          </Link>
                        );
                      })}
                    </>
                  )}
                </div>
              ))}
            </nav>

            {!sessionData && (
              <div className="mt-4 flex flex-col space-y-2">
                <Link href="/login" className="w-full">
                  <Button variant="ghost" className="w-full font-medium">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all">
                    Üye Ol
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
