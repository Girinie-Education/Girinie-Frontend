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

const radarData = [
  { subject: "질서", A: 80 },
  { subject: "배려", A: 65 },
  { subject: "책임", A: 90 },
  { subject: "정직", A: 70 },
  { subject: "표현", A: 50 },
  { subject: "집중", A: 75 },
];

const barData = [
  { name: "질서", level: 3 },
  { name: "배려", level: 2 },
  { name: "책임", level: 4 },
  { name: "정직", level: 3 },
  { name: "표현", level: 1 },
  { name: "집중", level: 2 },
];

const ProgressModal: React.FC = () => {
  return (
    <div className="w-[800px] rounded bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">학습률 상세 보기</h2>
      <div className="mb-8 flex gap-8">
        <RadarChart cx={150} cy={150} outerRadius={100} width={300} height={300} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="평가" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>

        <ResponsiveContainer width={400} height={300}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 4]} />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="level" fill="#ffd054" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-4">
        <label className="font-semibold">오늘 학습 내용</label>
        <div className="mt-2 h-24 rounded border bg-gray-50 p-2" />
      </div>

      <div>
        <label className="font-semibold">오늘의 스탬프</label>
        <div className="mt-2 flex gap-2">{/* 스탬프 아이콘 삽입 위치 */}</div>
        <button className="mt-4 rounded bg-yellow-400 px-4 py-2 text-white">등록</button>
      </div>
    </div>
  );
};

export default ProgressModal;
