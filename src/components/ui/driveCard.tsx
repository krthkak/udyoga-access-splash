import { contrastColorMap } from "@/utils/contrastColorMap";
import Link from "next/link";
import React from "react";

type Props = {
  allowed_sem: number;
  applies: string[];
  available_positions: number;
  company_name: string;
  baseprice: string;
  bg_color: string;
  cgpa_greater_than: number;
  company_details: string;
  created_date: string;
  description: string;
  documents: [];
  enrolled_count: number;
  id: string;
  image: string;
  institution_drive_id: string;
  is_required: boolean;
  keypoints: string[];
  name: string;
  pre_requisities: string[];
  requirements: string;
  stages: string[];
  status: string;
  tag: string;
  updated_date: string;
};

const DriveCard = ({
  name,
  id,
  bg_color,
  tag,
  updated_date,
  company_name,
  company_details,
  available_positions,
}: Props) => {
  return (
    <Link
      href={`/candidate/drives/${id}`}
      key={id}
      className="hover:scale-110 transition-transform"
    >
      <div className="  rounded-xl shadow w-[30ch] p-1 bg-white">
        <section
          className="p-3 rounded-xl rounded-bl-none rounded-br-none"
          style={{
            backgroundColor: bg_color ?? "#205683",
          }}
        >
          <p className="text-xs">{tag}</p>
          <div className="flex justify-between mb-4">
            <div>
              <p
                className="text-xl font-bold line-clamp-1"
                style={{
                  color: contrastColorMap[bg_color],
                }}
              >
                {name}
              </p>
              <p className="text-xs">{company_name}</p>
            </div>
            <div className="w-12 h-12  rounded-full bg-white"></div>
          </div>
          <p className="line-clamp-3 text-xs">{company_details}</p>
        </section>
        <div className="p-3 flex justify-between items-center bg-white">
          <div className="flex flex-col items-center">
            <div
              className="text-2xl font-bold"
              style={{
                color: contrastColorMap[bg_color],
              }}
            >
              {available_positions}
            </div>
            <p className="text-xs">Openings</p>
          </div>
          <p
            className="text-right border rounded-3xl px-2 py-1 text-sm"
            style={{
              borderColor: contrastColorMap[bg_color],
              color: contrastColorMap[bg_color],
            }}
          >
            Apply Now
          </p>
        </div>
      </div>
    </Link>
  );
};

export default DriveCard;
