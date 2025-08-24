import React from "react";
import blueStamp from "@/assets/icons/stamp/blue_stamp.svg";
import greenStamp from "@/assets/icons/stamp/green_stamp.svg";
import pinkStamp from "@/assets/icons/stamp/pink_stamp.svg";
import redStamp from "@/assets/icons/stamp/red_stamp.svg";
import yellowStamp from "@/assets/icons/stamp/yellow_stamp.svg";

// API 스티커 타입별 매핑
const STICKER_STAMPS: Record<number, string> = {
  1: blueStamp, // "조금 더 노력해봐요" - 파란색
  2: yellowStamp, // "잘하고 있어요" - 노란색
  3: pinkStamp, // "참 잘했어요" - 분홍색
  4: redStamp, // "아주 훌륭해요" - 빨간색
  5: greenStamp, // "정말 최고예요" - 초록색
};

type StickerStampProps = {
  stickerType: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const StickerStamp: React.FC<StickerStampProps> = ({
  stickerType,
  size = "md",
  className = "",
}) => {
  const stampSrc = STICKER_STAMPS[stickerType];

  if (!stampSrc) return null;

  const sizeClasses = {
    sm: "w-[70%] h-auto aspect-square",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <img
      src={stampSrc}
      alt={`스티커 ${stickerType}`}
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

export default StickerStamp;
