"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Shield,
  Bell,
  ClipboardCheck,
  FileText,
  Users,
  Wrench,
  BarChart2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { NavLogo } from "./navbar/NavLogo";
import { DesktopNav } from "./navbar/DesktopNav";
import { ProfileMenu } from "./navbar/ProfileMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { Button } from "./ui/button";
import Link from "next/link";

const navItems = [
  {
    name: "Anasayfa",
    href: "/",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "İSG Yönetimi",
    items: [
      { name: "Risk Değerlendirme", href: "/risk-assessment", icon: Shield },
      { name: "Denetimler", href: "/audits", icon: ClipboardCheck },
      { name: "Eğitimler", href: "/trainings", icon: Bell },
    ],
  },
  {
    name: "Kayıtlar",
    items: [
      { name: "Belgeler", href: "/documents", icon: FileText },
      { name: "Personel", href: "/personnel", icon: Users },
      { name: "Ekipmanlar", href: "/equipment", icon: Wrench },
    ],
  },
  {
    name: "Analitik",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    name: "Raporlar",
    href: "/reports",
  },
  {
    name: "Ayarlar",
    href: "/settings",
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownHover = (name: string) => {
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <NavLogo />

            <DesktopNav
              navItems={navItems}
              activeDropdown={activeDropdown}
              onDropdownHover={handleDropdownHover}
              onDropdownLeave={handleDropdownLeave}
            />

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <ProfileMenu
                  isOpen={isProfileMenuOpen}
                  setIsOpen={setIsProfileMenuOpen}
                  userName={session.user?.name}
                />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-medium">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all">
                      Üye Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={isMobileMenuOpen} navItems={navItems} session={session} />
    </>
  );
};

export default Navbar;
