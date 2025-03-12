"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();

  // Ana sayfada breadcrumbs gösterme
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    return { href, title };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            href={item.href}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbItems.length - 1 ? "text-blue-600 font-medium" : ""
            }`}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
