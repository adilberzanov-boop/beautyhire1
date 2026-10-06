// ============================================================
// НАСТРОЙКА ПОДКЛЮЧЕНИЯ К SUPABASE
// Проект: beautyhair
// ============================================================

const SUPABASE_URL = "https://sicuuvvncpecqizwwdmt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_izY2BG-wjQmpTqlTvgve7Q_vp_V3K00";

window.__SUPABASE_CONFIGURED__ =
  !SUPABASE_URL.startsWith("ВСТАВЬТЕ") && !SUPABASE_ANON_KEY.startsWith("ВСТАВЬТЕ");

window.sb = window.__SUPABASE_CONFIGURED__
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ============================================================
// EMAIL-УВЕДОМЛЕНИЯ (необязательно) — через EmailJS, без бэкенда
// Как подключить — см. INSTRUCTIONS.md, раздел "Email-уведомления"
// Если оставить как есть — email просто не будут отправляться,
// остальной сайт при этом работает как обычно.
// ============================================================
window.EMAILJS_PUBLIC_KEY = "ВСТАВЬТЕ_EMAILJS_PUBLIC_KEY";
window.EMAILJS_SERVICE_ID = "ВСТАВЬТЕ_EMAILJS_SERVICE_ID";
window.EMAILJS_TEMPLATE_ID = "ВСТАВЬТЕ_EMAILJS_TEMPLATE_ID";

window.__EMAILJS_CONFIGURED__ = !window.EMAILJS_PUBLIC_KEY.startsWith("ВСТАВЬТЕ");
if (window.__EMAILJS_CONFIGURED__ && window.emailjs) {
  emailjs.init(window.EMAILJS_PUBLIC_KEY);
}
