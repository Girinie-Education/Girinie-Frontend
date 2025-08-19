import React from "react";
import Card from "./Card";

type Sticker = {
  sticker_type: number;
  label: string;
  count: number;
};

type Props = { stickers: Sticker[] | undefined; className?: string; isBlurred?: boolean };

const StickerBoard: React.FC<Props> = ({ stickers, className = "", isBlurred = false }) => {
  const top3 = stickers?.slice(0, 3) || [];

  return (
    <Card title="5월의 스티커" className={`${className} ${isBlurred ? "blur-sm" : ""}`}>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
          {isBlurred ? (
            <div className="col-span-3 text-center text-sm text-gray-500">데이터 없음</div>
          ) : (
            top3.map((sticker) => (
              <div
                key={sticker.sticker_type} // 고유 키로 sticker_type 사용
                className="w-full rounded-lg flex flex-col items-center justify-center py-3 sm:py-4 min-h-[96px]"
              >
                <div className="mt-3 aspect-square w-14 sm:w-16 rounded-full bg-gray-200" />
                <div className="mt-2 text-sm sm:text-base font-caption-m text-thirdary">
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