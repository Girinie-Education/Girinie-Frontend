import React, { useEffect, useMemo, useState } from "react";
import { useChildData } from "@/hooks/useChildData";

interface ChildListProps {
  className?: string;
}
export const ChildList: React.FC<ChildListProps> = ({ className }) => {
  const { data: children, loading, error } = useChildData();
  const [selected, setSelected] = useState<number | null>(null);

  // children 로드되면 첫 항목 선택
  useEffect(() => {
    if (children.length > 0 && selected === null) {
      setSelected(children[0].id);
    }
  }, [children, selected]);

  // 리스트가 갱신되어 기존 선택 id가 사라졌을 때 보정
  useEffect(() => {
    if (selected !== null && !children.some((c) => c.id === selected)) {
      setSelected(children[0]?.id ?? null);
    }
  }, [children, selected]);

  if (loading) return <div>로딩 중…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (children.length === 0) return <div>자녀가 없습니다.</div>;

  return (
    <ul className={className} role="listbox" aria-label="자녀 목록">
      {children.map((child) => {
        const isActive = selected === child.id;
        return (
          <li
            key={child.id}
            role="option"
            aria-selected={isActive}
            onClick={() => setSelected(child.id)}
            className={isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
          >
            {/* 원하는 UI로 채우기 */}
            {child.name}
          </li>
        );
      })}
    </ul>
  );
};

export default ChildList;
