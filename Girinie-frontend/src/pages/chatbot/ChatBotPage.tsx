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
  getActiveSession,
  listSessionMessages,
  type ChatMessage as APIMessage,
} from "@/api/chat";

interface Message {
  id: number;
  sender: "user" | "bot" | "typing";
  text: string;
}

/** 한글 → 영문 (전송용) */
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

/** 영문 → 한글 (표시용) */
const REVERSE_CATEGORY_MAP: Record<string, CategoryLabel> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k as CategoryLabel])
) as Record<string, CategoryLabel>;

/** 로컬 보강(레벨업 전 자동 이어하기 플래그) */
const RESUME_FLAG = "chat.resumeNeeded";
const RESUME_CAT = "chat.resumeCategory";

export default function ChatBotPage() {
  const { childId: childIdFromUrl } = useParams();
  const { data: children = [], loading: childLoading } = useChildData();

  // URL childId 없으면 첫 자녀로 폴백
  const effectiveChildId = useMemo(() => {
    if (childIdFromUrl) return Number(childIdFromUrl);
    return children[0]?.id ?? null;
  }, [childIdFromUrl, children]);

  const child = useMemo(() => {
    if (!effectiveChildId) return undefined;
    return children.find((c) => c.id === effectiveChildId);
  }, [children, effectiveChildId]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // 세션/주제 상태
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionActive, setSessionActive] = useState(false);      // 서버 is_active
  const [canStartNewTopic, setCanStartNewTopic] = useState(false); // 레벨업 "완료"시에만 true
  const [currentCategoryEn, setCurrentCategoryEn] = useState<string | null>(null); // 이어하기에 사용
  const [categoryLabel, setCategoryLabel] = useState<CategoryLabel | null>(null);  // 표시용
  const [childLevel, setChildLevel] = useState(0);

  // 무한 스크롤
  const [hasMore, setHasMore] = useState(true);
  const [oldestMsgId, setOldestMsgId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoadingOlder = useRef(false);

  // 버튼 색상(자녀 레벨)
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

  const apiToUi = (m: APIMessage): Message => ({
    id: m.id,
    sender: m.sender === "user" ? "user" : "bot",
    text: m.content,
  });

  const push = (text: string, sender: Message["sender"]) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text: text.trim() },
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

  const isWelcomeBubble = (m: Message, idx: number) =>
    m.sender === "bot" &&
    m.text.includes("어떤 걸 공부") &&
    idx === messages.findIndex((mm) => mm.text.includes("어떤 걸 공부"));

  /** 로컬 플래그 helpers */
  const setResumeNeeded = (need: boolean, catEn?: string | null) => {
    if (need) {
      localStorage.setItem(RESUME_FLAG, "1");
      if (catEn) localStorage.setItem(RESUME_CAT, catEn);
    } else {
      localStorage.removeItem(RESUME_FLAG);
      localStorage.removeItem(RESUME_CAT);
    }
  };
  const getResumeInfo = () => ({
    need: localStorage.getItem(RESUME_FLAG) === "1",
    catEn: localStorage.getItem(RESUME_CAT) || null,
  });

  /** 같은 주제 자동 이어하기 (봇 질문이 바로 보이도록 보장) */
  const resumeSameTopic = useCallback(
    async (englishCategory: string) => {
      if (!effectiveChildId) return;
      setSending(true);
      // 안내 말풍선 + typing
      push("이전에 하던 주제를 이어서 진행할게!", "bot");
      push("...", "typing");
      try {
        const newSession = await startChat({
          child_id: effectiveChildId,
          category: englishCategory,
        });

        setSessionId(newSession.id);
        setSessionActive(true);
        setCanStartNewTopic(false);
        setCurrentCategoryEn(englishCategory);
        setCategoryLabel(
          (REVERSE_CATEGORY_MAP[englishCategory] ??
            englishCategory) as CategoryLabel
        );
        setChildLevel(newSession.current_level);

        // 1) typing 교체: 서버가 처음에 내려준 안내/문구들 합치기
        const initialText = (newSession.messages ?? [])
          .map((m) => m.content)
          .join("\n");
        replaceLastTyping(initialText || "이어하기를 시작했어!");

        // 2) 마지막 assistant 메시지를 찾아 "질문 버블"로 별도 표시 (질문이 바로 보이도록)
        const lastAssistant = [...(newSession.messages ?? [])]
          .reverse()
          .find((m) => m.sender === "assistant");
        if (lastAssistant) {
          push(lastAssistant.content, "bot");
        }

        // 무한 스크롤용 기준 갱신
        setHasMore(true);
        setOldestMsgId((newSession.messages ?? [])[0]?.id ?? null);

        // 이어하기 성공 → 로컬 플래그 해제
        setResumeNeeded(false);
      } catch {
        replaceLastTyping("이어하기 시작에 실패했어요. 잠시 후 다시 시도해줘.");
      } finally {
        setSending(false);
      }
    },
    [effectiveChildId]
  );

  /** 초기 로딩: 서버 + 로컬 플래그 기반으로 자동 이어하기 */
  useEffect(() => {
    if (childLoading) return;

    const welcome: Message = {
      id: Date.now(),
      sender: "bot",
      text: "안녕? 오늘은 어떤 걸 공부해볼까?",
    };

    if (!effectiveChildId) {
      setMessages([welcome]);
      setSessionId(null);
      setSessionActive(false);
      setCanStartNewTopic(false);
      setChildLevel(0);
      setHasMore(false);
      return;
    }

    (async () => {
      try {
        const session = await getActiveSession(effectiveChildId);
        const { need: resumeNeedLocal, catEn: resumeCatEnLocal } = getResumeInfo();

        if (session && session.id) {
          // 서버 세션 파싱
          const initialMsgs = (session.messages ?? []).map(apiToUi);
          setMessages(initialMsgs);
          setChildLevel(session.current_level);
          setCurrentCategoryEn(session.category);
          setCategoryLabel(
            (session.is_active
              ? (REVERSE_CATEGORY_MAP[session.category] ??
                  session.category)
              : null) as CategoryLabel | null
          );
          setOldestMsgId(initialMsgs[0]?.id ?? null);
          setHasMore(true);

          if (session.is_active) {
            // 그대로 이어서
            setSessionId(session.id);
            setSessionActive(true);
            setCanStartNewTopic(false);
            setResumeNeeded(false);
          } else {
            // 서버는 비활성: 로컬 플래그가 있으면 "미완료 종료"로 보고 자동 이어하기
            const catToResume = session.category || resumeCatEnLocal || null;
            setSessionId(null);
            setSessionActive(false);
            setCanStartNewTopic(false);

            if (catToResume) {
              await resumeSameTopic(catToResume);
            } else {
              // 카테고리 정보가 없으면 웰컴+선택으로
              setMessages([welcome]);
              setCanStartNewTopic(true);
            }
          }
        } else {
          // 서버에 세션 자체가 없음 → 로컬 플래그가 있으면 그 카테고리로 재개 시도
          if (resumeNeedLocal && resumeCatEnLocal) {
            await resumeSameTopic(resumeCatEnLocal);
          } else {
            setMessages([welcome]);
            setSessionId(null);
            setSessionActive(false);
            setCanStartNewTopic(true); // 최초만 선택 가능
            setChildLevel(0);
            setHasMore(false);
          }
        }

        setTimeout(
          () => bottomRef.current?.scrollIntoView({ behavior: "auto" }),
          0
        );
      } catch {
        // 오류 시에도 새 주제 노출은 막고 사용자가 재시도하게
        setMessages([welcome]);
        setSessionId(null);
        setSessionActive(false);
        setCanStartNewTopic(false);
        setChildLevel(0);
        setHasMore(false);
      }
    })();
  }, [childLoading, effectiveChildId, resumeSameTopic]);

  // 새 메시지 오면 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // 위로 스크롤 시 과거 메시지 로드 (prepend)
  const handleScroll = useCallback(async () => {
    if (!listRef.current || !sessionId || !hasMore || isLoadingOlder.current)
      return;
    const el = listRef.current;
    if (el.scrollTop > 20) return;

    isLoadingOlder.current = true;
    try {
      const older = await listSessionMessages(sessionId, {
        before: oldestMsgId ?? undefined,
        limit: 30,
      });

      if (!older.length) {
        setHasMore(false);
      } else {
        const ui = older.map(apiToUi);
        setMessages((prev) => [...ui, ...prev]); // 앞에 붙임
        setOldestMsgId(ui[0].id);
        requestAnimationFrame(() => {
          if (!listRef.current) return;
          listRef.current.scrollTop = 5; // 대략 보정
        });
      }
    } finally {
      isLoadingOlder.current = false;
    }
  }, [sessionId, hasMore, oldestMsgId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => void handleScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // 새 주제 시작 (레벨업 완료 후에만)
  const handleLevelClick = async (label: CategoryLabel) => {
    if (!effectiveChildId || sending || sessionActive || !canStartNewTopic)
      return;

    setCategoryLabel(label);
    push(label, "user");
    setSending(true);
    push("...", "typing");

    const englishCategory = CATEGORY_MAP[label];
    try {
      const session = await startChat({
        child_id: effectiveChildId,
        category: englishCategory,
      });
      setSessionId(session.id);
      setSessionActive(true);
      setCanStartNewTopic(false);
      setCurrentCategoryEn(englishCategory);
      setChildLevel(session.current_level);

      const initialText = (session.messages ?? [])
        .map((m) => m.content)
        .join("\n");
      replaceLastTyping(initialText || `${label} 학습을 시작할게!`);

      // 시작하자마자 질문이 보이도록 마지막 assistant 메시지 별도 버블
      const lastAssistant = [...(session.messages ?? [])]
        .reverse()
        .find((m) => m.sender === "assistant");
      if (lastAssistant) push(lastAssistant.content, "bot");

      setHasMore(true);
      setOldestMsgId((session.messages ?? [])[0]?.id ?? null);

      // 시작했으니 이어하기 플래그는 불필요
      setResumeNeeded(false);
    } catch {
      replaceLastTyping("세션 시작에 실패했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  // 메시지 전송
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (!sessionId || !sessionActive) {
      push("진행 중인 학습을 먼저 시작하거나 이어서 진행해야 해.", "bot");
      return;
    }

    push(text, "user");
    setInput("");
    setSending(true);
    push("...", "typing");

    try {
      const res = await sendChatMessage({ session_id: sessionId, content: text });

      // 피드백 + 점수
      const feedback = [
        res.feedback,
        typeof res.score === "number" ? `\n점수: ${res.score}/5` : "",
      ]
        .filter(Boolean)
        .join("");
      replaceLastTyping(feedback);

      // 레벨업 축하
      if (res.level_up) push(`🎉 ${res.level_up}`, "bot");

      // 다음 질문
      if (res.next_question) push(res.next_question, "bot");

      // 세션 종료
      if (res.session_ended) {
        push("세션이 종료되었어요 🎉", "bot");

        if (res.level_up) {
          // 레벨업 완료 → 새 주제 허용
          setSessionActive(false);
          setSessionId(null);
          setCanStartNewTopic(true);
          setResumeNeeded(false);
          push("안녕? 오늘은 어떤 걸 공부해볼까?", "bot"); // 웰컴(여기에서만 버튼 노출)
        } else {
          // 레벨업 못함 → 같은 주제로 자동 이어하기
          setSessionActive(false);
          setSessionId(null);
          setCanStartNewTopic(false);
          setResumeNeeded(true, currentCategoryEn || undefined);
          if (currentCategoryEn) {
            await resumeSameTopic(currentCategoryEn);
          }
        }
      }
    } catch {
      replaceLastTyping("메시지 전송에 실패했어요. 다시 시도해줘.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <ChildSidebar />
      <div className="mt-25 ml-60 flex flex-col flex-1 relative">
        <div ref={listRef} className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div className="mt-2 flex gap-2 items-start">
                {m.sender !== "user" && (
                  <img src={giraffeIcon} alt="기린" className="w-10 h-10 mt-1" />
                )}
                <div className="inline-flex flex-col p-4 bg-white/90 rounded-lg shadow whitespace-pre-wrap max-w-lg">
                  <span>{m.text}</span>

                  {/* 웰컴 말풍선 내부 + 레벨업 완료(또는 최초)에서만 주제 선택 노출 */}
                  {!sessionActive &&
                    canStartNewTopic &&
                    isWelcomeBubble(m, idx) && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {(Object.keys(CATEGORY_MAP) as CategoryLabel[]).map(
                          (label) => (
                            <LevelButton
                              key={label}
                              label={label}
                              level={levelOf(label)}
                              onClick={() => handleLevelClick(label)}
                            />
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="w-full px-15 py-8 bg-primary border-t flex items-center gap-2 sticky bottom-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              sessionActive
                ? "메시지 입력"
                : "레벨업을 완료하면 새 주제를 시작할 수 있어요"
            }
            className="flex-1 p-3 rounded-lg border focus:outline-none"
            disabled={!sessionActive || sending}
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-white hover:bg-gray-100"
            disabled={!sessionActive || sending}
          >
            <Send size={20} className="text-gray-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
