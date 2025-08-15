import React from "react";

interface LearningRateProps {
  rate: number; // 0 ~ 100
  className?: string;
}

const LearningRate: React.FC<LearningRateProps> = ({ rate, className }) => {
  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">학습 달성률</span>
        <span className="text-sm font-semibold text-gray-900">{rate}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
};

export default LearningRate;
