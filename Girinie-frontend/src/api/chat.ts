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
