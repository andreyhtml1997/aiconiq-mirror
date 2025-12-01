import competitiveAdvantageHero from "./competitive-advantage-hero.json";
import security from "./security.json";
import stats from "./stats.json";
import leadCapture from "./lead-capture.json";
import solutionsOverview from "./solutions-overview.json";
import knowledge from "./knowledge.json";
import problemAndSolution from "./problem-and-solution.json";
import positioning from "./positioning.json";
import hero from "./hero.json";
import autoVSteamWork from "./autoVSteamWork.json";
import makeImpact from "./makeImpact.json";
import articles from "./articles.json";

export default {
  ...competitiveAdvantageHero,
  ...security,
  ...stats,
  ...leadCapture,
  ...solutionsOverview,
  ...knowledge,
  ...problemAndSolution,
  ...positioning,
  ...hero,
  ...autoVSteamWork,
  ...makeImpact,
  ...articles,
  consultant: {
    title: "What if your best consultant wasn't human?",
    button: "Send request",
  },
  footer: {
    description:
      "AICONIQ develops AI solutions for medium-sized businesses - to maintain the competitiveness of our industrial location.",
    social: "Social",
    links: "Links",
    footerLinks: {
      impressum: "Legal Notice",
      terms: "Terms of Use",
      // status: "System Status",
    },
  },
  navigation: {
    home: "Home",
    solutions: "Solutions",
    about: "aiconiq Tech",
    blog: "Blog",
    contact: "Contact",
  },
  chatButton: {
    label: "Talk to me",
  },
  imprint: {
    title: "Legal Notice",
  },
};
