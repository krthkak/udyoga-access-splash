"use client";

import React from "react";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center flex-col justify-center bg-white z-50">
      <Image
        src={"/assets/images/backgrounds/loading-bg.svg"}
        alt="decoration"
        width={500}
        height={500}
      />
      <section>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-udyoga-blue"></div>
        <p className="mt-4 text-udyoga-blue font-medium text-lg">Loading...</p>
      </section>
    </div>
  );
}
