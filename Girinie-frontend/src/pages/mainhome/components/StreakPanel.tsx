import React from "react";
import Card from "./Card";
import Girinie from "@/assets/icons/main/StreakHeight.svg";
import GirinieBg from "@/assets/icons/main/StreakHeightBg.svg";

type Props = {
  days: number | undefined;
  childName: string | undefined; // ★★★ 자녀 이름 prop 추가 ★★★
  maxDays?: number;
  className?: string;
  isBlurred?: boolean;
};

const StreakPanel: React.FC<Props> = ({ days, childName, maxDays = 30, className = "", isBlurred = false }) => {
  const percent = Math.min(100, Math.max(0, (days || 0) / maxDays) * 100);

  return (
    <aside className={`origin-top-left ${className}`} aria-label="기린 스트릭 패널">
      <div className="hidden sm:block w-full">
        <Card className={isBlurred ? "blur-sm" : ""}>
          <header className="px-3 py-2 text-center font-semibold text-thirdary">
            {/* ★★★ 자녀 이름 표시 ★★★ */}
            오늘 {isBlurred ? "○○" : childName}의 키 <b className="font-semibold text-thirdary">+{isBlurred ? "?" : days}cm!</b>
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
            {isBlurred ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                데이터 없음
              </div>
            ) : (
              <>
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
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 md:w-44 lg:w-48 select-none pointer-events-none drop-shadow-sm z-[1]"
                  draggable={false}
                  loading="lazy"
                />
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="sm:hidden">
        <Card className={isBlurred ? "blur-sm" : ""}>
          <header className="px-3 py-2 text-center font-caption-m text-thirdary">
            {/* ★★★ 자녀 이름 표시 ★★★ */}
            오늘 {isBlurred ? "○○" : childName}의 키 <b className="font-body2-sb text-thirdary">+{isBlurred ? "?" : days}cm!</b>
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
              {isBlurred ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  데이터 없음
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
};

export default StreakPanel;