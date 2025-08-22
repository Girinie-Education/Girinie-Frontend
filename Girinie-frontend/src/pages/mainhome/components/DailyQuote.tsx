import React from "react";
import Card from "./Card";
import Teacher from "@/assets/icons/SunglassTeacher.svg";

type Props = { quote: string | undefined; isBlurred?: boolean };

const DailyQuote: React.FC<Props> = ({ quote, isBlurred = false }) => (
  <Card title="오늘의 한마디" className={isBlurred ? "blur-sm" : ""}>
    <div className="p-4">
      <div className="flex items-start gap-3">
        <img src={Teacher} alt="giraffe" className="size-11 rounded-full" />
        <div className="flex-1 rounded-lg bg-secondary/60 pl-5 pr-4 py-3 text-thirdary font-body1-m text-lg leading-relaxed">
          {isBlurred ? "데이터 없음" : quote}
        </div>
      </div>
    </div>
  </Card>
);

export default DailyQuote;