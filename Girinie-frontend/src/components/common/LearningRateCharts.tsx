import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
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
    <div className={`flex gap-8 ${className}`}>
      <RadarChart cx={150} cy={150} outerRadius={100} width={300} height={300} data={data.radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
        <Radar name="평가" dataKey="A" stroke="#FCCF5B" fill="#FCCF5B" fillOpacity={0.6} />
      </RadarChart>

      <ResponsiveContainer width={400} height={300}>
        <BarChart data={data.barData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 4]} />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="level" fill="#ffd054" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LearningRateCharts;