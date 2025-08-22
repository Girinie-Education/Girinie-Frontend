import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ChartData {
  radarData: Array<{ subject: string; A: number }>;
  barData: Array<{ name: string; level: number }>;
}

interface LearningRateChartsProps {
  data: ChartData;
  className?: string;
}

const LearningRateCharts: React.FC<LearningRateChartsProps> = ({ data, className = "" }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <RadarChart cx={200} cy={150} outerRadius={120} width={400} height={300} data={data.radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
        <Radar name="평가" dataKey="A" stroke="#FCCF5B" fill="#FCCF5B" fillOpacity={0.6} />
      </RadarChart>
    </div>
  );
};

export default LearningRateCharts;