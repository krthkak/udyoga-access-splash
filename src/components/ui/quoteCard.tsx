import React from "react";

export type QuoteProps = {
  quoteColor: "green" | "yellow" | "blue" | "purple";
  text: string;
  subText: string;
};

const getQuoteColor = (color: QuoteProps["quoteColor"]) => {
  switch (color) {
    case "green":
      return "text-udyoga-green";
    case "yellow":
      return "text-udyoga-yellow";
    case "purple":
      return "text-udyoga-accent";
    default:
      return "text-udyoga-blue";
  }
};

const QuoteCard = ({ quoteColor, text, subText }: QuoteProps) => {
  return (
    <article className="relative shadow-md border border-[#f1f1f1] bg-white p-6 min-h-[150px]">
      <div
        className={`quote absolute ${getQuoteColor(
          quoteColor
        )} text-9xl font-poppins-sans top-[-8] left-0`}
      >
        &quot;
      </div>
      <p>{text}</p>
      <p className="text-xs text-right mt-4">{subText}</p>
    </article>
  );
};

export default QuoteCard;
