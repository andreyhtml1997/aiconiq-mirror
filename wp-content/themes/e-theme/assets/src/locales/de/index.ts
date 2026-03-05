import competitiveAdvantageHero from "./competitive-advantage-hero.json";
import security from "./security.json";
import stats from "./stats.json";
import leadCapture from "./lead-capture.json";
import solutionsOverview from "./solutions-overview.json";
import problemAndSolution from "./problem-and-solution.json";
import knowledge from "./knowledge.json";
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
  ...problemAndSolution,
  ...knowledge,
  ...positioning,
  ...hero,
  ...autoVSteamWork,
  ...makeImpact,
  ...articles,
  consultant: {
    title: "Was wäre, wenn Ihr bester Berater kein Mensch wäre?",
    button: "Anfrage senden",
  },
  footer: {
    description:
      "AICONIQ entwickelt AI Lösungen für den Mittelstand - um die Wettbewerbsfähigkeit unseres Industriestandortes zu erhalten.",
    social: "Social",
    links: "Links",
    footerLinks: {
      impressum: "Impressum",
      terms: "Nutzungsbedingungen",
      // status: "Systemstatus",
    },
  },
  navigation: {
    home: "Home",
    solutions: "Lösungen",
    about: "aiconiq Tech",
    team: "Team",
    blog: "Blog",
    contact: "Kontakt",
  },
  chatButton: {
    label: "Sprich mit mir",
  },
  imprint: {
    title: "Impressum",
  },
};
