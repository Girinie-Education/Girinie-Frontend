import React from "react";
import Card from "./Card";
import blueStamp from "@/assets/icons/stamp/blue_stamp.svg";
import greenStamp from "@/assets/icons/stamp/green_stamp.svg";
import pinkStamp from "@/assets/icons/stamp/pink_stamp.svg";
import redStamp from "@/assets/icons/stamp/red_stamp.svg";
import yellowStamp from "@/assets/icons/stamp/yellow_stamp.svg";

type Sticker = {
  sticker_type: number;
  label: string;
  count: number;
};

type Props = { stickers: Sticker[] | undefined; className?: string; isBlurred?: boolean };

const STAMP_IMAGES: Record<number, string> = {
  1: blueStamp,
  2: greenStamp,
  3: pinkStamp,
  4: redStamp,
  5: yellowStamp,
};

// 랭킹별 테두리 색상 매핑
const RANK_BORDER_COLORS: string[] = [
  'ring-childLevel-gold',   // 1등 (인덱스 0)
  'ring-childLevel-silver', // 2등 (인덱스 1)
  'ring-childLevel-bronze', // 3등 (인덱스 2)
];

const StickerBoard: React.FC<Props> = ({ stickers, className = "", isBlurred = false }) => {
  const top3 = stickers?.slice(0, 3) || [];

  return (
    <Card title="5월의 스티커" className={`${className} ${isBlurred ? "blur-sm" : ""}`}>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
          {isBlurred ? (
            <div className="col-span-3 text-center text-sm text-gray-500">데이터 없음</div>
          ) : (
            top3.map((sticker, index) => (
              <div
                key={sticker.sticker_type}
                className="w-full rounded-lg flex flex-col items-center justify-center py-3 sm:py-4 min-h-[96px]"
              >
                <div
                  className={`mt-3 aspect-square w-14 sm:w-16 rounded-full flex items-center justify-center
                  ring-2 ring-offset-2 transition-all duration-300
                  ${RANK_BORDER_COLORS[index] || ''}`}
                >
                  {STAMP_IMAGES[sticker.sticker_type] && (
                    <img
                      src={STAMP_IMAGES[sticker.sticker_type]}
                      alt={sticker.label}
                      className="w-full h-full object-contain p-1"
                    />
                  )}
                </div>
                <div className="mt-2 text-sm sm:text-base font-caption-m text-thirdary text-center">
                  {sticker.label}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default StickerBoard;