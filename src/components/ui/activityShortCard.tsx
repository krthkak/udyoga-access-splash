import { contrastColorMap } from "@/utils/contrastColorMap";
import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  name: string;
  tag: string;
  description: string;
  taken: number;
  bg_color: string;
};

const ActivityShortCard = ({ id, name, description, bg_color, tag }: Props) => {
  return (
    <Link
      href={`/candidate/activities/${id}/`}
      className="hover:scale-110 transition-transform"
    >
      <section
        className="p-4  flex flex-col flex-1 justify-between rounded-2xl max-w-[30ch] "
        style={{ backgroundColor: bg_color, color: contrastColorMap[bg_color] }}
      >
        <div>
          <p className="font-bold text-lg capitalize line-clamp-1">{name}</p>
          <p className="text-xs line-clamp-2">{description}</p>
        </div>
      </section>
    </Link>
  );
};

export default ActivityShortCard;
