// src/components/common/ArrowButton.tsx
import React from "react";

type Props = {
  side: "left" | "right";
  visible: boolean;
  onClick?: () => void;
};

const ArrowButton: React.FC<Props> = ({ side, visible, onClick }) => (
  <button
    type="button"
    aria-label={side === "left" ? "이전 아이" : "다음 아이"}
    onClick={onClick}
    className={`absolute ${side === "left" ? "left-40" : "right-40"} top-1/2 -translate-y-1/2
      z-20 grid place-items-center size-20 md:size-20
      ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      text-5xl font-bold text-tertiary hover:text-gray-700 transition`}
  >
    {side === "left" ? "‹" : "›"}
  </button>
);

export default ArrowButton;