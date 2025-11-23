import { useTranslation } from "react-i18next";
import BadgeIcon from "../../ui/BadgeIcon";
import aiBlured from "../../../assets/ai-blured.webp";
import avatar from "../../../assets/positioning-img/avatar.webp";
import lines from "../../../assets/lines.svg";
import stars from "../../../assets/icons/stars.svg";

const rightBlockStyles = {
  background:
    "linear-gradient(94.67deg, rgba(74, 30, 58, 0.24) -4.88%, rgba(177, 62, 137, 0.24) 74.86%, rgba(162, 70, 130, 0.24) 94.48%)",
};

const RightBlock = () => {
  const { t } = useTranslation();
  return (
    <div
      style={rightBlockStyles}
      className="rounded-[12px] relative w-full lg:w-[699px] flex-col gap-3 sm:gap-4 flex p-2 min-h-[400px] sm:min-h-[450px] lg:h-[458px]"
    >
      <BadgeIcon
        icon={stars}
        className="absolute top-[-15px] right-[-15px] sm:top-[-20px] sm:right-[-20px] lg:top-[-25px] lg:right-[-25px] scale-75 sm:scale-90 lg:scale-100"
      />
      <img
        src={lines}
        alt=""
        className="absolute top-0 right-0 w-auto max-w-[50%] sm:max-w-[60%] lg:max-w-full"
      />
      <div className="relative">
        <div className="absolute top-1/2 left-4 sm:left-8 lg:left-12 transform -translate-y-1/2 z-10">
          <p className="max-w-[180px] sm:max-w-[200px] lg:max-w-[228px] w-full text-white font-bold text-[20px] sm:text-[26px] lg:text-[32px] leading-[120%]">
            {t("positioning.rightBlock.overlayText")}
          </p>
        </div>
        <img src={aiBlured} alt="" className=" " />
      </div>
      <div className="p-1 sm:p-2 absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 z-10">
        <div
          className="pl-0 sm:pl-10 lg:pl-14 p-2 sm:p-3 rounded-[8px] overflow-hidden relative backdrop-blur-[50px] self-end"
          style={{
            background:
              "linear-gradient(85.67deg, rgba(22, 11, 18, 0) 1.16%, rgba(27, 0, 17, 0.24) 17.13%)",
          }}
        >
          <p className="text-white font-medium text-[12px] sm:text-[14px] lg:text-[16px] leading-[160%]">
            {t("positioning.rightBlock.description")}
          </p>
        </div>
      </div>
      <img
        src={avatar}
        className="w-[80%] sm:w-[55%] lg:w-[474px] h-auto lg:h-[482px] absolute bottom-0 right-0 object-contain"
        alt=""
      />
    </div>
  );
};

export default RightBlock;
