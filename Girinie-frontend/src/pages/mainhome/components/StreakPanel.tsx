import React from "react";
import Card from "./Card";
import Girinie from "@/assets/icons/main/StreakHeight.svg";
import GirinieBg from "@/assets/icons/main/StreakHeightBg.svg";

type Props = {
  days: number;
  maxDays?: number;
  className?: string;
};

const StreakPanel: React.FC<Props> = ({ days, maxDays = 30, className = "" }) => {
  const percent = Math.min(100, Math.max(0, (days / maxDays) * 100));

  return (
    <aside className={`origin-top-left ${className}`} aria-label="기린 스트릭 패널">
      <div className="hidden sm:block w-full">
        <Card>
          <header className="px-3 py-2 text-center font-semibold text-thirdary">
            오늘 ○○의 키 <b className="font-semibold text-thirdary">+{days}cm!</b>
          </header>

          <div
            className="relative w-full aspect-[2/20] max-h-[540px] overflow-hidden rounded-b-2xl"
            style={{
              backgroundImage: `url('${GirinieBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#E6E6E6",
            }}
            aria-label="키 성장 영역"
          >
            {/* 채우기 바 */}
            <div
              className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out motion-reduce:transition-none z-0"
              style={{
                height: `${percent}%`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(253,224,71,0.35) 20%, rgba(253,224,71,0.6) 60%, rgba(234,179,8,0.85) 100%)",
              }}
            />

            {/* 기린: 가운데 정렬 + 크게 */}
            <img
              src={Girinie}
              alt="giraffe"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 md:w-44 lg:w-48 select-none pointer-events-none drop-shadow-sm z-[1]"
              draggable={false}
              loading="lazy"
            />
          </div>
        </Card>
      </div>

      {/* 모바일: 아래 표시 전용 버전 */}
      <div className="sm:hidden">
        <Card>
          <header className="px-3 py-2 text-center font-caption-m text-thirdary">
            오늘 ○○의 키 <b className="font-body2-sb text-thirdary">+{days}cm!</b>
          </header>

          <div className="px-3 pb-3">
            <div
              className="relative w-full rounded-xl overflow-hidden aspect-[11/16] max-h-80"
              style={{
                backgroundImage: `url('${GirinieBg}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#E6E6E6",
              }}
            >
              <div
                className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out motion-reduce:transition-none z-0"
                style={{
                  height: `${percent}%`,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(253,224,71,0.35) 20%, rgba(253,224,71,0.6) 60%, rgba(234,179,8,0.85) 100%)",
                }}
              />
              <img
                src={Girinie}
                alt="giraffe"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 select-none pointer-events-none drop-shadow-sm z-[1]"
                draggable={false}
                loading="lazy"
              />
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
};

export default StreakPanel;
