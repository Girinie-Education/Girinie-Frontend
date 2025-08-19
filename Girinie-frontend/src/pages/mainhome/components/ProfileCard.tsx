import React from "react";
import Card from "./Card";
import GirinieIcon from "@/assets/icons/Girinie.svg";
import { HomeChildData as Child } from "@/api/home";

type Props = { child: Child | undefined; className?: string; isBlurred?: boolean };

const ProfileCard: React.FC<Props> = ({ child, className = "", isBlurred = false }) => (
  <Card className={`h-full ${className} ${isBlurred ? "blur-sm" : ""}`}>
    <div className="h-full p-5 flex flex-col items-center">
      {isBlurred ? (
        <div className="size-30 md:size-30 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
          데이터 없음
        </div>
      ) : (
        <>
          <img src={child?.avatarUrl ?? GirinieIcon} alt="child avatar" className="size-30 md:size-30 rounded-full object-cover" />
          <div className="mt-5 font-body1-sb text-thirdary">{child?.name}</div>
          <div className="mt-1 font-caption-m text-gray-500">( {child?.age}세 )</div>
        </>
      )}
      <div className="flex-1" />
    </div>
  </Card>
);

export default ProfileCard;