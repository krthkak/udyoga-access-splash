import React from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CompanyLogo, { CompanyLogoProps } from "@/components/ui/companyLogo";
import { Input } from "@/components/ui/input";
import QuoteCard, { QuoteProps } from "@/components/ui/quoteCard";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  MonitorPlay,
  BookOpen,
  Users,
  Award,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quotes: Array<QuoteProps> = [
  {
    text: "I stopped fearing failure. I started creating. This platform changed the way I learn.",
    subText: "— Sara, Computer Science Graduate",
    quoteColor: "purple",
  },
  {
    text: "I stopped fearing failure. I started creating. This platform changed the way I learn.",
    subText: "— Sara, Computer Science Graduate",
    quoteColor: "blue",
  },
  {
    text: "I stopped fearing failure. I started creating. This platform changed the way I learn.",
    subText: "— Sara, Computer Science Graduate",
    quoteColor: "green",
  },
  {
    text: "I stopped fearing failure. I started creating. This platform changed the way I learn.",
    subText: "— Sara, Computer Science Graduate",
    quoteColor: "yellow",
  },
];

const collaborations: Array<CompanyLogoProps> = [
  {
    companyName: "AISECT",
    logoUrl:
      "https://aisect.org/wp-content/uploads/al_opt_content/IMAGE/aisect.org/wp-content/uploads/2022/09/aisect-logo.png.bv.webp",
  },
  {
    companyName: "AISECT",
    logoUrl:
      "https://aisect.org/wp-content/uploads/al_opt_content/IMAGE/aisect.org/wp-content/uploads/2022/09/aisect-logo.png.bv.webp",
  },
  {
    companyName: "AISECT",
    logoUrl:
      "https://aisect.org/wp-content/uploads/al_opt_content/IMAGE/aisect.org/wp-content/uploads/2022/09/aisect-logo.png.bv.webp",
  },
  {
    companyName: "AISECT",
    logoUrl:
      "https://aisect.org/wp-content/uploads/al_opt_content/IMAGE/aisect.org/wp-content/uploads/2022/09/aisect-logo.png.bv.webp",
  },
];

export default function Home() {
  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 lg:px-8 fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href={"/"}>
            <Image
              src={"/assets/logos/logo.png"}
              alt="udyoga-access"
              width={100}
              height={80}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex gap-4">
              <li>
                <a href="#home" className="text-sm font-medium">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm font-medium">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm font-medium">
                  Services
                </a>
              </li>
              <li>
                <a href="#works" className="text-sm font-medium">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm font-medium">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* <div>
          <Link href={"/login"}>
            <Button className="uppercase">
              <div>Sign Up</div>
              <div>
                <ArrowRight />
              </div>
            </Button>
          </Link>
        </div> */}
      </header>
      <main className="flex flex-col gap-8 row-start-2 w-full pt-32">
        <section
          id="home"
          className="bg-cover lg:bg-auto lg:bg-[url('/assets/images/backgrounds/hero-bg.svg')] bg-no-repeat bg-position-[15%_bottom] md:bg-position-[right_15%] lg:bg-position-[right_25%] md:items-end lg:items-start lg:h-[70vh] flex-col md:flex-row flex px-4 md:px-6 lg:px-8 "
        >
          <h1 className="font-poppins-sans font-bold text-2xl md:text-6xl lg:text-9xl lg:leading-[0.9] mb-4 md:mb-0">
            Learn <br />
            Experiment <br /> <span className="text-udyoga-green">
              Grow
            </span>{" "}
            with <span className="text-udyoga-accent">Confidence</span>.
          </h1>
          <p className="md:w-[50ch] md:text-lg lg:text-2xl ">
            We help graduating students build real-world skills, discover their
            strengths, and get ready for careers that excite them — not just
            jobs that pay the bills.
          </p>
        </section>
        <section
          id="about"
          className="md:mt-0 p-4 md:p-0 md:flex-row md:flex md:h-[50vh] items-center relative z-10 pb-8"
        >
          <section className="md:w-1/2">
            <Image
              className="w-full h-full"
              src={"/assets/images/backgrounds/about-bg.svg"}
              alt="decoration"
              width={300}
              height={400}
            />
          </section>
          <section className=" md:w-1/2 lg:pr-8">
            <p className="uppercase text-udyoga-accent font-poppins-sans font-semibold">
              [our philosophy]
            </p>
            <h2 className="font-poppins-sans md:text-2xl lg:text-3xl font-bold">
              A New Kind of Learning Built for Doers.
            </h2>
            <p className="md:text-lg lg:text-2xl lg:w-[50ch]">
              We believe learning isn&apos;t about memorizing facts — it&apos;s
              about doing, failing, and improving.That&apos;s why our programs
              are designed around experimentation, mentorship, and real-world
              projects.
              <br />
              You&apos;ll make mistakes. You&apos;ll also make{" "}
              <span className="font-bold text-udyoga-green"> progress</span>.
            </p>
          </section>
        </section>
        <section className="md:flex lg:h-[50vh] items-center md:gap-16 md:mt-24 px-4 md:px-6 lg:px-0 relative z-10">
          <section className="md:w-1/2 lg:pl-8">
            <p className="uppercase text-udyoga-accent font-poppins-sans font-semibold">
              [our approach]
            </p>
            <h2 className="font-poppins-sans md:text-2xl lg:text-3xl font-bold">
              Why Students Choose Us
            </h2>
            <section className="grid lg:grid-cols-2 gap-2 md:gap-3 lg:gap-6 pt-4">
              <div className=" p-6 lg:pb-12 bg-udyoga-blue-100 shadow lg:rounded-tl-4xl">
                <p className="font-semibold font-poppins-sans mb-2">
                  Learn by Doing
                </p>
                <p>Hands-on challenges and portfolio-worthy projects.</p>
              </div>
              <div className=" p-6 lg:pb-12 bg-udyoga-blue text-white shadow lg:rounded-tr-4xl">
                <p className="font-semibold font-poppins-sans mb-2">
                  Mentorship That Cares
                </p>
                <p>Guidance from experts who&apos;ve been there.</p>
              </div>
              <div className=" p-6 lg:pb-12 bg-udyoga-yellow shadow lg:rounded-bl-4xl">
                <p className="font-semibold font-poppins-sans mb-2">
                  Career-Ready Skills
                </p>
                <p>Practical training that employers value.</p>
              </div>
              <div className=" p-6 lg:pb-12 bg-udyoga-blue-100 shadow lg:rounded-br-4xl">
                <p className="font-semibold font-poppins-sans mb-2">
                  A Safe Space to Experiment
                </p>
                <p>Grow without the fear of being wrong.</p>
              </div>
            </section>
          </section>
          <section className="md:w-1/2">
            <Image
              className="w-full h-full"
              src={"/assets/images/backgrounds/approach-bg.svg"}
              alt="decoration"
              width={300}
              height={400}
            />
          </section>
        </section>
        <section className="px-4 md:px-6 lg:px-8 md:mt-16 ">
          <section id="services" className="py-12">
            <p className="uppercase text-udyoga-accent font-poppins-sans font-semibold">
              [our services]
            </p>
            <h2 className="font-poppins-sans md:text-2xl lg:text-3xl font-bold">
              Services we deliver with partner colleges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <MonitorPlay className="w-6 h-6 text-udyoga-blue" />
                  <h3 className="font-semibold">
                    Skill Development & Certification
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Short-term programs, courses and assessments leading to
                  recognized certifications and practical skills for the job
                  market.
                </p>
                <div className="mt-4">
                  <Link href="/candidate/activities">
                    <Button variant="ghost">View Programs</Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-udyoga-yellow" />
                  <h3 className="font-semibold">
                    Career Counselling & Placement Support
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dedicated counselling, resume prep, mock interviews and
                  employer engagement to improve placement outcomes.
                </p>
                <div className="mt-4">
                  <Link href="/candidate/drives">
                    <Button variant="ghost">Placement Drives</Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-udyoga-green" />
                  <h3 className="font-semibold">
                    Workshops, Seminars & Industry Activities
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hands-on workshops, guest lectures and industry projects to
                  bridge the gap between classroom learning and workplace needs.
                </p>
                <div className="mt-4">
                  <Link href="#works">
                    <Button variant="ghost">See Events</Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6 text-udyoga-blue-100" />
                  <h3 className="font-semibold">
                    Internships & Project-Based Learning
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Short-term internships and project collaborations with
                  industry partners giving students real project exposure.
                </p>
                <div className="mt-4">
                  <Link href="/candidate/activities">
                    <Button variant="ghost">Find Internships</Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-udyoga-blue-200" />
                  <h3 className="font-semibold">On-the-Job Training (OJT)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  OJT placements where students work on live assignments under
                  employer supervision — part of skill-building and placement
                  readiness programs.
                </p>
                <div className="mt-4">
                  <Link href="/candidate/profile">
                    <Button variant="ghost">Learn About OJT</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <p className="uppercase text-udyoga-accent font-poppins-sans font-semibold">
            [our impact]
          </p>
          <h2 className="font-poppins-sans md:text-2xl lg:text-3xl font-bold">
            What People talk about us
          </h2>
          <section className="py-8">
            <Carousel
              opts={{
                align: "start",
              }}
            >
              <CarouselContent>
                {quotes.map((quote, idx) => (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4" key={idx}>
                    <QuoteCard {...quote} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        </section>
        <section id="works" className="px-4 md:px-6 lg:px-8 ">
          <p className="uppercase text-udyoga-accent font-poppins-sans font-semibold">
            [our partners]
          </p>
          <h2 className="font-poppins-sans md:text-2xl lg:text-3xl font-bold">
            Collaborations
          </h2>
          <section className="py-8">
            <Carousel
              opts={{
                align: "end",
              }}
            >
              <CarouselContent>
                {collaborations.map((collab, idx) => (
                  <CarouselItem className="md:basis-1/4 lg:basis-1/8" key={idx}>
                    <CompanyLogo {...collab} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        </section>
        <section id="contact" className="px-4 md:px-6 lg:px-8 mb-16">
          <h3 className="font-poppins-sans font-bold text-4xl text-center pb-2">
            Ready to Build Your Future?
          </h3>
          <p className="text-center">
            Start learning new skills, discover what you’re capable of, and get
            career-ready — one experiment at a time.
          </p>
          <form
            method="POST"
            action={"/somewhere"}
            className="flex justify-center mt-4 w-full"
          >
            <section className="flex w-full flex-col md:flex-row flex-wrap md:w-2/3 items-center gap-4">
              <section className="md:flex gap-4 w-full">
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="md:w-1/2 mb-4"
                />
                <Input
                  id="institutionName"
                  name="institutionName"
                  className="md:w-1/2"
                  placeholder="Enter your institution name"
                />
              </section>
              <Textarea
                rows={5}
                id="message"
                name="message"
                placeholder="Enter your message"
              ></Textarea>
              <section className="flex justify-center md:justify-end w-full">
                <Button type="submit" className="uppercase">
                  reach out
                </Button>
              </section>
            </section>
          </form>
        </section>
      </main>
    </>
  );
}
