import React from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UnauthroizedPage() {
  return (
    <div className="min-h-[70vh] pt-32 px-4 md:pt-0 md:px-6 lg:px-8 md:mt-6 lg:pt-0">
      <section className="flex flex-col items-center mt-32">
        <Image
          src={"/assets/images/backgrounds/unauthorized-bg.svg"}
          alt="decoration"
          width={500}
          height={500}
        />
        <small>
          Oops! You&apos;re trying to sneak into a place you shouldn&apos;t be.
          Let&apos;s head back home and stay on the right path.
        </small>
      </section>
      <section className="flex justify-center">
        {" "}
        <Link href="/">
          <Button variant={"link"}>Return Home</Button>
        </Link>
      </section>
    </div>
  );
}
