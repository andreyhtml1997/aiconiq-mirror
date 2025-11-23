import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeader from "../../ui/SectionHeader";
import securityImg from "../../../assets/security/card1.webp";
import securityImg2 from "../../../assets/security/card2.webp";
import securityImg3 from "../../../assets/security/card3.webp";
import securityImg4 from "../../../assets/security/card4.webp";
import securityImg5 from "../../../assets/security/card5.webp";
import gradientLine from "../../../assets/gradient-line.webp";

const Security = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    securityImg,
    securityImg2,
    securityImg3,
    securityImg4,
    securityImg5,
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[80px]">
      <img src={gradientLine} alt="" className="mx-auto" />

      <div className="max-w-[1280px] mt-20 w-full mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-full lg:max-w-[1036px] w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
          <SectionHeader
            badge={t("security.badge")}
            title={t("security.title")}
            className="!items-start !justify-start !text-left !w-full"
            textClassName="!mx-0 !text-left"
            maxWidth="100%"
          />
          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {t("security.description1")}
            </p>
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {t("security.description2")}
            </p>
          </div>
        </div>

        {/* Desktop layout - sticky image on right */}
        <div className="hidden lg:flex w-full items-start justify-between gap-12">
          <div className="flex flex-col w-auto">
            <Card
              index={0}
              setActiveIndex={setActiveIndex}
              images={images}
              isMobile={false}
            />
            <Card
              index={1}
              setActiveIndex={setActiveIndex}
              images={images}
              isMobile={false}
            />
            <Card
              index={2}
              setActiveIndex={setActiveIndex}
              images={images}
              isMobile={false}
            />
            <Card
              index={3}
              setActiveIndex={setActiveIndex}
              images={images}
              isMobile={false}
            />
            <Card
              index={4}
              setActiveIndex={setActiveIndex}
              images={images}
              isMobile={false}
            />
          </div>

          <div className="max-w-[519px] !sticky top-10 w-full p-2">
            <div
              className="w-full rounded-[16px] p-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, #D8008D 0%, rgba(216, 0, 141, 0) 100%)",
              }}
            >
              <div className="w-full h-full rounded-[16px] overflow-hidden bg-black">
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt=""
                  className="w-full h-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout - image below each card */}
        <div className="flex lg:hidden flex-col w-full gap-10 sm:gap-12">
          <MobileCard index={0} images={images} />
          <MobileCard index={1} images={images} />
          <MobileCard index={2} images={images} />
          <MobileCard index={3} images={images} />
          <MobileCard index={4} images={images} />
        </div>
      </div>
    </section>
  );
};

export default Security;

interface CardProps {
  index: number;
  setActiveIndex: (index: number) => void;
  images: string[];
  isMobile: boolean;
}

const Card = ({ index, setActiveIndex }: CardProps) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    margin: "-50% 0px -50% 0px", // Trigger when card is in the middle of viewport
  });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  const cardData = t("security.cards", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    badge?: string;
    highlight?: string;
  }>;

  const data = cardData[index] || cardData[0];

  return (
    <motion.div
      ref={cardRef}
      className="max-w-full lg:max-w-[519px] w-full flex flex-col gap-5 sm:gap-6 md:gap-8 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[680px] py-4 sm:py-6 lg:py-0"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isInView ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="gradient-text font-semibold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[120%]">
        {data.title}
      </h3>
      <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
        {data.description}
      </p>

      {data.badge && data.highlight && (
        <div className="bg-[#1A1317] rounded-[8px] p-4 sm:p-5 md:p-6 items-start flex flex-col gap-3 sm:gap-4">
          <div className="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
            <span className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {data.badge}
            </span>
          </div>
          <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
            {data.highlight}
          </p>
        </div>
      )}
    </motion.div>
  );
};

interface MobileCardProps {
  index: number;
  images: string[];
}

const MobileCard = ({ index, images }: MobileCardProps) => {
  const { t } = useTranslation();

  const cardData = t("security.cards", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    badge?: string;
    highlight?: string;
  }>;

  const data = cardData[index] || cardData[0];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full">
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        <h3 className="gradient-text font-semibold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[120%]">
          {data.title}
        </h3>
        <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
          {data.description}
        </p>

        {data.badge && data.highlight && (
          <div className="bg-[#1A1317] rounded-[8px] p-4 sm:p-5 md:p-6 items-start flex flex-col gap-3 sm:gap-4">
            <div className="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
                {data.badge}
              </span>
            </div>
            <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {data.highlight}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-full sm:max-w-[600px] mx-auto w-full border border-[#D8008D] rounded-[12px] sm:rounded-[16px] overflow-hidden">
        <img src={images[index]} alt="" className="w-full h-auto" />
      </div>
    </div>
  );
};
