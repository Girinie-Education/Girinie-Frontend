import React, { useState, useRef, useEffect, FormEvent } from "react";
import ChildSidebar from "@/components/common/ChildSidebar";
import { Send } from "lucide-react";
import { useChildData } from "@/hooks/useChildData";
import giraffeIcon from "@/assets/icons/Girinie.svg";
import LevelButton from "../chatbot/components/LevelButton";
import { startChat, sendChatMessage, getChatHistory, type ChatMessage } from "@/api/chat";

interface Message {
  id: number;
  sender: "user" | "bot" | "typing";
  text: string;
}

export default function ChatBotPage() {
  const { data: children = [] } = useChildData();
  const child = children[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [categoryPicked, setCategoryPicked] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 첫 진입: 환영 + 기존 세션 이어받기 시도
  useEffect(() => {
    setMessages([
      { id: Date.now(), sender: "bot", text: "안녕? 오늘은 어떤 걸 공부해볼까?" },
    ]);
    (async () => {
      if (!child?.id) return;
      try {
        const history = await getChatHistory(child.id);
        const active = history?.find(s => s.is_active);
        if (active) {
          setSessionId(active.id);
          setCategoryPicked(active.category);
          // 서버 메시지를 UI 포맷으로 변환
          const restored = active.messages.map<Message>(m => ({
            id: m.id,
            sender: m.sender === "user" ? "user" : "bot",
            text: m.content,
          }));
          setMessages(prev => [
            { id: Date.now() + 1, sender: "bot", text: `이어서 진행할게! (카테고리: ${active.category})` },
            ...prev,
            ...restored,
          ]);
        }
      } catch { /* 이어받기 실패는 무시 */ }
    })();
  }, [child?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const push = (text: string, sender: Message["sender"]) =>
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender, text: text.trim() }]);

  const replaceLastTyping = (text: string) =>
    setMessages(prev => {
      const i = [...prev].reverse().findIndex(m => m.sender === "typing");
      if (i < 0) return prev;
      const idx = prev.length - 1 - i;
      const next = [...prev];
      next[idx] = { ...next[idx], sender: "bot", text };
      return next;
    });

  // 카테고리 버튼 클릭 → 세션 시작
  const handleLevelClick = async (label: string) => {
    if (!child?.id || sending) return;
    setCategoryPicked(label);
    push(label, "user");
    setSending(true);
    push("...", "typing");
    try {
      const session = await startChat({ child_id: child.id, category: label });
      setSessionId(session.id);
      // 서버가 되돌려준 초기 메시지들 표시
      const initial = session.messages?.map(m => m.content).join("\n");
      replaceLastTyping(initial || `${label} 학습을 시작할게!`);
    } catch (e) {
      replaceLastTyping("세션 시작에 실패했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  // 사용자 입력 전송
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    if (!sessionId) {
      push("먼저 학습 주제를 선택해줘! (위 버튼)", "bot");
      return;
    }
    push(text, "user");
    setInput("");
    setSending(true);
    push("...", "typing");
    try {
      const res = await sendChatMessage({ session_id: sessionId, content: text });
      const parts = [
        res.feedback,
        typeof res.score === "number" ? `\n점수: ${res.score}/5` : "",
        res.level_up ? `\n${res.level_up}` : "",
        res.next_question ? `\n다음 질문: ${res.next_question}` : "",
        res.session_ended ? `\n(세션이 종료되었어요)` : "",
      ].filter(Boolean);
      replaceLastTyping(parts.join(""));
      if (res.session_ended) setSessionId(null);
    } catch (e) {
      replaceLastTyping("메시지 전송에 실패했어요. 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <ChildSidebar />
      <div className="mt-25 ml-60 flex flex-col flex-1 relative">
        {/* 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
              <div className="mt-2 flex gap-2 items-start">
                {m.sender !== "user" && <img src={giraffeIcon} alt="기린" className="w-10 h-10 mt-1" />}
                <div className="inline-flex flex-col p-4 bg-white/90 rounded-lg shadow whitespace-pre-wrap">
                  <span>{m.text}</span>
                  {/* 처음 환영 메시지 밑에 카테고리 버튼 */}
                  {!categoryPicked && m.text.includes("어떤 걸 공부") && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[
                        "질서","예절","자조","청결","절약","식습관","감정조절","존중",
                      ].map((label) => (
                        <LevelButton key={label} label={label} level={0} onClick={handleLevelClick}/>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* 입력창: 고정 위치 */}
        <form
          onSubmit={handleSend}
          className="w-full px-15 py-8 bg-primary border-t flex items-center gap-2 sticky bottom-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sessionId ? "메시지 입력" : "먼저 학습 주제를 선택해 주세요"}
            className="flex-1 p-3 rounded-lg border focus:outline-none"
            disabled={!sessionId || sending}
          />
          <button type="submit" className="p-3 rounded-lg bg-white hover:bg-gray-100" disabled={!sessionId || sending}>
            <Send size={20} className="text-gray-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
