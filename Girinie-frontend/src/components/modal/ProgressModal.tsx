import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import LearningRateCharts from "@/components/common/LearningRateCharts";
import CategoryProgressBars from "@/components/common/CategoryProgressBars";
import StickerStamp from "@/components/calendar/StickerStamp";
import {
  fetchAllLevelUpLogs,
  fetchChildUser,
  fetchChildLevelUpLogs,
  transformLogsToChartData,
  transformChildUserToChartData,
} from "@/api/levelup";
import { fetchMonthlyRewards, createReward, RewardUpsertPayload } from "@/api/parent";
import { listAllSessions } from "@/api/chat";

interface ProgressModalProps {
  childId?: number;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string; // (유지하되 내부에서는 오늘 화면만 사용)
}

const ProgressModal: React.FC<ProgressModalProps> = ({ childId, isOpen, onClose, initialDate }) => {
  // 레벨업/아이 정보
  const {
    data: logs = [],
    isLoading: isLogsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ["levelupLogs", childId],
    queryFn: () =>
      childId
        ? import("@/api/levelup").then((api) => api.fetchChildLevelUpLogs(childId))
        : fetchAllLevelUpLogs(),
  });

  const {
    data: child,
    isLoading: isChildLoading,
    error: childError,
  } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildUser(childId!),
    enabled: !!childId,
  });

  const queryClient = useQueryClient();

  // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (시간대 문제 해결)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const todayStr = formatLocalDate(today);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);

  const { data: monthlyRewards = [] } = useQuery({
    queryKey: ["monthlyRewards", childId, yyyy, mm],
    queryFn: () => (childId ? fetchMonthlyRewards(childId, yyyy, mm) : []),
    enabled: !!childId && isOpen,
  });

  // 아이별 레벨업 로그 조회
  const { data: levelUpLogs = [] } = useQuery({
    queryKey: ["levelUpLogs", childId],
    queryFn: () => (childId ? fetchChildLevelUpLogs(childId) : []),
    enabled: !!childId && isOpen,
  });

  // 채팅 세션 기록 조회
  const { data: chatSessions = [] } = useQuery({
    queryKey: ["chatSessions", childId],
    queryFn: () => (childId ? listAllSessions(childId) : []),
    enabled: !!childId && isOpen,
  });

  const [message, setMessage] = useState<string>("");
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null); // 초기에는 선택 없음

  // 모달이 열릴 때마다 선택 상태 리셋 및 날짜 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate || todayStr);
      setSelectedSticker(null);
      setMessage("");
    }
  }, [isOpen, initialDate, todayStr]);

  // 날짜가 변경될 때 선택 상태 리셋 (스탬프가 있는 날은 제외)
  useEffect(() => {
    const selectedReward = monthlyRewards.find((r) => r.date === selectedDate);
    const isToday = selectedDate === todayStr;
    const isFuture = new Date(selectedDate) > new Date(todayStr);

    // 과거 날짜에 스탬프가 있으면 선택 상태를 유지하지 않음 (읽기 전용)
    if (!isToday && !isFuture && selectedReward) {
      setSelectedSticker(null); // 과거 스탬프는 선택하지 않음
    } else {
      setSelectedSticker(null); // 다른 경우는 선택 초기화
    }
    setMessage("");
  }, [selectedDate, monthlyRewards, todayStr]);

  // 영어 카테고리명을 한글로 변환하는 매핑
  const CATEGORY_NAME_MAP: Record<string, string> = {
    order: "질서",
    manners: "예절",
    selfcare: "자존",
    clean: "청결",
    saving: "절약",
    eating: "식습관",
    calm: "감정조절",
    kindness: "존중",
  };

  // 선택한 날짜의 학습 내용 생성
  const selectedDateLearningContent = useMemo(() => {
    if (!chatSessions.length) return "채팅 기록이 없습니다.";

    // 선택된 날짜의 세션들 필터링
    const selectedDateSessions = chatSessions.filter((session) => {
      const firstMessage = session.messages?.[0];
      if (!firstMessage?.created_at) return false;

      const sessionDate = new Date(firstMessage.created_at).toISOString().split("T")[0];
      return sessionDate === selectedDate;
    });

    if (!selectedDateSessions.length) {
      return "이 날에는 학습하지 않았습니다.";
    }

    // 카테고리별 횟수 및 점수 계산
    const categoryData: Record<string, { count: number; totalScore: number }> = {};
    let totalScore = 0;

    selectedDateSessions.forEach((session) => {
      const categoryKorean = CATEGORY_NAME_MAP[session.category] || session.category;
      const score = session.progress_score || 0;
      
      if (!categoryData[categoryKorean]) {
        categoryData[categoryKorean] = { count: 0, totalScore: 0 };
      }
      
      categoryData[categoryKorean].count += 1;
      categoryData[categoryKorean].totalScore += score;
      totalScore += score;
    });

    // "카테고리 N회" 형태로 변환
    const learningTopics = Object.entries(categoryData).map(([category, data]) => {
      return `${category} ${data.count}회`;
    });

    return learningTopics.join(", ") + ` 학습, 총점 ${totalScore}점`;
  }, [chatSessions, selectedDate]);

  const addStampMutation = useMutation({
    mutationFn: (payload: RewardUpsertPayload) => createReward(childId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyRewards", childId] });
      setMessage("");
      alert("스탬프가 성공적으로 등록되었습니다!");
    },
    onError: (error: any) => {
      console.error("스탬프 등록 실패:", error);
      alert("스탬프 등록 중 오류가 발생했습니다.");
    },
  });

  const handleAddStamp = () => {
    if (!childId) return;
    if (selectedSticker === null) {
      alert("스탬프를 선택해주세요.");
      return;
    }
    addStampMutation.mutate({
      date: selectedDate,
      sticker_type: selectedSticker,
      message: message.trim() || undefined,
    });
  };

  // 스티커 옵션 (라벨은 숨기고 아이콘만 노출)
  const stickerOptions = [1, 2, 3, 4, 5];

  const chartData = child ? transformChildUserToChartData(child) : transformLogsToChartData(logs);
  const isLoading = isLogsLoading || isChildLoading;
  const error = logsError || childError;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-[1000px] max-w-[95vw] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{child?.name || "아이"}의 학습 현황</h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div>
          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center text-gray-700">
              학습 데이터를 불러오는 중…
            </div>
          ) : error ? (
            <div className="flex h-[320px] items-center justify-center text-red-500">
              데이터 로드 중 오류가 발생했습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {/* 상단: 좌측 프로그래스 바 + 우측 레이더 차트와 학습 내용 */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* 좌측: 프로그래스 바 */}
                <div className="rounded-lg border p-4">
                  <CategoryProgressBars data={chartData.barData} />
                </div>
                {/* 우측: 레이더 차트 + 학습 내용 */}
                <div className="space-y-4">
                  {/* 레이더 차트 */}
                  <div className="rounded-lg border p-4">
                    <div
                      className="flex items-center justify-center"
                      style={{ minHeight: "240px", paddingTop: "10px", paddingBottom: "10px" }}
                    >
                      <LearningRateCharts data={chartData} />
                    </div>
                  </div>
                  {/* 학습 내용 */}
                  <div className="rounded-lg border">
                    <div className="border-b px-3 py-2 text-sm font-medium">
                      {selectedDate === todayStr
                        ? "오늘 학습 내용"
                        : `${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일 학습 내용`}
                    </div>
                    <div className="p-3">
                      <div className="min-h-[60px] whitespace-pre-line rounded bg-gray-50 p-3 text-sm text-gray-700">
                        {selectedDateLearningContent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단: 스탬프 */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3 text-sm font-medium">오늘의 스탬프</div>
                <div className="p-4">
                  {/* 날짜별 스탬프 처리 */}
                  <div className="mb-4 flex items-center justify-center gap-3">
                    {stickerOptions.map((type) => {
                      const isCurrentlySelected = selectedSticker === type;
                      const isToday = selectedDate === todayStr;
                      const isFuture = new Date(selectedDate) > new Date(todayStr);
                      const selectedReward = monthlyRewards.find((r) => r.date === selectedDate);
                      const isAlreadyReceived = selectedReward?.sticker_type === type;

                      // 스탬프가 이미 있는 날짜 (과거 + 오늘): 읽기 전용
                      if (selectedReward) {
                        const isThisStampReceived = selectedReward.sticker_type === type;
                        return (
                          <button
                            key={type}
                            className={`rounded-full p-2 ${
                              isThisStampReceived
                                ? "opacity-100"
                                : "cursor-not-allowed opacity-30 grayscale"
                            }`}
                            disabled={true}
                          >
                            <StickerStamp stickerType={type} size="lg" />
                          </button>
                        );
                      }

                      // 과거에 스탬프 없는 날: 비활성화
                      if (!isToday && !isFuture) {
                        return (
                          <button
                            key={type}
                            className="cursor-not-allowed rounded-full p-2 opacity-30 grayscale"
                            disabled={true}
                          >
                            <StickerStamp stickerType={type} size="lg" />
                          </button>
                        );
                      }

                      // 오늘(스탬프 없음) 또는 미래 날짜: 선택 가능
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedSticker(type)}
                          className={`rounded-full p-2 transition ${
                            isCurrentlySelected
                              ? "scale-110" // 선택된 것만 확대
                              : selectedSticker === null
                                ? "opacity-100 hover:opacity-80" // 아무것도 선택 안 했을 때는 모두 활성화
                                : "opacity-40 grayscale hover:opacity-80" // 다른 것 선택했을 때는 회색 처리
                          }`}
                          disabled={addStampMutation.isPending}
                        >
                          <StickerStamp stickerType={type} size="lg" />
                        </button>
                      );
                    })}
                  </div>

                  {/* 날짜별 메시지 및 입력 처리 */}
                  {(() => {
                    const isToday = selectedDate === todayStr;
                    const isFuture = new Date(selectedDate) > new Date(todayStr);
                    const selectedReward = monthlyRewards.find((r) => r.date === selectedDate);

                    // 스탬프가 이미 있는 경우 (과거 + 오늘): 읽기 전용
                    if (selectedReward) {
                      return (
                        <div className="text-center">
                          {selectedReward.message && (
                            <p className="mb-4 text-sm text-gray-600">"{selectedReward.message}"</p>
                          )}
                          <button
                            onClick={onClose}
                            className="rounded-md bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
                          >
                            확인
                          </button>
                        </div>
                      );
                    }

                    // 과거 날짜 (스탬프 없음)
                    if (!isToday && !isFuture) {
                      return (
                        <div className="text-center">
                          <p className="mb-4 text-sm text-gray-500">
                            이 날에는 스탬프를 받지 않았습니다.
                          </p>
                          <button
                            onClick={onClose}
                            className="rounded-md bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
                          >
                            확인
                          </button>
                        </div>
                      );
                    }

                    // 오늘(스탬프 없음) 또는 미래 날짜: 입력 가능
                    return (
                      <>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="칭찬 메시지를 입력하세요"
                            className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={255}
                          />
                        </div>

                        <div className="text-center">
                          <button
                            onClick={handleAddStamp}
                            disabled={addStampMutation.isPending}
                            className="rounded-md bg-amber-400 px-6 py-2 text-white transition hover:bg-amber-500 disabled:opacity-50"
                          >
                            {addStampMutation.isPending ? "등록 중…" : "등록"}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
