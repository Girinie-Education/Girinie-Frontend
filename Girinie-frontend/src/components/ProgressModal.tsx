import React from "react";
import { useQuery } from "@tanstack/react-query";
import LearningRateCharts from "@/components/common/LearningRateCharts";
import { 
  fetchAllLevelUpLogs, 
  fetchChildUser,
  transformLogsToChartData, 
  transformChildUserToChartData 
} from "@/api/levelup";

interface ProgressModalProps {
  childId?: number;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ childId }) => {
  const { data: logs = [], isLoading: isLogsLoading, error: logsError } = useQuery({
    queryKey: ["levelupLogs", childId],
    queryFn: () => childId ? import("@/api/levelup").then(api => api.fetchChildLevelUpLogs(childId)) : fetchAllLevelUpLogs(),
  });

  const { data: child, isLoading: isChildLoading, error: childError } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildUser(childId!),
    enabled: !!childId,
  });

  const chartData = child ? transformChildUserToChartData(child) : transformLogsToChartData(logs);
  const isLoading = isLogsLoading || isChildLoading;
  const error = logsError || childError;

  if (isLoading) {
    return (
      <div className="w-[800px] rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">학습률 상세 보기</h2>
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-lg">학습률 데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[800px] rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">학습률 상세 보기</h2>
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-lg text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[800px] rounded bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">학습률 상세 보기</h2>
      <div className="mb-8">
        <LearningRateCharts data={chartData} />
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
