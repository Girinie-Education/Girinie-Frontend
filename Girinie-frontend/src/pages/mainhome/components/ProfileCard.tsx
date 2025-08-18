import React from "react";
import Card from "./Card";
import type { Child } from "../types";

type Props = { child: Child; className?: string };

const ProfileCard: React.FC<Props> = ({ child, className = "" }) => (
  <Card className={`h-full ${className}`}>
    <div className="h-full p-5 flex flex-col items-center">
      <img src={child.avatar} alt="child avatar" className="size-30 md:size-30 rounded-full object-cover" />
      <div className="mt-5 font-body1-sb text-thirdary">{child.name}</div>
      <div className="mt-1 font-caption-m text-gray-500">( {child.age}세 )</div>
      <div className="flex-1" />
    </div>
  </Card>
);

export default ProfileCard;
