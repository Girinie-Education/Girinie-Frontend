import React, { useState, useRef, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom"; // ★★★ useParams 임포트 ★★★
import ChildSidebar from "@/components/common/ChildSidebar";
import { Send } from "lucide-react";
import { useChildData } from "@/hooks/useChildData";
import giraffeIcon from "@/assets/icons/Girinie.svg";
import LevelButton from "../chatbot/components/LevelButton";
import { startChat, sendChatMessage, getChatHistory } from "@/api/chat";

interface Message {
  id: number;
  sender: "user" | "bot" | "typing";
  text: string;
}

const CATEGORY_MAP = {
  "질서": "order",
  "예절": "manners",
  "자조": "selfcare",
  "청결": "clean",
  "절약": "saving",
  "식습관": "eating",
  "감정조절": "calm",
  "존중": "kindness",
};
type CategoryLabel = keyof typeof CATEGORY_MAP;

export default function ChatBotPage() {
  const { childId } = useParams(); // ★★★ URL에서 자녀 ID 가져오기 ★★★
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [categoryPicked, setCategoryPicked] = useState<string | null>(null);
  const [childLevel, setChildLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const welcomeMessage: Message = { id: Date.now(), sender: "bot", text: "안녕? 오늘은 어떤 걸 공부해볼까?" };
      
      // ★★★ childId가 없으면 로직을 실행하지 않음 ★★★
      if (!childId) {
        setMessages([welcomeMessage]);
        return;
      }

      try {
        // ★★★ 가져온 childId를 사용 ★★★
        const history = await getChatHistory(Number(childId));
        const active = history?.find(s => s.is_active);
        
        if (active) {
          setSessionId(active.id);
          setCategoryPicked(active.category);
          setChildLevel(active.current_level);
          
          const restored = active.messages.map<Message>(m => ({
            id: m.id,
            sender: m.sender === "user" ? "user" : "bot",
            text: m.content,
          }));
          
          setMessages([
            welcomeMessage,
            ...restored,
            { id: Date.now() + 1, sender: "bot", text: `이어서 진행할게! (카테고리: ${active.category})` },
          ]);
        } else {
          setMessages([welcomeMessage]);
        }
      } catch {
        setMessages([welcomeMessage]);
      }
    })();
  }, [childId]);

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

  const handleLevelClick = async (label: CategoryLabel) => {
    if (!childId || sending) return;
    setCategoryPicked(label);
    push(label, "user");
    setSending(true);
    push("...", "typing");
    const englishCategory = CATEGORY_MAP[label];
    if (!englishCategory) {
      replaceLastTyping("잘못된 학습 주제입니다.");
      setSending(false);
      return;
    }
    try {
      // ★★★ 가져온 childId를 사용 ★★★
      const session = await startChat({ child_id: Number(childId), category: englishCategory });
      setSessionId(session.id);
      setChildLevel(session.current_level);
      const initial = session.messages?.map(m => m.content).join("\n");
      replaceLastTyping(initial || `${label} 학습을 시작할게!`);
    } catch (e) {
      replaceLastTyping("세션 시작에 실패했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

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
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
              <div className="mt-2 flex gap-2 items-start">
                {m.sender !== "user" && <img src={giraffeIcon} alt="기린" className="w-10 h-10 mt-1" />}
                <div className="inline-flex flex-col p-4 bg-white/90 rounded-lg shadow whitespace-pre-wrap max-w-lg">
                  <span>{m.text}</span>
                  {!categoryPicked && m.text.includes("어떤 걸 공부") && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {Object.keys(CATEGORY_MAP).map((label) => (
                        <LevelButton key={label} label={label} level={childLevel} onClick={() => handleLevelClick(label as CategoryLabel)}/>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
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