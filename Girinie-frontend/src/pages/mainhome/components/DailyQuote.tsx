import React from "react";
import Card from "./Card";
import Teacher from "@/assets/icons/SunglassTeacher.svg";

const DailyQuote: React.FC = () => (
  <Card title="오늘의 한마디">
    <div className="p-4">
      <div className="flex items-start gap-3">
        <img src={Teacher} alt="giraffe" className="size-11 rounded-full" />
        <div
          className="flex-1 rounded-lg bg-secondary/60 pl-5 pr-4 py-3 text-thirdary font-body1-m text-lg leading-relaxed"
        >
          혜민아 오늘 하루도 힘내자!
        </div>
      </div>
    </div>
  </Card>
);

export default DailyQuote;
