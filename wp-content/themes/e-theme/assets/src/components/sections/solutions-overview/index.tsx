import { useTranslation } from "react-i18next";
import ChatButton from "../../ui/ChatButton";

import icon1 from "../../../assets/solutions-icons/1.svg";
import icon2 from "../../../assets/solutions-icons/2.svg";
import icon3 from "../../../assets/solutions-icons/3.svg";
import icon4 from "../../../assets/solutions-icons/4.svg";

const SolutionsOverview = () => {
  const { t } = useTranslation();

  const icons = [icon1, icon2, icon3, icon4];

  const solutionsData = t("solutionsOverview.solutions", {
    returnObjects: true
  }) as Array<{ title: string; description: string }>;

  const solutions = solutionsData.map((solution, index) => ({
    icon: icons[index],
    ...solution,
  }));

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[130px]">
      <div className="max-w-[1280px] w-full mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] gradient-text leading-[120%] max-w-full lg:max-w-[1036px] w-full">
            {t("solutionsOverview.title")}
          </h2>
          <ChatButton
            label={t("solutionsOverview.buttonLabel")}
            onClick={() => console.log("Chat clicked")}
          />
        </div>
        <div className="w-full border-t border-[#D9D9D9]/[24%]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-[#1A1317] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] min-h-[180px] sm:min-h-[190px] md:min-h-[204px] p-5 sm:p-6 md:p-8 flex items-center justify-center gap-3 sm:gap-4 flex-col text-center relative group transition-transform duration-300"
            >
              {/* Pink gradient overlay on hover */}
              <div
                className="absolute inset-0 rounded-[12px] sm:rounded-[14px] md:rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(95deg, rgba(118, 22, 85, 0.24) -4.88%, rgba(230, 54, 169, 0.24) 74.86%, rgba(254, 109, 203, 0.24) 94.48%)",
                }}
              />

              {/* Bottom ellipse blur on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div
                  className="w-[244px] h-[130px] rounded-[24px]"
                  style={{
                    background: "rgba(202, 10, 135, 0.64)",
                    filter: "blur(45px)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>

              <img
                src={solution.icon}
                alt=""
                className="max-w-7 sm:max-w-8 relative z-10"
              />
              <span className="text-white font-extrabold text-[18px] sm:text-[19px] md:text-[20px] leading-[120%] relative z-10">
                {solution.title}
              </span>
              <p className="text-white/[72%] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%] relative z-10">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsOverview;
