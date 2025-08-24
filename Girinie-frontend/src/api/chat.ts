import { apiClient } from "@/api/common";

export type Sender = "user" | "assistant";

export interface ChatMessage {
  id: number;
  sender: Sender;       
  content: string;
  created_at: string;  
}

export interface ChatSession {
  id: number;
  category: string;      
  current_level: number;
  scenario: string;
  is_active: boolean;
  progress_score: number;
  messages?: ChatMessage[]; 
  created_at: string;
}

export interface StartChatBody {
  child_id: number;
  category: string; 
}

export async function startChat(body: StartChatBody) {
  const { data } = await apiClient.post<ChatSession>("/chat/start/", body, {
    withCredentials: true,
  });
  return data;
}

export interface SendMessageBody {
  session_id: number;
  content: string;
}

export interface SendMessageResult {
  feedback: string;
  score: number;
  level_up?: string;
  next_question?: string;
  session_ended: boolean;
}

export async function sendChatMessage(body: SendMessageBody) {
  const { data } = await apiClient.post<SendMessageResult>("/chat/message/", body, {
    withCredentials: true,
  });
  return data;
}

export async function listAllSessions(childId: number) {
  const { data } = await apiClient.post<ChatSession[]>("/chat/history/", { child_id: childId }, {
    withCredentials: true,
  });
  return data;
}

/** 채팅 세션 데이터를 카테고리별 진행률 데이터로 변환 */
export function transformChatSessionsToProgressBars(sessions: ChatSession[]): Array<{ name: string; level: number }> {
  const categories = ["질서", "예절", "자존", "청결", "감정조절", "존중", "절약", "식습관"];
  
  if (!sessions.length) {
    return categories.map(name => ({ name, level: 0 }));
  }

  // 카테고리별로 그룹화하고 평균 레벨 계산
  const categoryGroups: Record<string, { levels: number[]; scores: number[] }> = {};
  
  sessions.forEach(session => {
    if (!categoryGroups[session.category]) {
      categoryGroups[session.category] = { levels: [], scores: [] };
    }
    categoryGroups[session.category].levels.push(session.current_level);
    categoryGroups[session.category].scores.push(session.progress_score);
  });

  // 각 카테고리의 평균 레벨 계산
  return categories.map(category => {
    const data = categoryGroups[category];
    if (!data) {
      return { name: category, level: 0 };
    }
    
    const avgLevel = data.levels.reduce((sum, level) => sum + level, 0) / data.levels.length;
    const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    
    // 진행도 점수를 레벨에 반영 (0-100 점수를 0-1 범위로 변환하여 레벨에 추가)
    const adjustedLevel = Math.min(4, avgLevel + (avgScore / 100));
    
    return {
      name: category,
      level: Math.round(adjustedLevel * 10) / 10 // 소수점 1자리로 반올림
    };
  });
}

/** 오늘의 학습 내용 요약 생성 */
export function getTodayLearningContent(sessions: ChatSession[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  const todaySessions = sessions.filter(session => {
    if (!session.created_at) return false;
    const sessionDate = new Date(session.created_at).toISOString().split('T')[0];
    return sessionDate === today;
  });

  if (!todaySessions.length) {
    return "오늘은 아직 학습하지 않았습니다.";
  }

  const learningTopics = todaySessions.map(session => {
    const scenarioPreview = session.scenario.slice(0, 40) + (session.scenario.length > 40 ? '...' : '');
    return `• ${session.category} (레벨 ${session.current_level}): ${scenarioPreview}`;
  });

  return learningTopics.join('\n');
}

/** 세션별 메시지 페이지네이션: before 이전의 오래된 메시지부터 limit개 (오래된→최신) */
export async function listSessionMessages(
  sessionId: number,
  params: { before?: number; limit?: number } = {}
) {
  const query = new URLSearchParams();
  if (params.before != null) query.set("before", String(params.before));
  if (params.limit != null) query.set("limit", String(params.limit));
  const qs = query.toString();
  const { data } = await apiClient.get<ChatMessage[]>(
    `/chat/sessions/${sessionId}/messages/${qs ? `?${qs}` : ""}`,
    { withCredentials: true }
  );
  return data;
}
