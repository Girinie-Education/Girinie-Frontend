// components/LevelButton.tsx
import React from "react";
import classNames from "classnames";

interface LevelButtonProps {
  label: string;
  level: number;
  onClick: (label: string) => void;
}

export default function LevelButton({ label, level, onClick }: LevelButtonProps) {
  const getColorClass = (level: number) => {
    if (level >= 16) return "bg-childLevel-gold";
    if (level >= 11) return "bg-childLevel-silver";
    if (level >= 6) return "bg-childLevel-bronze";
    return "bg-white";
  };

  return (
    <button
      className={classNames(
        "px-4 py-2 rounded border shadow text-black font-semibold transition hover:border-thirdary",
        getColorClass(level)
      )}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
}
