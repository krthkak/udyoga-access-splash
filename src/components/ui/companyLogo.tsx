import Image from "next/image";
import React from "react";

export type CompanyLogoProps = {
  logoUrl: string;
  companyName: string;
};

const CompanyLogo = ({ logoUrl, companyName }: CompanyLogoProps) => {
  return (
    <div className="flex justify-center items-center flex-col">
      <Image src={logoUrl} alt={companyName} width={80} height={80} />
      <p className="text-center mt-2 font-bold text-sm">{companyName}</p>
    </div>
  );
};

export default CompanyLogo;
