import React from "react";

interface CategoryProgressBarsProps {
  data: Array<{ name: string; level: number }>;
  className?: string;
  /** 최대 레벨 (디폴트 4) */
  maxLevel?: number;
}

const CategoryProgressBars: React.FC<CategoryProgressBarsProps> = ({
  data,
  className = "",
  maxLevel = 4,
}) => {
  // 좌측 라벨 영역 너비(px) — 상단 레벨 라벨 정렬에도 사용
  const labelWidth = 96; // 디자인 상 여백 포함 약 96px

  return (
    <div className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}>
      {/* 상단 Lv.0 ~ Lv.4 라벨 */}
      <div className="relative mb-3" style={{ paddingLeft: labelWidth }}>
        <div className="relative h-6 text-sm text-gray-700">
          {Array.from({ length: maxLevel + 1 }).map((_, i) => {
            const isStart = i === 0;
            const isEnd = i === maxLevel;
            const common = "absolute";
            const style = isEnd
              ? { right: 0 }
              : ({ left: `${(i / maxLevel) * 100}%` } as React.CSSProperties);
            const cls = isStart
              ? common
              : isEnd
                ? `${common} text-right`
                : `${common} -translate-x-1/2`;
            return (
              <span key={i} className={cls} style={style}>
                Lv.{i}
              </span>
            );
          })}
        </div>
      </div>

      {/* 바 리스트 */}
      <div className="space-y-3">
        {data.map((item) => {
          const clamped = Math.max(0, Math.min(item.level, maxLevel));
          const percent = (clamped / maxLevel) * 100;
          return (
            <div key={item.name} className="flex items-center">
              {/* 왼쪽 카테고리 라벨 */}
              <div className="shrink-0 text-base text-gray-700" style={{ width: labelWidth }}>
                {item.name}
              </div>

              {/* 진행 바 영역 */}
              <div className="relative flex-1">
                {/* 배경 트랙 (연한 블루) */}
                <div className="relative h-4 w-full rounded-full bg-[#E6EEF2]">
                  {/* 채워진 바 (노랑) */}
                  <div
                    className="absolute left-0 top-0 h-4 rounded-full bg-[#F9DF63]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProgressBars;
