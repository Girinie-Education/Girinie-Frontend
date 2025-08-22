import React from "react";

interface CategoryProgressBarsProps {
  data: Array<{ name: string; level: number }>;
  className?: string;
}

const CategoryProgressBars: React.FC<CategoryProgressBarsProps> = ({ data, className = "" }) => {
  return (
    <div className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>Lv.0</span>
        <span>Lv.1</span>
        <span>Lv.2</span>
        <span>Lv.3</span>
        <span>Lv.4</span>
      </div>
      <div className="space-y-4">
        {data.map((item) => {
          const percent = Math.min(100, Math.max(0, (item.level / 4) * 100));
          return (
            <div key={item.name} className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2 text-sm text-gray-700">{item.name}</div>
              <div className="col-span-10">
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-[#F9DF63]"
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