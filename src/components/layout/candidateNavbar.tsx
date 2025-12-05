"use client";

import {
  BookUser,
  HomeIcon,
  LogOut,
  Menu,
  MonitorPlay,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {};

const CandidateNavbar = (props: Props) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      href: "/candidate",
      label: "Home",
      icon: <HomeIcon width={16} />,
      type: "route",
    },
    {
      href: "/candidate/activities",
      label: "Activities",
      icon: <MonitorPlay width={16} />,
      type: "route",
    },
    {
      href: "/candidate/drives",
      label: "Drives",
      icon: <BookUser width={16} />,
      type: "route",
    },
    {
      href: "/candidate/profile",
      label: "Profile",
      icon: <User width={16} />,
      type: "action",
    },
    {
      onClick: signOut,
      label: "Logout",
      icon: <LogOut width={16} />,
      type: "action",
      href: "#",
    },
  ];

  const isRouteOnboarding = pathname == "/candidate/onboarding";

  return isRouteOnboarding ? null : (
    <header className="fixed md:sticky md:top-6 md:h-screen w-full md:w-2/12 z-50 bg-udyoga-blue-100 shadow md:m-6 rounded-lg md:shadow-2xl/20 md:min-w-[20ch]">
      <div className="flex justify-between items-center md:justify-start md:items-center px-4 md:px-0 md:flex-col   md:h-full ">
        <Link href={"/candidate"}>
          <Image
            src={"/assets/logos/logo.png"}
            alt="udyoga-access"
            width={100}
            height={120}
            className="md:w-36"
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden  gap-4 md:w-full h-full md:flex md:flex-col md:justify-between md:mb-8 md:text-lg">
          <section>
            {links
              .filter((link) => link.type !== "action")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href ?? "#"}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors md:w-full ${
                    pathname === link.href
                      ? "font-bold text-udyoga-blue bg-white "
                      : "text-black hover:bg-white/50"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
          </section>
          <section>
            {links
              .filter((link) => link.type == "action")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href ?? "#"}
                  onClick={() => {
                    link.onClick && link.onClick();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors md:w-full ${
                    pathname === link.href
                      ? "font-bold text-udyoga-blue"
                      : "text-black hover:bg-white/50"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
          </section>
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
              href={link.href ?? "#"}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? "font-bold text-udyoga-blue"
                  : "text-black hover:bg-white/10"
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                link.onClick && link.onClick();
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default CandidateNavbar;
