import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import consultlogo from "../../assets/consultant/consult-logo.webp";
// import symbolimg from "../../assets/consultant/Symbol.svg";
import ChatButton from "../ui/ChatButton";

import backLogo from "../../assets/consultant/back-logo.svg";
import ava1 from "../../assets/consultant/ava1.webp";
import ava2 from "../../assets/consultant/ava2.webp";
import ava3 from "../../assets/consultant/ava3.webp";

const ConsultantSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-[140px]">
      <div className="max-w-[1279px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[100px] px-4 sm:px-6 md:px-8">
        <div className="max-w-full sm:max-w-[500px] lg:max-w-[548px] w-full relative order-2 lg:order-1">
          <motion.div
            className="max-w-[508px] items-center justify-center w-full flex relative"
            initial="initial"
            whileHover="hover"
          >
            {/* Purple ellipse background */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(216, 0, 141, 1) 0%, rgba(216, 0, 141, 0) 70%)",
                filter: "blur(60px)",
                zIndex: -1,
              }}
              variants={{
                initial: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
            <img
              src={backLogo}
              className="max-w-[250px] md:max-w-[424px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
              alt=""
            />
            <motion.img
              src={ava1}
              className="max-w-[170px] sm:max-w-[220px] w-full absolute top-5 left-0 z-10"
              alt=""
              variants={{
                initial: { rotate: 0 },
                hover: { rotate: 7 },
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.img
              src={ava2}
              className="max-w-[170px] sm:max-w-[220px] w-full relative top-3 z-20"
              alt=""
              variants={{
                initial: { rotate: 0 },
                hover: { rotate: 2 },
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.img
              src={ava3}
              className="max-w-[170px] sm:max-w-[220px] w-full absolute top-5 right-0 z-10"
              alt=""
              variants={{
                initial: { rotate: 0 },
                hover: { rotate: -11 },
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </div>
        <div className="max-w-full lg:max-w-[624px] w-full flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-start order-1 lg:order-2">
          <div className="flex flex-col gap-3 sm:gap-4">
            <img
              src={consultlogo}
              className="max-w-7 sm:max-w-8 w-full"
              alt=""
            />
            <h2 className="font-medium text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[120%] gradient-text">
              {t("consultant.title")}
            </h2>
          </div>

          <ChatButton
            label={t("consultant.button")}
            onClick={() => console.log("Chat clicked")}
          />
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
