"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import Navigation from "./navigation";
import HeroHeadline from "./HeroHeadline";
import ChatButton from "../../ui/ChatButton";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { extractNumericParts } from "@/utils/format/extractNumericParts";
import { useMixpanelTracking } from "@/hooks/analytics/useMixpanelTracking";
import type { HeroMainData } from "@/types/blocks";

const FALLBACK_VIDEO = '/assets/hero/f570a274-optimized.mp4';

interface Props {
  data?: HeroMainData
}

const Hero = ({ data }: Props = {}) => {
  const t = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const openModal = useVoiceAgentModalStore((state) => state.openModal);

  // Mirror SiteHeaderClient's trigger logic so the burger can lift 10px
  // smoothly when the sticky header slides into view.
  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>('[data-sticky-trigger="hero-nav"]');
    const onScroll = () => {
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        setStickyVisible(rect.top + rect.height / 2 < 0);
      } else {
        setStickyVisible(window.scrollY > 80);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  const { trackVoiceAgentButtonClicked } = useMixpanelTracking();

  const handleChatButtonClick = () => {
    trackVoiceAgentButtonClicked({
      source: 'hero_section',
      page_path: window.location.pathname,
      referrer: document.referrer
    });
    openModal();
  };

  const mainHeading = data?.main_heading || t("hero.mainHeading");
  const description = data?.description || t("hero.description");
  const videoUrl = data?.video?.url || FALLBACK_VIDEO;
  const logoUrl = data?.logo?.url || '/assets/logo.svg';
  const avatarUrls = data?.avatars?.length ? data.avatars.map(a => a.url) : undefined;
  const ctaLabel = data?.cta?.label || undefined;
  const ctaHref = data?.cta?.mode === 'url' ? data.cta.url?.url : undefined;
  const ctaTarget = data?.cta?.mode === 'url' ? (data.cta.url?.target || '_self') : '_self';

  // Always read 3 stats — fall back to i18n keys if data missing
  const rawStats = useMemo(() => {
    if (data?.stats?.length) {
      return data.stats.slice(0, 3).map((s) => ({
        preValue: s.pre_value || '',
        value: s.value || '',
        label: s.label || '',
      }));
    }
    return [
      { preValue: t('hero.stats.timeToMarket.preValue'), value: t('hero.stats.timeToMarket.value'), label: t('hero.stats.timeToMarket.label') },
      { preValue: '', value: t('hero.stats.implementation.value'), label: t('hero.stats.implementation.label') },
      { preValue: '', value: t('hero.stats.projectCosts.value'), label: t('hero.stats.projectCosts.label') },
    ];
  }, [data, t]);

  const parsedStats = useMemo(() =>
    rawStats.map(s => extractNumericParts(s.value || '')), [rawStats]
  );

  const timeToMarketAnimation = useCountUpOnView({ target: parsedStats[0]?.magnitude || 0, start: 0, duration: 2900, threshold: 0.2, once: false });
  const implementationAnimation = useCountUpOnView({ target: parsedStats[1]?.magnitude || 0, start: 0, duration: 1900, threshold: 0.2, once: false });
  const projectCostsAnimation = useCountUpOnView({ target: parsedStats[2]?.magnitude || 0, start: 0, duration: 3900, threshold: 0.2, once: false });
  const statAnimations = [timeToMarketAnimation, implementationAnimation, projectCostsAnimation];

  return (
    <section
      id="home"
      className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex"
      style={{ minHeight: "clamp(500px, 80vh, 917px)" }}
    >
      {/* Mobile burger lives at the section root (outside the inner stacking
          context) so its z-index sits above the sticky SiteHeader (z-50). */}
      <button
        className="md:hidden fixed top-[16px] right-[16px] p-2 text-white z-[60] bg-black/50 rounded-full backdrop-blur-sm transition-transform duration-300 ease-out"
        style={{ transform: stickyVisible ? 'translateY(-10px)' : 'translateY(0)' }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X size={24} strokeWidth={2} />
        ) : (
          <Menu size={24} strokeWidth={2} />
        )}
      </button>

      <div className="bg-color-black p-[1px] rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] flex w-full">
        <div className="w-full rounded-[20px] xs:rounded-t-[30px] sm:rounded-b-none sm:rounded-t-[35px] bg-black md:rounded-t-[40px] lg:rounded-t-[47px] !flex flex-col justify-between relative overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full  object-cover rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]"
            loop
            muted={isMuted}
            autoPlay
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(102.08% 102.07% at 50.73% 0%, rgba(0, 0, 0, 0) 41.02%, #000000 95.66%), radial-gradient(80.27% 340.83% at 78.8% 44.85%, rgba(0, 0, 0, 0) 47.54%, #000000 100%), linear-gradient(174.81deg, rgba(0, 0, 0, 0.4) 6.08%, rgba(0, 0, 0, 0) 35.58%)`,
            }}
          />

          <div
            data-sticky-trigger="hero-nav"
            className="flex flex-row p-3 xs:p-4 sm:p-5 md:p-6 lg:p-[28px] items-start sm:items-center w-full justify-between relative z-10 gap-3 xs:gap-4 sm:gap-0"
          >
            <a href="/" ><img
              src={logoUrl}
              className="w-full"
              style={{ maxWidth: "clamp(120px, 20vw, 193px)" }}
              alt=""
            />
            </a>
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute top-0 right-0 w-full h-full bg-black/95 backdrop-blur-md border-l border-white/10 shadow-2xl">
                <button
                  className="absolute top-[20px] right-[20px] p-2 text-white z-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={2} />
                </button>
                <div className="flex flex-col h-full pt-20 pb-6 px-4">
                  <Navigation variant="mobile" onNavClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          )}

          <div
            className="flex flex-col relative z-10 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12"
            style={{ gap: "clamp(2rem, 8vw, 83px)" }}
          >
            <div className="flex flex-col xl:flex-row items-start lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full">
                <h1
                  style={{
                    background:
                      "linear-gradient(184.14deg, #FFFFFF 61.8%, #F4DCEC 96.62%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    fontSize: "clamp(28px, 5vw, 64px)",
                  }}
                  className="leading-[120%] font-medium"
                >
                  {mainHeading}
                </h1>
                <HeroHeadline
                  weDeliver={data?.we_deliver}
                  digitalEmployees={data?.digital_employees}
                  avatars={avatarUrls}
                />
              </div>

              <p
                className="max-w-full lg:max-w-[416px] w-full text-left lg:text-right text-[#FFFFFF8F] leading-[160%]"
                style={{ fontSize: "clamp(13px, 1.2vw, 16px)" }}
              >
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-[30px]">
              <div className="w-full overflow-hidden">
                <LineHr />
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 xs:gap-6 sm:gap-7 lg:gap-8">
                <div className="flex gap-2 xs:gap-3 sm:gap-4 ">
                  {ctaHref ? (
                    <a
                      href={ctaHref}
                      target={ctaTarget}
                      rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                    >
                      <ChatButton label={ctaLabel} />
                    </a>
                  ) : (
                    <ChatButton label={ctaLabel} onClick={handleChatButtonClick} />
                  )}
                </div>
                <div
                  className="w-full lg:max-w-[806px] flex flex-wrap justify-start lg:justify-end"
                  style={{ gap: "clamp(1.5rem, 5vw, 61px)" }}
                >
                  {rawStats.map((s, i) => {
                    const parsed = parsedStats[i];
                    const anim = statAnimations[i];
                    return (
                      <div className="flex flex-col" key={i}>
                        <span
                          className="text-[#FFFFFFD9] font-medium leading-[120%]"
                          style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
                          role="text"
                          aria-live="polite"
                          aria-label={parsed?.ariaLabel}
                        >
                          {s.preValue && <span aria-hidden="true"> {s.preValue} </span>}
                          {!s.preValue && parsed?.prefix && <span aria-hidden="true">{parsed.prefix}</span>}
                          <span ref={anim.ref} aria-hidden="true">{anim.value}</span>
                          <span aria-hidden="true">{parsed?.suffix}</span>
                        </span>
                        <p
                          className="text-[#FFFFFF8F] leading-[160%]"
                          style={{ fontSize: "clamp(11px, 1vw, 14px)" }}
                        >
                          {s.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

const LineHr = () => {
  return (
    <svg
      width="100%"
      height="1"
      viewBox="0 0 1776 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="w-full"
    >
      <path
        d="M0 0.500122L1776 0.499967"
        stroke="url(#paint0_linear_6622_9399)"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6622_9399"
          x1="0"
          y1="0.500122"
          x2="1405"
          y2="0.500122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#26272C" />
          <stop offset="1" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
      </defs>
    </svg>
  );
};
