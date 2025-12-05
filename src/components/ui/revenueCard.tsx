import React from "react";

export type RevenueCardProps = { text: string; value: number };

const RevenueCard = ({ text, value }: RevenueCardProps) => {
  return (
    <div className="p-4 bg-udyoga-blue text-white rounded-lg">
      <p className="font-semibold mb-4">{text}</p>
      <p className="text-3xl font-bold text-right">{value.toLocaleString()}</p>
    </div>
  );
};

export default RevenueCard;
