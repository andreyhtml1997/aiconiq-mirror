// Locale-scoped 404 — rendered inside [lang]/layout.tsx so we keep the
// <html>/<body> chrome and locale context. Next.js falls back here for any
// unknown path under /[lang]/* (including /[lang]/page/<slug>/, which is
// intentionally handed off to WordPress on the server).
export default function LangNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0E0E] text-white">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
        <p className="text-gray-400">The page you are looking for does not exist.</p>
      </div>
    </div>
  )
}
