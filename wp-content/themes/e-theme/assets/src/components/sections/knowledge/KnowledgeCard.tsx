import BadgeIcon from "../../ui/BadgeIcon";

import Card2 from "./knowledge-cards/card2";
import Card3 from "./knowledge-cards/card3";
import Card4 from "./knowledge-cards/card4";
import { Card1 } from "./knowledge-cards/card1";

interface KnowledgeCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
  reverse?: boolean;
}

const KnowledgeCard = ({
  icon,
  title,
  description,
  index,
  reverse = false,
}: KnowledgeCardProps) => {
  return (
    <div
      className={`bg-[#141112] border border-[#FF21B214] rounded-xl sm:rounded-2xl flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-0 lg:gap-4 overflow-hidden`}
    >
      <div className="flex flex-col gap-4 justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
        <BadgeIcon icon={icon} />

        <div className="flex flex-col gap-3 sm:gap-4">
          <h3 className="text-[#FFFFFF] font-semibold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[110%] sm:leading-[100%]">
            {title}
          </h3>
          <p className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
            {description}
          </p>
        </div>
      </div>
      <div className="w-full lg:max-w-[547px] min-h-[200px] sm:min-h-[391px]">
        {index === 0 && <Card1 />}
        {index === 1 && <Card2 />}
        {index === 2 && <Card3 />}
        {index === 3 && <Card4 />}
      </div>
    </div>
  );
};

export default KnowledgeCard;
