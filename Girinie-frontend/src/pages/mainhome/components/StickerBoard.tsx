import React from "react";
import Card from "./Card";

type Props = { stickers: number[]; className?: string };

const StickerBoard: React.FC<Props> = ({ stickers, className = "" }) => {
  const top3 = stickers.slice(0, 3);

  return (
    <Card title="5월의 스티커" className={className}>
      <div className="p-4">
        {/* 좁을 때 2열, 보통 3열 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
          {top3.map((rank) => (
            <div
              key={rank}
              className="w-full rounded-lg flex flex-col items-center justify-center
                         py-3 sm:py-4 min-h-[96px]"  /* 고정 h 제거, 최소만 보강 */
            >
              {/* 동그라미는 비율 유지: 가로 기준으로 커짐 */}
              <div className="mt-3 aspect-square w-14 sm:w-16 rounded-full bg-gray-200" />
              <div className="mt-2 text-sm sm:text-base font-caption-m text-thirdary">
                {rank}위 도장!
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StickerBoard;
