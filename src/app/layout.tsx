import React from "react";

import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/footer";
// import Analytics from "@/components/ui/analytics";
// import ProviderWrapper from "@/components/contexts/sessionProviderWrapper";
// import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Udyoga Access",
  description:
    "Udyoga Access integrates learning, professional training, and career development into one seamless platform to prepare students for future employment opportunities.",
};

// const user = undefined; // Not needed for landing page

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        {/* <ProviderWrapper> */}
        <>
          {/* <Toaster richColors position="top-right" /> */}
          {/* <Analytics gtmId="GTM-N5GNVDMQ" user={user} /> */}
          {children}
          <Footer />
        </>
        {/* </ProviderWrapper> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
    </html>
  );
}
