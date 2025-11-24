'use client'

const img3 = '/assets/problem/3.webp'
const checkIcon = '/assets/problem/check.svg'
const linesIcon = '/assets/problem/lines.svg'
const aiconiqIcon = '/assets/problem/aicoin1.webp'

export const AiConiqCard = () => {
  return (
    <div className="border bg-[#200616] border-[#D8008D] rounded-2xl relative z-10">
      <div className="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#692351] border border-[#FF21B254] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
        <img
          src={aiconiqIcon}
          alt=""
          className="max-w-3 sm:max-w-4 rounded-full"
          style={{
            backdropFilter: "blur(25.477333068847656px)",
            boxShadow: "0px 0.91px 26.1px 7px #FF21B2E0",
          }}
        />
        <span className="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]">
          AICONIQ
        </span>
      </div>
      <img src={img3} className="rounded-[20px] w-full" />
      <div className="flex flex-col">
        <div
          className="bg-[#1D1B1C] items-center px-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3"
          style={{
            background:
              "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
          }}
        >
          <img
            src={checkIcon}
            alt=""
            className="w-[20px] sm:w-[24px] flex-shrink-0"
          />
          <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%] flex-1">
            Experimental Knowledge Employee / Expert and Conversational
            Knowledge
          </span>
        </div>
        <div
          className="w-full h-[0.5px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(150, 150, 150, 0.16) 0%, rgba(150, 150, 150, 0.5) 100%)",
          }}
        ></div>
        <div
          className="bg-[#1D1B1C] items-center px-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3"
          style={{
            background:
              "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
          }}
        >
          <img
            src={checkIcon}
            alt=""
            className="w-[20px] sm:w-[24px] flex-shrink-0"
          />
          <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">
            Explicit + Implicit + Tacit
          </span>
        </div>
      </div>

      <div
        className="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between"
        style={{
          background:
            " linear-gradient(87.47deg, rgba(94, 21, 69, 0.24) 31.41%, rgba(102, 44, 82, 0.24) 87.36%, rgba(70, 34, 57, 0.24) 101.12%)",
        }}
      >
        <span className="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white">
          QUALITY OF ADVICE / CONSULT
        </span>
        <span className="text-gradient font-semibold text-[60px] sm:text-[72px] md:text-[85px] leading-[120%]">
          93%
        </span>

        <img
          src={linesIcon}
          className="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full"
          alt=""
        />
      </div>
    </div>
  );
};
