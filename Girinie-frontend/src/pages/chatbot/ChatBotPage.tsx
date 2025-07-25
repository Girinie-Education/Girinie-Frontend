import React, { useState, useRef, useEffect, FormEvent } from "react";
import ChildSidebar from "@/components/common/ChildSidebar";
import { Send } from "lucide-react";
import { useChildData } from "@/hooks/useChildData";
import giraffeIcon from "@/assets/icons/Girinie.svg";
import LevelButton from "../chatbot/components/LevelButton";
import type { ChildUser } from "@/lib/childData";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export default function ChatBotPage() {
  const { data: children = [] } = useChildData();
  const child = children[0];
  const childColor = child?.color ?? "white";

  const COLOR_MAP: Record<string, string> = {
    white: "bg-white",
    bronze: "bg-amber-200",
    silver: "bg-gray-200",
    gold: "bg-yellow-300",
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const levelMap = {
    "질서": child?.order_level ?? 0,
    "예절": child?.manners_level ?? 0,
    "자조": child?.selfcare_level ?? 0,
    "청결": child?.clean_level ?? 0,
    "절약": child?.saving_level ?? 0,
    "식습관": child?.eating_level ?? 0,
    "감정조절": child?.calm_level ?? 0,
    "존중": child?.kindness_level ?? 0,
  };

  // 초기 메시지
  useEffect(() => {
    const welcome: Message = {
      id: Date.now(),
      sender: "bot",
      text: "안녕? 오늘은 어떤 걸 공부해볼까?",
    };
    setMessages([welcome]);
  }, []);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const msg: Message = {
      id: Date.now(),
      sender,
      text: text.trim(),
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage(input.trim(), "user");
    setInput("");

    // 임시 응답
    setTimeout(() => {
      addMessage("죄송해요, 아직 준비 중입니다. 나중에 다시 시도해주세요.", "bot");
    }, 800);
  };

  const handleLevelClick = (label: string) => {
    addMessage(label, "user");

    setTimeout(() => {
      addMessage("설명 준비 중...", "bot");
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <ChildSidebar />
      <div className="ml-60 flex-1 flex flex-col p-6">

        {/* 메시지 리스트 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
          {messages.map((msg, idx) => {
            const isFirstBot = idx === 0 && msg.sender === "bot";
            const justifyClass = msg.sender === "user" ? "justify-end" : "justify-start";
            const baseClass = "inline-flex flex-col p-4 rounded-lg shadow break-words whitespace-pre-wrap items-start bg-white";
            const colorClass = msg.sender === "user"
              ? "bg-white text-gray-800"
              : isFirstBot
                ? `${COLOR_MAP[childColor]} text-gray-800`
                : "bg-white/80 text-gray-900";

            return (
              <div key={msg.id} className={`flex ${justifyClass}`}>
                <div className="mt-25 flex gap-2 items-start">
                  {isFirstBot && (
                    <img src={giraffeIcon} alt="기린" className="w-10 h-10 mt-1" />
                  )}
                  <div className={`${baseClass} ${colorClass}`}>
                    <span className="p-1 mb-3 text-left w-full">{msg.text.trim()}</span>
                    {isFirstBot && (
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(levelMap).map(([label, level]) => (
                          <LevelButton key={label} label={label} level={level} onClick={handleLevelClick} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력창 */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지 입력"
            className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-3 rounded-lg bg-white hover:bg-gray-300 transition">
            <Send size={20} className="text-primary" />
          </button>
        </form>
      </div>
    </div>
  );
}
