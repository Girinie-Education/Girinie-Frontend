import React, { useState } from "react";
import { useChildData } from "@/hooks/useChildData";

interface ChildListProps {
    className?: string;
}
const ChildList: React.FC<ChildListProps> = ({ className }) => {
  const { data: children, loading, error } = useChildData();
  const [selected, setSelected] = useState(children[0]?.id ?? '');

  if (loading) return <div>로딩 중…</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <ul className={className}>
      {children.map(child => (
        <li
          key={child.id}
          onClick={() => setSelected(child.id)}
          className={selected === child.id ? "…" : "…"}
        >
          {/* 생략 */}
        </li>
      ))}
    </ul>
  );
};
