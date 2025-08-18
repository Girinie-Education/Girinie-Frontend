import { apiClient } from "@/api/common";

export type Sender = "user" | "assistant";

export interface ChatMessage {
  id: number;
  sender: Sender;          // "user" | "assistant"
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: number;
  category: string;        // 스웨거 enum (질서/예절/...)
  current_level: number;
  scenario: string;
  is_active: boolean;
  progress_score: number;
  messages: ChatMessage[]; // 읽기 전용 목록
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
  feedback: string;     // AI 피드백
  score: number;        // 1~5
  level_up?: string;    // 레벨업 메시지(옵션)
  next_question?: string;
  session_ended: boolean;
}

export async function sendChatMessage(body: SendMessageBody) {
  const { data } = await apiClient.post<SendMessageResult>("/chat/message/", body, {
    withCredentials: true,
  });
  return data;
}

export async function getChatHistory(childId: number) {
  const { data } = await apiClient.get<ChatSession[]>("/chat/history/" + childId + "/", {
    withCredentials: true,
  });
  return data;
}
