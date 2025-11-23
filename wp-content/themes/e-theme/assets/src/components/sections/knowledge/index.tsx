import { useTranslation } from "react-i18next";
import SectionHeader from "../../ui/SectionHeader";
import KnowledgeCard from "./KnowledgeCard";

import icon1 from "../../../assets/knowledge-img/icon1.svg";
import icon2 from "../../../assets/knowledge-img/icon2.svg";
import icon3 from "../../../assets/knowledge-img/icon3.svg";
import icon4 from "../../../assets/knowledge-img/icon4.svg";
import ChatButton from "../../ui/ChatButton";

const Knowledge = () => {
  const { t } = useTranslation();

  const knowledgeSteps = [
    {
      icon: icon1,
      title: t("knowledge.steps.0.title"),
      description: t("knowledge.steps.0.description"),
    },
    {
      icon: icon2,
      title: t("knowledge.steps.1.title"),
      description: t("knowledge.steps.1.description"),
    },
    {
      icon: icon3,
      title: t("knowledge.steps.2.title"),
      description: t("knowledge.steps.2.description"),
    },
    {
      icon: icon4,
      title: t("knowledge.steps.3.title"),
      description: t("knowledge.steps.3.description"),
    },
  ];

  return (
    <section
      id="about"
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[110px]"
    >
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-[58px] items-center justify-center">
        <SectionHeader
          badge={t("knowledge.badge")}
          title={t("knowledge.title")}
        />

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
          {knowledgeSteps.map((step, index) => (
            <KnowledgeCard
              key={index}
              icon={step.icon}
              index={index}
              title={step.title}
              description={step.description}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
        <ChatButton
          label={t("consultant.button")}
          onClick={() => console.log("Chat clicked")}
        />
      </div>
    </section>
  );
};

export default Knowledge;
