import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticlePage from "../pages/ArticlePage";

const AppRoutes = () => {
  // язык по умолчанию берём из WP_APP (Polylang), если есть
  const defaultLang =
    (window as any).WP_APP?.lang || "en";

  return (
    <Routes>
      {/* корень сразу ведём на /{lang}/articles */}
      <Route
        path="/"
        element={
          <Navigate
            to={`/${defaultLang}/articles`}
            replace
          />
        }
      />

      {/* главная под язык (если понадобится) */}
      <Route path="/:lang" element={<HomePage />} />

      {/* список статей и одиночная статья под язык */}
      <Route path="/:lang/articles" element={<ArticlesPage />} />
      <Route
        path="/:lang/articles/:slug"
        element={<ArticlePage />}
      />
    </Routes>
  );
};

export default AppRoutes;