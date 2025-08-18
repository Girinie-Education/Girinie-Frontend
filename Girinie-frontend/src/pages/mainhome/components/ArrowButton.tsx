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
    className={`absolute ${side === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2
      z-20 grid place-items-center size-8 md:size-9 rounded-full
      bg-white/90 border ring-1 ring-black/5 shadow
      ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
  >
    {side === "left" ? "‹" : "›"}
  </button>
);

export default ArrowButton;
