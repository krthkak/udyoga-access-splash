"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import GTM from "../analytics/gtm";

type AnalyticsProps = {
  gtmId: string;
  user?: {
    id: string;
    role: string;
    institution: string;
    returning: boolean;
  };
};

export default function Analytics({ gtmId, user }: AnalyticsProps) {
  const pathname = usePathname();
  const triggeredRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "pageview",
        page: pathname,
        user: user || {},
      });
    }
  }, [pathname, user]);

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach((t) => {
        if (percent >= t && !triggeredRef.current.includes(t)) {
          triggeredRef.current.push(t);

          (window as any).dataLayer?.push({
            event: "scroll_depth",
            scroll_percent: t,
            page: pathname,
            user: user || {},
          });
          // Optional: console.log(`Scroll ${t}% logged`);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, user]);

  return <GTM gtmId={gtmId} />;
}
