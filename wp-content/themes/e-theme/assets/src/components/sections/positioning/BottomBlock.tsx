import { useTranslation } from "react-i18next";
import lines from "../../../assets/lines.svg";

import bottomEllipse from "../../../assets/bottom-ellipse.webp";
const BottomBlock = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#160B12] rounded-[12px] p-2 flex flex-col gap-3 sm:gap-4">
      <div className="p-3 sm:p-4 md:p-5 lg:p-4 flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h3 className="text-[#FFFFFF] font-semibold text-[20px] sm:text-[24px] lg:text-[28px] leading-[100%]">
            {t("positioning.bottomBlock.title")}
          </h3>
          <div className="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
            <span className="gradient-text text-[13px] sm:text-[14px] lg:text-[16px] leading-[160%] whitespace-nowrap">
              {t("positioning.bottomBlock.badge")}
            </span>
          </div>
        </div>
        <p className="text-[#FFFFFF8F] font-medium text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15.5px] leading-[160%]">
          {t("positioning.bottomBlock.description")}
        </p>
      </div>

      <div
        className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-[8px] relative"
        style={{
          background:
            "linear-gradient(87.47deg, rgba(94, 21, 69, 0.24) 31.41%, rgba(130, 31, 95, 0.24) 87.36%, rgba(118, 14, 82, 0.24) 101.12%)",
        }}
      >
        <img
          src={lines}
          alt=""
          className="absolute top-[-31px] right-10 z-[2] w-auto max-w-[40%] sm:max-w-[50%] lg:max-w-full opacity-50 sm:opacity-100"
        />
        <img
          src={bottomEllipse}
          alt=""
          className="absolute top-0 right-10 z-[1] w-auto max-w-[40%] sm:max-w-[50%] lg:max-w-full opacity-50 sm:opacity-100"
        />
        <span className="text-white font-medium text-[12px] sm:text-[13px] lg:text-[14px] leading-[120%] relative z-10">
          {t("positioning.bottomBlock.resultLabel")}
        </span>
        <h3
          className="text-[#320F25] font-semibold text-[24px] sm:text-[36px] lg:text-[48px] leading-[120%] relative z-10"
          style={{
            backgroundImage:
              "linear-gradient(243.84deg, #BD1482 44.69%, #5D1142 75.78%, #320F25 97.92%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("positioning.bottomBlock.resultTitle")}
        </h3>
        <p className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[16px] lg:text-[18px] leading-[160%] relative z-10">
          {t("positioning.bottomBlock.resultDescription")}
        </p>
      </div>
    </div>
  );
};

export default BottomBlock;
