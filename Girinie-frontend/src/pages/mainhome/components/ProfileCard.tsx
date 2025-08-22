// src/components/common/ProfileCard.tsx
import React from "react";
import Card from "./Card";
import GirinieIcon from "@/assets/icons/Girinie.svg";
import { HomeChildData as Child } from "@/api/home";

type Props = { child: Child | undefined; className?: string; isBlurred?: boolean };

const resolveUrl = (u?: string) => {
  if (!u) return GirinieIcon;
  if (/^https?:\/\//i.test(u)) return u;
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const path = u.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
};

const ProfileCard: React.FC<Props> = ({ child, className = "", isBlurred = false }) => {
  const rawAvatar = child?.avatarUrl || (child as any)?.avatar; // 두 필드 호환
  const avatarSrc = resolveUrl(rawAvatar);

  return (
    <Card className={`h-full ${className} ${isBlurred ? "blur-sm" : ""}`}>
      <div className="h-full p-5 flex flex-col items-center">
        {isBlurred ? (
          <div className="size-30 md:size-30 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            데이터 없음
          </div>
        ) : (
          <>
            <div
              className={`size-30 md:size-30 rounded-full object-cover flex items-center justify-center overflow-hidden ${child?.color || 'bg-gray-200'}`}
            >
              <img
                src={avatarSrc}
                alt={child?.name || "child avatar"}
                className="w-[90%] h-[90%] object-contain mt-5" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = GirinieIcon;
                }}
              />
            </div>
            <div className="mt-5 font-body1-sb text-thirdary">{child?.name}</div>
            <div className="mt-1 font-caption-m text-gray-500">( {child?.age}세 )</div>
          </>
        )}
        <div className="flex-1" />
      </div>
    </Card>
  );
};

export default ProfileCard;