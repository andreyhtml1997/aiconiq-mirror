import BadgeIcon from "../../ui/BadgeIcon";
import Card2 from "./knowledge-cards/card2";
import Card3 from "./knowledge-cards/card3";
import Card4 from "./knowledge-cards/card4";
import { Card1 } from "./knowledge-cards/card1";
import type { KnowledgeAnimationType } from "@/types/blocks";

interface KnowledgeCardProps {
  icon: string;
  title: string;
  description: string;
  /** Per-card animation choice — moves with the card when reordered. */
  animationType?: KnowledgeAnimationType;
  /** Layout direction. */
  reverse?: boolean;
  /** Optional custom video (only used when animationType === 'video'). */
  videoPath?: string;
}

const KnowledgeCard = ({
  icon,
  title,
  description,
  animationType = 'card1',
  reverse = false,
  videoPath,
}: KnowledgeCardProps) => {
  const renderCardContent = () => {
    if (animationType === 'video' && videoPath) {
      return (
        <video
          src={videoPath}
          autoPlay
          muted
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      );
    }

    switch (animationType) {
      case 'card1': return <Card1 />;
      case 'card2': return <Card2 />;
      case 'card3': return <Card3 />;
      case 'card4': return <Card4 />;
      default: return <Card1 />;
    }
  };

  const isVideo = animationType === 'video' && videoPath;

  return (
    <div
      className={`bg-[#141112] border border-[#FF21B214] rounded-xl sm:rounded-2xl flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-0 lg:gap-4 overflow-hidden`}
    >
      <div className="flex flex-col gap-4 justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
        {isVideo ? (
          <img src={icon} alt="" className="h-[75px] w-auto object-contain" />
        ) : (
          <BadgeIcon icon={icon} />
        )}

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
        {renderCardContent()}
      </div>
    </div>
  );
};

export default KnowledgeCard;
