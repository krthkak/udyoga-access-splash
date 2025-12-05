import { contrastColorMap } from "@/utils/contrastColorMap";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type ActivityCardProps = {
  id: string;
  name: string;
  tag: string;
  description: string;
  taken: number;
  bg_color: string;
};

const ActivityCard = ({
  id,
  name,
  description,
  tag,
  taken,
  bg_color,
}: ActivityCardProps) => {
  return (
    <Link
      href={`/candidate/activities/${id}/`}
      className="hover:scale-110 transition-transform"
    >
      <article className="shadow  rounded-md w-[25ch] flex flex-col bg-white">
        <div className="p-1 ">
          <Image
            src="/assets/images/backgrounds/candidate-bg.svg"
            alt="decoration"
            width={120}
            height={120}
            className="rounded-md rounded-bl-none rounded-br-none w-full object-contain"
            style={{ backgroundColor: bg_color }}
          />
        </div>

        <section className="p-3 pt-1 flex flex-col flex-1 justify-between ">
          <div>
            <small
              className="font-semibold"
              style={{ color: contrastColorMap[bg_color] }}
            >
              {tag}
            </small>
            <p className="font-bold text-lg capitalize line-clamp-1">{name}</p>
            <p className="text-xs line-clamp-3">{description}</p>
          </div>

          <small className="text-right w-full block mt-4 pb-2">
            {taken ? (taken > 100 ? taken : 100) : 100} times taken
          </small>
        </section>
      </article>
    </Link>
  );
};

export default ActivityCard;
