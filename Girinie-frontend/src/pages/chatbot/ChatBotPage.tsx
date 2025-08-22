import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import ChildSidebar from "@/components/common/ChildSidebar";
import { Send } from "lucide-react";
import { useChildData } from "@/hooks/useChildData";
import giraffeIcon from "@/assets/icons/SunglassTeacher.svg";
import LevelButton from "../chatbot/components/LevelButton";
import {
  startChat,
  sendChatMessage,
  listAllSessions,
  type ChatMessage as APIMessage,
  type ChatSession,
} from "@/api/chat";

interface Message {
  id: number;
  sender: "user" | "bot" | "typing" | "system";
  text: string;
  ts?: number;
}

const CATEGORY_MAP = {
  질서: "order",
  예절: "manners",
  자조: "selfcare",
  청결: "clean",
  절약: "saving",
  식습관: "eating",
  감정조절: "calm",
  존중: "kindness",
} as const;
type CategoryLabel = keyof typeof CATEGORY_MAP;
const REVERSE_CATEGORY_MAP: Record<string, CategoryLabel> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([ko, en]) => [en, ko as CategoryLabel])
) as Record<string, CategoryLabel>;

const LAST_CAT_EN = "chat.lastCategoryEn";
const LAST_ENDED = "chat.lastEnded";
const getPersist = () => {
  try {
    return {
      catEn: localStorage.getItem(LAST_CAT_EN),
      ended: localStorage.getItem(LAST_ENDED) === "1",
    };
  } catch {
    return { catEn: null as string | null, ended: true };
  }
};
const setPersist = (catEn: string | null, ended: boolean) => {
  try {
    if (catEn) localStorage.setItem(LAST_CAT_EN, catEn);
    else localStorage.removeItem(LAST_CAT_EN);
    localStorage.setItem(LAST_ENDED, ended ? "1" : "0");
  } catch {}
};

const toUiSender = (apiSender: string): "user" | "bot" => {
  const s = (apiSender || "").toLowerCase();
  return s === "user" || s === "child" ? "user" : "bot";
};

export default function ChatBotPage() {
  const { childId: childIdFromUrl } = useParams();
  const { data: children = [], loading: childLoading } = useChildData();

  const effectiveChildId = useMemo(() => {
    if (childIdFromUrl) return Number(childIdFromUrl);
    return children[0]?.id ?? null;
  }, [childIdFromUrl, children]);

  const child = useMemo(() => {
    if (!effectiveChildId) return undefined;
    return children.find((c) => c.id === effectiveChildId);
  }, [children, effectiveChildId]);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const hasActive = currentSessionId != null;

  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const levelOf = (label: CategoryLabel) => {
    if (!child) return 0;
    switch (label) {
      case "질서": return child.order_level;
      case "예절": return child.manners_level;
      case "자조": return child.selfcare_level;
      case "청결": return child.clean_level;
      case "절약": return child.saving_level;
      case "식습관": return child.eating_level;
      case "감정조절": return child.calm_level;
      case "존중": return child.kindness_level;
      default: return 0;
    }
  };

  const apiToUi = (m: APIMessage): Message => {
    const ts = m.created_at ? Date.parse(m.created_at) : Number(m.id) || Date.now();
    return { id: m.id, sender: toUiSender((m as any).sender), text: m.content, ts };
  };

  const push = (text: string, sender: Message["sender"]) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text: text.trim(), ts: Date.now() },
    ]);

  const replaceLastTyping = (text: string) =>
    setMessages((prev) => {
      const i = [...prev].reverse().findIndex((m) => m.sender === "typing");
      if (i < 0) return prev;
      const idx = prev.length - 1 - i;
      const next = [...prev];
      next[idx] = { ...next[idx], sender: "bot", text };
      return next;
    });

  const buildMergedTimeline = useCallback((all: ChatSession[]) => {
    const merged: Message[] = [];
    for (const s of all) {
      const msgs = s.messages ?? [];
      const firstTs = msgs[0]?.created_at ? Date.parse(msgs[0].created_at) : Date.now();
      const ko = REVERSE_CATEGORY_MAP[s.category] ?? (s.category as CategoryLabel);
      merged.push({
        id: Number(`${s.id}0000`) || (firstTs - 1),
        sender: "system",
        text: `주제 선택 · ${ko}`,
        ts: firstTs - 1,
      });
      for (const m of msgs) merged.push(apiToUi(m));
    }
    merged.sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
    return merged;
  }, []);

  const endCurrentSession = useCallback(() => {
    setCurrentSessionId(null);
    setPersist(null, true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "bot",
        text: "안녕? 오늘은 어떤 걸 공부해볼까?",
        ts: Date.now(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (childLoading) return;

    if (!effectiveChildId) {
      setMessages([
        { id: Date.now(), sender: "bot", text: "안녕? 오늘은 어떤 걸 공부해볼까?", ts: Date.now() },
      ]);
      setCurrentSessionId(null);
      return;
    }

    const loadChatHistory = async () => {
      try {
        const allSessions = await listAllSessions(effectiveChildId);
        setSessions(allSessions);

        const activeSession = allSessions.find(s => s.is_active);
        const nonActiveSessions = allSessions.filter(s => !s.is_active);

        const mergedMessages = buildMergedTimeline(nonActiveSessions);
        
        if (activeSession) {
          const activeSessionMessages = activeSession.messages
            ?.map(apiToUi)
            .sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0)) || [];
          
          setMessages([
            ...mergedMessages,
            {
              id: Number(`${activeSession.id}0000`),
              sender: "system",
              text: `주제 선택 · ${REVERSE_CATEGORY_MAP[activeSession.category] ?? activeSession.category}`,
              ts: Date.parse(activeSession.created_at) - 1
            },
            ...activeSessionMessages,
          ]);
          setCurrentSessionId(activeSession.id);
          setPersist(activeSession.category, false);
        } else {
          setMessages([
            ...mergedMessages,
            { id: Date.now(), sender: "bot", text: "안녕? 오늘은 어떤 걸 공부해볼까?", ts: Date.now() },
          ]);
          setCurrentSessionId(null);
          setPersist(null, true);
        }
      } catch (err) {
        console.error("Failed to load chat sessions:", err);
        setMessages([
          { id: Date.now(), sender: "bot", text: "채팅 기록을 불러오는데 실패했어요.", ts: Date.now() },
        ]);
        setCurrentSessionId(null);
      } finally {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 0);
      }
    };

    loadChatHistory();
  }, [childLoading, effectiveChildId, buildMergedTimeline]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleLevelClick = async (label: CategoryLabel) => {
    if (!effectiveChildId || sending || hasActive) return;

    push(`주제 선택 · ${label}`, "system");
    setSending(true);
    push("...", "typing");

    const englishCategory = CATEGORY_MAP[label];
    try {
      const session = await startChat({ child_id: effectiveChildId, category: englishCategory });
      setSessions((prev) => [session, ...prev.map((s) => ({ ...s, is_active: false }))]);
      setCurrentSessionId(session.id);
      setPersist(englishCategory, false);
      
      const botMessages = (session.messages ?? [])
        .filter((m) => toUiSender((m as any).sender) === "bot")
        .map(apiToUi);
      
      replaceLastTyping(botMessages[0]?.text || `${label} 학습을 시작할게!`);
      
    } catch {
      replaceLastTyping("세션 시작에 실패했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (!hasActive || !currentSessionId) {
      push("진행 중인 학습이 없어요. 주제를 먼저 선택해 주세요.", "bot");
      return;
    }

    setInput("");
    push(text, "user");
    setSending(true);
    push("...", "typing");

    try {
      const res = await sendChatMessage({ session_id: currentSessionId, content: text });

      const feedback = res.feedback;

      if (res.level_up) {
        replaceLastTyping(`${feedback}\n${res.level_up}`);
        endCurrentSession();
        return;
      }
      
      if (res.session_ended) {
        replaceLastTyping(feedback);
        endCurrentSession();
        return;
      }

      replaceLastTyping(feedback);
      if (res.next_question) {
        push(res.next_question, "bot");
      }
      
    } catch {
      replaceLastTyping("메시지 전송에 실패했어요. 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  const latestWelcomeIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.sender !== "user" && m.text.includes("어떤 걸 공부")) return i;
    }
    return -1;
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-primary">
      <ChildSidebar />
      <div className="mt-25 ml-60 flex flex-col flex-1 relative">
        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-24">
          {messages.map((m, idx) => {
            if (m.sender === "system") {
              return (
                <div key={`${m.id}-${idx}`} className="flex justify-center my-6">
                  <div className="px-3 py-1 rounded-full border border-gray-300 bg-white/95 text-gray-700 text-xs shadow-sm">
                    {m.text}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={`${m.id}-${idx}`}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div className="mt-2 flex gap-2 items-start">
                  {m.sender !== "user" && (
                    <img src={giraffeIcon} alt="기린" className="w-10 h-10 mt-1" />
                  )}
                  <div className="inline-flex flex-col p-4 bg-white/90 rounded-lg shadow whitespace-pre-wrap break-words max-w-lg">
                    <span>{m.text}</span>

                    {!hasActive && idx === latestWelcomeIndex && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {(Object.keys(CATEGORY_MAP) as CategoryLabel[]).map((label) => (
                          <LevelButton
                            key={label}
                            label={label}
                            level={levelOf(label)}
                            onClick={() => handleLevelClick(label)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="w-full px-15 py-8 bg-primary border-t flex items-center gap-2 sticky bottom-0"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onInput={autoResize}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as unknown as FormEvent);
              }
            }}
            placeholder={
              hasActive ? "메시지 입력 (Shift+Enter 줄바꿈)" : "주제를 선택해 새 세션을 시작해요"
            }
            className="flex-1 p-3 rounded-lg border focus:outline-none resize-none leading-6 min-h-[48px] max-h-[180px] bg-white"
            disabled={!hasActive || sending}
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50"
            disabled={!hasActive || sending}
          >
            <Send size={20} className="text-gray-400" />
          </button>
        </form>
      </div>
    </div>
  );
}