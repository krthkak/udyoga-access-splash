"use client";

import {
  BookUser,
  Building2,
  HomeIcon,
  LogOut,
  Menu,
  MonitorPlay,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {};

const CollegeAdminNavbar = (props: Props) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/college-admin", label: "Home", icon: <HomeIcon width={16} /> },

    {
      onClick: () => signOut({ callbackUrl: "/" }),
      label: "Logout",
      icon: <LogOut width={16} />,
      type: "action",
      href: "#",
    },
  ];

  return (
    <header className="fixed w-full z-50 bg-udyoga-blue-100 shadow ">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-8  h-fit">
        <Link href={"/college-admin"}>
          <Image
            src={"/assets/logos/logo.png"}
            alt="udyoga-access"
            width={100}
            height={120}
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                link.onClick && link.onClick();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? "font-bold text-udyoga-blue"
                  : "text-black hover:bg-white/10"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-udyoga-blue-100 flex flex-col gap-2 px-4 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setIsMobileMenuOpen(false);
                link.onClick && link.onClick();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? "font-bold text-udyoga-blue"
                  : "text-black hover:bg-white/10"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default CollegeAdminNavbar;
