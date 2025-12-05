import Image from "next/image";
import React from "react";

type Props = {
  link: string;
  imgPath: string;
  alt: string;
  label: string;
};

const SocialIcon = ({ link, label, imgPath, alt }: Props) => {
  return (
    <a
      href={link}
      aria-label={label}
      title={label}
      className="bg-white inline-block p-2 rounded-full hover:scale-50 transition-transform "
    >
      <Image src={imgPath} width={24} height={24} alt={alt} />
    </a>
  );
};

export default SocialIcon;
