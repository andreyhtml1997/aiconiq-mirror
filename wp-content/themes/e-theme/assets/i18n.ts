import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./src/locales/en";
import de from "./src/locales/de";

const resources = {
    en: {
       translation: en
    },
    de: {
       translation: de
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "de",
        lng: "de",
        supportedLngs: ["en", "de"],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["path", "localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;