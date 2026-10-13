/* ==========================================================================
   BeautyHire — фронтенд приложения
   Работает в двух режимах:
   - ДЕМО (Supabase не подключён): данные живут в памяти браузера, для показа
   - БОЕВОЙ (после вставки ключей в config.js): всё через Supabase
   ========================================================================== */

// ---------------------------------------------------------------------------
// 0. КОНСТАНТЫ И СПРАВОЧНИКИ
// ---------------------------------------------------------------------------
const SPECIALTIES = ['Парикмахер', 'Nail-мастер', 'Визажист', 'Бровист/Лешмейкер', 'Косметолог', 'Массажист'];
const DISTRICTS = ['Бостандыкский', 'Медеуский', 'Алмалинский', 'Ауэзовский', 'Турксибский', 'Жетысуский', 'Наурызбайский'];
const FORMATS = ['Оклад', 'Процент', 'Аренда места'];
const SCHEDULES = ['Полный день', 'Частичная занятость', 'Сменный график 2/2'];
const SALARY_RANGES = [
  { value: '', label: 'Любая зарплата' },
  { value: 'lt200', label: 'До 200 000 ₸' },
  { value: '200-350', label: '200 000 – 350 000 ₸' },
  { value: 'gt350', label: 'От 350 000 ₸' },
];
const SORT_VACANCY = [
  { value: '', label: 'Сначала Premium' },
  { value: 'salary_desc', label: 'Сначала дороже' },
  { value: 'salary_asc', label: 'Сначала дешевле' },
  { value: 'new', label: 'Сначала новые' },
];
const SORT_MASTER = [
  { value: '', label: 'По рейтингу' },
  { value: 'salary_asc', label: 'Дешевле' },
  { value: 'salary_desc', label: 'Дороже' },
  { value: 'exp_desc', label: 'Больше опыта' },
];

const DEMO_MODE = !window.__SUPABASE_CONFIGURED__;
if (DEMO_MODE) document.body.classList.add('not-configured');

// ---------------------------------------------------------------------------
// Аватары и фото-заглушки
// - masterAvatar: иллюстрированный аватар человека (не привязан к конкретному
//   реальному человеку и не намекает на пол сильнее, чем случайно)
// - salonLogo: бейдж с инициалами салона (салон — не человек, лица тут не нужны)
// - makePhotos: карточки портфолио — брендированные плашки по специальности,
//   а не случайные несвязанные стоковые фото
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Иконки (inline SVG, stroke) — вместо эмодзи
// ---------------------------------------------------------------------------
const ICON_PATHS = {
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  wallet: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',
  store: '<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.2"/>',
};
function ic(name, size = 18, filled = false) {
  const key = ICON_PATHS[name] ? name : 'inbox';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-0.2em;flex-shrink:0" aria-hidden="true">${ICON_PATHS[key]}</svg>`;
}

const slug = (s) => encodeURIComponent(s || 'x');
const masterAvatar = (name) => `https://api.dicebear.com/7.x/initials/svg?seed=${slug(name)}&backgroundColor=c92a78,e0488c,a31d62,f2603f&fontFamily=Arial&fontWeight=600&radius=50`;
const salonLogo = (name) => `https://api.dicebear.com/7.x/initials/svg?seed=${slug(name)}&backgroundColor=a31d62,c92a78,e0488c,f2603f&fontFamily=Arial&fontWeight=600&radius=12`;

const SPECIALTY_VISUAL = {
  'Nail-мастер': { from: '#FFD9E8', to: '#C92A78' },
  'Парикмахер': { from: '#FFF4DB', to: '#C92A78' },
  'Визажист': { from: '#FFEDE8', to: '#E0488C' },
  'Бровист/Лешмейкер': { from: '#E3F7F0', to: '#A31D62' },
  'Косметолог': { from: '#FFF4DB', to: '#0F9D74' },
  'Массажист': { from: '#E3F7F0', to: '#F2603F' },
};
function tileSVG(specialty, variant) {
  const v = SPECIALTY_VISUAL[specialty] || { from: '#FFD9E8', to: '#C92A78' };
  const angle = [20, 110, 200, 300][variant % 4];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g${variant}' x1='0%' y1='0%' x2='100%' y2='100%' gradientTransform='rotate(${angle} 200 200)'><stop offset='0%' stop-color='${v.from}'/><stop offset='100%' stop-color='${v.to}'/></linearGradient></defs><rect width='400' height='400' fill='url(#g${variant})'/><path d='M-50 450 L450 -50 M-150 450 L450 -150 M50 450 L450 50 M150 450 L450 150' stroke='white' stroke-opacity='.10' stroke-width='14'/></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const makePhotos = (specialty) => [0, 1, 2, 3].map(i => tileSVG(specialty, i));

// ---------------------------------------------------------------------------
// Модуль записи клиентов: каталог услуг по умолчанию + расписание
// ---------------------------------------------------------------------------
const DEFAULT_SERVICE_CATALOG = {
  'Nail-мастер': [['Маникюр классический', 5000, 60], ['Наращивание гель', 9000, 90], ['Педикюр', 7000, 60]],
  'Парикмахер': [['Стрижка', 6000, 45], ['Окрашивание', 15000, 120], ['Укладка', 5000, 40]],
  'Визажист': [['Дневной макияж', 8000, 60], ['Вечерний макияж', 12000, 75], ['Свадебный макияж', 20000, 120]],
  'Бровист/Лешмейкер': [['Коррекция бровей', 3000, 30], ['Ламинирование бровей', 6000, 60], ['Наращивание ресниц 2D', 10000, 120]],
  'Косметолог': [['Чистка лица', 12000, 60], ['Массаж лица', 7000, 45], ['Пилинг', 9000, 50]],
  'Массажист': [['Классический массаж', 8000, 60], ['Спортивный массаж', 10000, 60]],
};
function defaultServicesFor(specialty) {
  const list = DEFAULT_SERVICE_CATALOG[specialty] || [['Услуга', 5000, 60]];
  return list.map(([name, price, duration_minutes]) => ({ id: 'svc_' + Math.random().toString(36).slice(2, 9), name, price, duration_minutes }));
}
function defaultAvailability() {
  return [0, 1, 2, 3, 4, 5, 6].map(weekday => ({ weekday, is_closed: weekday === 0, open_time: '10:00', close_time: weekday === 6 ? '18:00' : '20:00' }));
}
const DEMO_SALON_EXTRAS = {};
function getSalonExtras(key, specialtyHint) {
  if (!DEMO_SALON_EXTRAS[key]) DEMO_SALON_EXTRAS[key] = { services: defaultServicesFor(specialtyHint), availability: defaultAvailability() };
  return DEMO_SALON_EXTRAS[key];
}
function salonKeyFor(v) { return v.salon_id || v.salon_profiles?.id || ('seed:' + slug(v.salon_name || v.salon_profiles?.salon_name || 'salon')); }
function mySalonKey() { return DEMO_MODE ? 'me' : state.user?.id; }

// ---------------------------------------------------------------------------
// 1. ДЕМО-ДАННЫЕ
// ---------------------------------------------------------------------------
const DEMO = {
  vacancies: [
    { id: 'v1', salon_name: 'Beauty Space', logo: salonLogo('Beauty Space'), specialty: 'Nail-мастер', district: 'Бостандыкский', salary_from: 250000, salary_to: 400000, experience_required: 'от 1 года', schedule: 'Полный день', format: 'Процент', description: 'Ищем nail-мастера в дружный коллектив. Наработанная база клиентов, стабильный поток.', requirements: 'Опыт от 1 года, аккуратность, знание современных техник покрытия.', bonuses: 'Обучение, корпоративные скидки, тёплая атмосфера.', is_premium: true, rating: 4.8, reviews_count: 63, photos: makePhotos('Nail-мастер'), tags: ['Маникюр', 'Наращивание', 'Дизайн'] },
    { id: 'v2', salon_name: 'Studio Line', logo: salonLogo('Studio Line'), specialty: 'Парикмахер', district: 'Медеуский', salary_from: 200000, salary_to: 350000, experience_required: 'от 2 лет', schedule: 'Сменный график 2/2', format: 'Оклад', description: 'Требуется парикмахер-стилист на постоянную работу.', requirements: 'Портфолио обязательно, знание окрашивания.', bonuses: 'Оплачиваемое обучение у топ-стилистов.', is_premium: false, rating: 4.6, reviews_count: 28, photos: makePhotos('Парикмахер'), tags: ['Окрашивание', 'Стрижки'] },
    { id: 'v3', salon_name: 'Face Bar', logo: salonLogo('Face Bar'), specialty: 'Визажист', district: 'Алмалинский', salary_from: 180000, salary_to: 300000, experience_required: 'от 6 месяцев', schedule: 'Частичная занятость', format: 'Процент', description: 'Визажист для работы на мероприятиях и в студии.', requirements: 'Своя косметичка приветствуется.', bonuses: 'Гибкий график.', is_premium: false, rating: 4.9, reviews_count: 41, photos: makePhotos('Визажист'), tags: ['Вечерний макияж', 'Свадебный'] },
    { id: 'v4', salon_name: 'Brow Room', logo: salonLogo('Brow Room'), specialty: 'Бровист/Лешмейкер', district: 'Ауэзовский', salary_from: 220000, salary_to: 380000, experience_required: 'от 1 года', schedule: 'Полный день', format: 'Аренда места', description: 'Сдаём место лешмейкеру/бровисту в центре района.', requirements: 'Наличие сертификатов.', bonuses: 'Готовая клиентская база из соседних кабинетов.', is_premium: true, rating: 4.7, reviews_count: 35, photos: makePhotos('Бровист/Лешмейкер'), tags: ['Ламинирование', 'Наращивание ресниц'] },
    { id: 'v5', salon_name: 'Skin Lab', logo: salonLogo('Skin Lab'), specialty: 'Косметолог', district: 'Бостандыкский', salary_from: 300000, salary_to: 500000, experience_required: 'от 3 лет', schedule: 'Полный день', format: 'Оклад', description: 'Косметолог-эстетист в премиальную студию.', requirements: 'Медицинское образование обязательно.', bonuses: 'ДМС, премии за показатели.', is_premium: true, rating: 4.9, reviews_count: 77, photos: makePhotos('Косметолог'), tags: ['Чистка лица', 'Аппаратная косметология'] },
    { id: 'v6', salon_name: 'Nail Point', logo: salonLogo('Nail Point'), specialty: 'Nail-мастер', district: 'Турксибский', salary_from: 150000, salary_to: 280000, experience_required: 'без опыта', schedule: 'Частичная занятость', format: 'Процент', description: 'Ищем начинающего nail-мастера, готовы обучать.', requirements: 'Желание развиваться.', bonuses: 'Наставничество.', is_premium: false, rating: 4.3, reviews_count: 12, photos: makePhotos('Nail-мастер'), tags: ['Гель-лак', 'Педикюр'] },
    { id: 'v7', salon_name: 'Relax Zone', logo: salonLogo('Relax Zone'), specialty: 'Массажист', district: 'Жетысуский', salary_from: 200000, salary_to: 320000, experience_required: 'от 2 лет', schedule: 'Сменный график 2/2', format: 'Процент', description: 'Массажист в спа-салон.', requirements: 'Сертификат массажиста.', bonuses: 'Форма предоставляется.', is_premium: false, rating: 4.5, reviews_count: 19, photos: makePhotos('Массажист'), tags: ['Классический массаж', 'СПА'] },
    { id: 'v8', salon_name: 'Hair Story', logo: salonLogo('Hair Story'), specialty: 'Парикмахер', district: 'Наурызбайский', salary_from: 180000, salary_to: 300000, experience_required: 'от 1 года', schedule: 'Полный день', format: 'Аренда места', description: 'Свободное кресло парикмахера в новом салоне.', requirements: 'Свои инструменты.', bonuses: 'Первый месяц аренды бесплатно.', is_premium: false, rating: 4.4, reviews_count: 9, photos: makePhotos('Парикмахер'), tags: ['Барбершоп', 'Стрижки'] },
    { id: 'v9', salon_name: 'Glow Studio', logo: salonLogo('Glow Studio'), specialty: 'Косметолог', district: 'Медеуский', salary_from: 260000, salary_to: 420000, experience_required: 'от 2 лет', schedule: 'Полный день', format: 'Процент', description: 'Косметолог для СПА-программ и уходовых процедур лица.', requirements: 'Сертификат, опыт в премиум-сегменте.', bonuses: 'Продукция для процедур предоставляется.', is_premium: false, rating: 4.7, reviews_count: 24, photos: makePhotos('Косметолог'), tags: ['Уход за лицом', 'Массаж лица'] },
    { id: 'v10', salon_name: 'Lash & Brow Bar', logo: salonLogo('Lash & Brow Bar'), specialty: 'Бровист/Лешмейкер', district: 'Алмалинский', salary_from: 240000, salary_to: 360000, experience_required: 'от 1 года', schedule: 'Сменный график 2/2', format: 'Процент', description: 'Мастер по наращиванию ресниц в популярную студию в центре.', requirements: 'Портфолио, аккуратность.', bonuses: 'Постоянный поток клиентов.', is_premium: true, rating: 4.9, reviews_count: 55, photos: makePhotos('Бровист/Лешмейкер'), tags: ['2D-3D объём', 'Архитектура бровей'] },
  ],
  masters: [
    { id: 'm1', full_name: 'Айгерим Толеубекова', avatar: masterAvatar('Айгерим Толеубекова'), specialty: 'Nail-мастер', district: 'Бостандыкский', experience_years: 3, desired_salary: 280000, schedule: 'Полный день', format: 'Процент', bio: 'Специализируюсь на аппаратном маникюре и сложном дизайне. Работаю быстро и аккуратно.', skills: ['Маникюр', 'Наращивание', 'Педикюр'], rating: 4.9, reviews_count: 125, verified: true, urgent: false, photos: makePhotos('Nail-мастер') },
    { id: 'm2', full_name: 'Динара Сатыбалдиева', avatar: masterAvatar('Динара Сатыбалдиева'), specialty: 'Парикмахер', district: 'Медеуский', experience_years: 5, desired_salary: 350000, schedule: 'Сменный график 2/2', format: 'Оклад', bio: 'Колорист, специализация — сложное окрашивание и стрижки любой сложности.', skills: ['Окрашивание', 'Стрижки', 'Укладки'], rating: 4.8, reviews_count: 96, verified: true, urgent: true, photos: makePhotos('Парикмахер') },
    { id: 'm3', full_name: 'Мадина Курманова', avatar: masterAvatar('Мадина Курманова'), specialty: 'Визажист', district: 'Алмалинский', experience_years: 2, desired_salary: 220000, schedule: 'Частичная занятость', format: 'Процент', bio: 'Свадебный и вечерний макияж, работаю на выезд по всему городу.', skills: ['Свадебный макияж', 'Вечерний образ'], rating: 5.0, reviews_count: 58, verified: true, urgent: false, photos: makePhotos('Визажист') },
    { id: 'm4', full_name: 'Алия Жумабекова', avatar: masterAvatar('Алия Жумабекова'), specialty: 'Бровист/Лешмейкер', district: 'Ауэзовский', experience_years: 4, desired_salary: 300000, schedule: 'Полный день', format: 'Аренда места', bio: 'Ламинирование, наращивание 2D-3D, архитектура бровей.', skills: ['Ламинирование', 'Наращивание ресниц'], rating: 4.7, reviews_count: 80, verified: false, urgent: false, photos: makePhotos('Бровист/Лешмейкер') },
    { id: 'm5', full_name: 'Гульнара Байсеитова', avatar: masterAvatar('Гульнара Байсеитова'), specialty: 'Косметолог', district: 'Бостандыкский', experience_years: 6, desired_salary: 450000, schedule: 'Полный день', format: 'Оклад', bio: 'Аппаратная косметология, чистки, уходовые процедуры для любого типа кожи.', skills: ['Чистка лица', 'Аппаратная косметология'], rating: 4.9, reviews_count: 140, verified: true, urgent: false, photos: makePhotos('Косметолог') },
    { id: 'm6', full_name: 'Санжар Ерланов', avatar: masterAvatar('Санжар Ерланов'), specialty: 'Массажист', district: 'Жетысуский', experience_years: 3, desired_salary: 260000, schedule: 'Сменный график 2/2', format: 'Процент', bio: 'Классический и спортивный массаж, работал в топ-спа Алматы.', skills: ['Классический массаж', 'Спортивный массаж'], rating: 4.6, reviews_count: 37, verified: false, urgent: false, photos: makePhotos('Массажист') },
    { id: 'm7', full_name: 'Жанна Омарова', avatar: masterAvatar('Жанна Омарова'), specialty: 'Nail-мастер', district: 'Турксибский', experience_years: 1, desired_salary: 180000, schedule: 'Частичная занятость', format: 'Процент', bio: 'Начинающий мастер, прошла обучение в академии, готова к стажировке.', skills: ['Гель-лак', 'Уход'], rating: 4.5, reviews_count: 14, verified: false, urgent: true, photos: makePhotos('Nail-мастер') },
    { id: 'm8', full_name: 'Ержан Мұратов', avatar: masterAvatar('Ержан Мұратов'), specialty: 'Парикмахер', district: 'Наурызбайский', experience_years: 8, desired_salary: 400000, schedule: 'Полный день', format: 'Аренда места', bio: 'Барбер, мужские стрижки и оформление бороды, свой инструмент.', skills: ['Барбершоп', 'Стрижки', 'Борода'], rating: 5.0, reviews_count: 210, verified: true, urgent: false, photos: makePhotos('Парикмахер') },
    { id: 'm9', full_name: 'Ляззат Нурланова', avatar: masterAvatar('Ляззат Нурланова'), specialty: 'Визажист', district: 'Бостандыкский', experience_years: 3, desired_salary: 250000, schedule: 'Полный день', format: 'Процент', bio: 'Дневной и вечерний макияж, преподаю на курсах визажа.', skills: ['Дневной макияж', 'Обучение'], rating: 4.8, reviews_count: 66, verified: true, urgent: false, photos: makePhotos('Визажист') },
    { id: 'm10', full_name: 'Асель Дюсенова', avatar: masterAvatar('Асель Дюсенова'), specialty: 'Косметолог', district: 'Медеуский', experience_years: 2, desired_salary: 240000, schedule: 'Частичная занятость', format: 'Процент', bio: 'Уходовые процедуры, чистка лица, массаж лица.', skills: ['Уход за лицом', 'Массаж лица'], rating: 4.6, reviews_count: 21, verified: false, urgent: false, photos: makePhotos('Косметолог') },
    { id: 'm11', full_name: 'Ботагоз Серикова', avatar: masterAvatar('Ботагоз Серикова'), specialty: 'Бровист/Лешмейкер', district: 'Алмалинский', experience_years: 5, desired_salary: 320000, schedule: 'Полный день', format: 'Аренда места', bio: 'Топ-мастер по объёмному наращиванию, очередь на 2 недели вперёд.', skills: ['2D-3D объём', 'Архитектура бровей'], rating: 5.0, reviews_count: 180, verified: true, urgent: false, photos: makePhotos('Бровист/Лешмейкер') },
    { id: 'm12', full_name: 'Нурлан Ахметов', avatar: masterAvatar('Нурлан Ахметов'), specialty: 'Парикмахер', district: 'Ауэзовский', experience_years: 1, desired_salary: 170000, schedule: 'Частичная занятость', format: 'Процент', bio: 'Молодой специалист, окончил школу парикмахерского искусства.', skills: ['Стрижки', 'Укладки'], rating: 4.4, reviews_count: 6, verified: false, urgent: true, photos: makePhotos('Парикмахер') },
  ],
  applications: [],
  bookings: [],
  messages: [],
  reviews: [
    { id: 'r1', target_id: 'm1', target_type: 'master', author_name: 'Beauty Space', rating: 5, text: 'Профессиональный мастер, пунктуальная, клиенты в восторге от дизайна.' },
    { id: 'r2', target_id: 'm1', target_type: 'master', author_name: 'Nail Point', rating: 5, text: 'Хорошо общается с клиентами, всегда чистое рабочее место.' },
    { id: 'r3', target_id: 'm2', target_type: 'master', author_name: 'Studio Line', rating: 5, text: 'Лучший колорист, с которым мы работали. Рекомендуем.' },
    { id: 'r4', target_id: 'm8', target_type: 'master', author_name: 'Hair Story', rating: 5, text: 'Очередь к нему расписана на месяц вперёд — и не зря.' },
  ],
  nextId: 100,
};

// ---------------------------------------------------------------------------
// 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ---------------------------------------------------------------------------
const state = {
  route: '/',
  params: {},
  roleTab: 'master',       // 'master' -> смотрю вакансии | 'salon' -> смотрю мастеров
  user: null,
  profile: null,
  masterProfile: null,
  salonProfile: null,
  filters: { specialty: '', district: '', salaryRange: '', formats: [], experienced: false, sort: '' },
  favorites: new Set(),    // "master:m1" / "vacancy:v1" — хранится в памяти вкладки
};

// ---------------------------------------------------------------------------
// 3. УТИЛИТЫ
// ---------------------------------------------------------------------------
const app = document.getElementById('app');
const escapeHtml = (str) => (str ?? '').toString().replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => n ? Number(n).toLocaleString('ru-RU') + ' ₸' : '—';
const stars = (rating) => { const r = Math.round(rating || 0); return `<span style="display:inline-flex;gap:2px;vertical-align:middle">${[1,2,3,4,5].map(i => `<span style="opacity:${i <= r ? 1 : 0.28}">${ic('star', 13, true)}</span>`).join('')}</span>`; };

function showToast(msg, type = 'success') {
  const div = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-600' : 'bg-ink';
  div.className = `${bg} text-white text-sm px-4 py-3 rounded-xl shadow-lg`;
  div.style.animation = 'fadeIn .2s ease';
  div.textContent = msg;
  document.getElementById('toastRoot').appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

function openModal(html) {
  document.getElementById('modalRoot').innerHTML = `
    <div class="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center" data-modal-overlay>
      <div class="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto p-6 relative" data-modal-panel>
        <button data-modal-close class="absolute top-4 right-4 text-warm-500 hover:text-ink">${ic('x', 18)}</button>
        ${html}
      </div>
    </div>`;
}
function notifyByEmail(params) {
  if (!window.__EMAILJS_CONFIGURED__ || !params.to_email) return;
  try { emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, params); }
  catch (e) { console.warn('Email notify failed', e); }
}

function closeModal() {
  const sidebar = document.getElementById('filterSidebar');
  const placeholder = document.getElementById('filterSidebarPlaceholder');
  if (sidebar && placeholder) {
    placeholder.parentNode.insertBefore(sidebar, placeholder);
    placeholder.remove();
    sidebar.classList.add('hidden');
  }
  document.getElementById('modalRoot').innerHTML = '';
}
function goto(hash) {
  // если адрес не меняется, hashchange не сработает — перерисовываем вручную
  if (location.hash === hash || (!location.hash && hash === '#/')) { parseRoute(); render(); window.scrollTo(0, 0); }
  else location.hash = hash;
}

function matchesSalary(value, range) {
  if (!range) return true;
  if (range === 'lt200') return value < 200000;
  if (range === '200-350') return value >= 200000 && value <= 350000;
  if (range === 'gt350') return value > 350000;
  return true;
}

// ---------------------------------------------------------------------------
// 4. СЛОЙ ДАННЫХ (Supabase или демо-режим — единый интерфейс)
// ---------------------------------------------------------------------------
const Data = {
  async listVacancies(filters = {}) {
    if (DEMO_MODE) {
      let list = DEMO.vacancies.filter(v =>
        (!filters.specialty || v.specialty === filters.specialty) &&
        (!filters.district || v.district === filters.district) &&
        (!filters.formats?.length || filters.formats.includes(v.format)) &&
        (!filters.experienced || v.experience_required !== 'без опыта') &&
        matchesSalary(v.salary_to, filters.salaryRange) &&
        (!filters.text || v.specialty.toLowerCase().includes(filters.text.toLowerCase()) || v.salon_name.toLowerCase().includes(filters.text.toLowerCase()))
      );
      if (filters.sort === 'salary_desc') list.sort((a, b) => b.salary_to - a.salary_to);
      else if (filters.sort === 'salary_asc') list.sort((a, b) => a.salary_from - b.salary_from);
      else if (filters.sort === 'new') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      else list.sort((a, b) => (b.is_premium - a.is_premium));
      return list;
    }
    let q = sb.from('vacancies').select('*, salon_profiles(salon_name, district, logo_url)').eq('is_active', true);
    if (filters.specialty) q = q.eq('specialty', filters.specialty);
    if (filters.district) q = q.eq('district', filters.district);
    if (filters.formats?.length) q = q.in('format', filters.formats);
    if (filters.sort === 'salary_desc') q = q.order('salary_to', { ascending: false });
    else if (filters.sort === 'salary_asc') q = q.order('salary_from', { ascending: true });
    else if (filters.sort === 'new') q = q.order('created_at', { ascending: false });
    else q = q.order('is_premium', { ascending: false }).order('created_at', { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async getVacancy(id) {
    if (DEMO_MODE) return DEMO.vacancies.find(v => v.id === id);
    const { data, error } = await sb.from('vacancies').select('*, salon_profiles(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async listMasters(filters = {}) {
    if (DEMO_MODE) {
      let list = DEMO.masters.filter(m =>
        (!filters.specialty || m.specialty === filters.specialty) &&
        (!filters.district || m.district === filters.district) &&
        (!filters.formats?.length || filters.formats.includes(m.format)) &&
        (!filters.experienced || m.experience_years >= 1) &&
        matchesSalary(m.desired_salary, filters.salaryRange) &&
        (!filters.text || m.specialty.toLowerCase().includes(filters.text.toLowerCase()) || m.full_name.toLowerCase().includes(filters.text.toLowerCase()))
      );
      if (filters.sort === 'salary_asc') list.sort((a, b) => a.desired_salary - b.desired_salary);
      else if (filters.sort === 'salary_desc') list.sort((a, b) => b.desired_salary - a.desired_salary);
      else if (filters.sort === 'exp_desc') list.sort((a, b) => b.experience_years - a.experience_years);
      else list.sort((a, b) => b.rating - a.rating);
      return list;
    }
    let q = sb.from('master_profiles').select('*, portfolio_photos(url, sort_order)').eq('is_open', true);
    if (filters.specialty) q = q.eq('specialty', filters.specialty);
    if (filters.district) q = q.eq('district', filters.district);
    if (filters.formats?.length) q = q.in('format', filters.formats);
    if (filters.sort === 'salary_asc') q = q.order('desired_salary', { ascending: true });
    else if (filters.sort === 'salary_desc') q = q.order('desired_salary', { ascending: false });
    else if (filters.sort === 'exp_desc') q = q.order('experience_years', { ascending: false });
    else q = q.order('rating', { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async getMaster(id) {
    if (DEMO_MODE) return DEMO.masters.find(m => m.id === id);
    const { data, error } = await sb.from('master_profiles').select('*, portfolio_photos(url, sort_order)').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createVacancy(payload) {
    if (DEMO_MODE) {
      const salonName = state.salonProfile?.salon_name || 'Мой салон';
      const v = { id: 'v' + (DEMO.nextId++), salon_id: 'me', salon_name: salonName, logo: salonLogo(salonName), photos: makePhotos(payload.specialty), tags: [payload.specialty], rating: 0, reviews_count: 0, created_at: new Date().toISOString(), ...payload };
      DEMO.vacancies.unshift(v);
      return v;
    }
    const { data, error } = await sb.from('vacancies').insert({ ...payload, salon_id: state.user.id }).select().single();
    if (error) throw error;
    return data;
  },

  async updateVacancy(id, payload) {
    if (DEMO_MODE) {
      const v = DEMO.vacancies.find(v => v.id === id);
      if (v) Object.assign(v, payload);
      return v;
    }
    const { data, error } = await sb.from('vacancies').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteVacancy(id) {
    if (DEMO_MODE) { DEMO.vacancies = DEMO.vacancies.filter(v => v.id !== id); return true; }
    const { error } = await sb.from('vacancies').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async withdrawApplication(id) {
    if (DEMO_MODE) { DEMO.applications = DEMO.applications.filter(a => a.id !== id); return true; }
    const { error } = await sb.from('applications').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async listMyVacancies() {
    if (DEMO_MODE) return DEMO.vacancies.filter(v => v.salon_id === 'me');
    const { data, error } = await sb.from('vacancies').select('*').eq('salon_id', state.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createMasterProfile(payload) {
    if (DEMO_MODE) {
      const m = { id: 'me', photos: [], rating: 0, reviews_count: 0, verified: false, ...payload };
      state.masterProfile = m;
      return m;
    }
    const { error } = await sb.from('master_profiles').upsert({ id: state.user.id, ...payload });
    if (error) throw error;
    return await this.getMaster(state.user.id);
  },

  async createSalonProfile(payload) {
    if (DEMO_MODE) {
      const s = { id: 'me', rating: 0, reviews_count: 0, ...payload };
      state.salonProfile = s;
      return s;
    }
    const { error } = await sb.from('salon_profiles').upsert({ id: state.user.id, ...payload });
    if (error) throw error;
    const { data } = await sb.from('salon_profiles').select('*').eq('id', state.user.id).single();
    return data;
  },

  async applyToVacancy(vacancyId) {
    if (DEMO_MODE) {
      DEMO.applications.push({ id: 'a' + (DEMO.nextId++), vacancy_id: vacancyId, master_id: state.masterProfile?.id || 'me', status: 'pending', created_at: new Date().toISOString() });
      return true;
    }
    const { error } = await sb.from('applications').insert({ vacancy_id: vacancyId, master_id: state.user.id });
    if (error) throw error;
    return true;
  },

  async listMyApplications() {
    if (DEMO_MODE) return DEMO.applications.filter(a => a.master_id === (state.masterProfile?.id || 'me'));
    const { data, error } = await sb.from('applications').select('*, vacancies(*, salon_profiles(salon_name))').eq('master_id', state.user.id);
    if (error) throw error;
    return data;
  },

  async listApplicationsForVacancy(vacancyId) {
    if (DEMO_MODE) return DEMO.applications.filter(a => a.vacancy_id === vacancyId);
    const { data, error } = await sb.from('applications').select('*, master_profiles(full_name, specialty, rating)').eq('vacancy_id', vacancyId);
    if (error) throw error;
    return data;
  },

  async listReviews(targetId, targetType) {
    if (DEMO_MODE) return DEMO.reviews.filter(r => r.target_id === targetId && r.target_type === targetType);
    const { data, error } = await sb.from('reviews').select('*').eq('target_id', targetId).eq('target_type', targetType).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createReview(payload) {
    if (DEMO_MODE) { DEMO.reviews.unshift({ id: 'r' + (DEMO.nextId++), author_name: 'Гость', ...payload }); return true; }
    const { error } = await sb.from('reviews').insert({ ...payload, author_id: state.user.id });
    if (error) throw error;
    return true;
  },

  async getSalonServices(key, specialtyHint) {
    if (DEMO_MODE) return getSalonExtras(key, specialtyHint).services;
    const { data, error } = await sb.from('services').select('*').eq('salon_id', key);
    if (error) throw error;
    return data;
  },

  async getSalonAvailability(key, specialtyHint) {
    if (DEMO_MODE) return getSalonExtras(key, specialtyHint).availability;
    const { data, error } = await sb.from('salon_availability').select('*').eq('salon_id', key);
    if (error) throw error;
    return data.length ? data : defaultAvailability();
  },

  async saveServices(key, services) {
    if (DEMO_MODE) { getSalonExtras(key).services = services; return true; }
    await sb.from('services').delete().eq('salon_id', key);
    if (services.length) { const { error } = await sb.from('services').insert(services.map(s => ({ salon_id: key, name: s.name, price: s.price, duration_minutes: s.duration_minutes }))); if (error) throw error; }
    return true;
  },

  async saveAvailability(key, availability) {
    if (DEMO_MODE) { getSalonExtras(key).availability = availability; return true; }
    for (const a of availability) {
      const { error } = await sb.from('salon_availability').upsert({ salon_id: key, weekday: a.weekday, open_time: a.open_time, close_time: a.close_time, is_closed: a.is_closed }, { onConflict: 'salon_id,weekday' });
      if (error) throw error;
    }
    return true;
  },

  async listBookingsForDate(key, dateStr) {
    if (DEMO_MODE) return DEMO.bookings.filter(b => b.salon_id === key && b.booking_date === dateStr);
    const { data, error } = await sb.from('bookings').select('*').eq('salon_id', key).eq('booking_date', dateStr);
    if (error) throw error;
    return data;
  },

  async getAvailableSlots(key, dateStr, durationMinutes, specialtyHint) {
    const availability = await this.getSalonAvailability(key, specialtyHint);
    const weekday = new Date(dateStr + 'T00:00:00').getDay();
    const day = availability.find(a => a.weekday === weekday);
    if (!day || day.is_closed) return [];
    const existing = await this.listBookingsForDate(key, dateStr);
    const bookedTimes = new Set(existing.filter(b => b.status !== 'cancelled').map(b => b.booking_time));
    const slots = [];
    let [h, m] = (day.open_time || '10:00').split(':').map(Number);
    const [ch, cm] = (day.close_time || '20:00').split(':').map(Number);
    while (h * 60 + m + Number(durationMinutes || 60) <= ch * 60 + cm) {
      const t = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      if (!bookedTimes.has(t)) slots.push(t);
      m += 30; if (m >= 60) { m -= 60; h += 1; }
    }
    return slots;
  },

  async createBooking(payload) {
    const deposit = (payload.price || 0) >= 10000 ? 1500 : 1000;
    if (DEMO_MODE) {
      const booking = { id: 'bk_' + Date.now(), status: 'pending', deposit_status: 'not_configured', deposit_amount: deposit, created_at: new Date().toISOString(), ...payload };
      DEMO.bookings.push(booking);
      return booking;
    }
    const { data, error } = await sb.from('bookings').insert({
      salon_id: payload.salon_id, service_id: payload.service_id, service_name: payload.service_name,
      client_name: payload.client_name, client_phone: payload.client_phone, client_email: payload.client_email,
      booking_date: payload.booking_date, booking_time: payload.booking_time, deposit_amount: deposit,
    }).select().single();
    if (error) throw error;
    return data;
  },

  async listSalonBookings(key) {
    if (DEMO_MODE) return [...DEMO.bookings].filter(b => b.salon_id === key).sort((a, b) => (a.booking_date + a.booking_time).localeCompare(b.booking_date + b.booking_time));
    const { data, error } = await sb.from('bookings').select('*').eq('salon_id', key).order('booking_date').order('booking_time');
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(id, status) {
    if (DEMO_MODE) { const b = DEMO.bookings.find(x => x.id === id); if (b) b.status = status; return true; }
    const { error } = await sb.from('bookings').update({ status }).eq('id', id);
    if (error) throw error;
    return true;
  },

  async listMessages(appId) {
    if (DEMO_MODE) return DEMO.messages.filter(m => m.application_id === appId);
    const { data, error } = await sb.from('messages').select('*').eq('application_id', appId).order('created_at');
    if (error) throw error;
    return data;
  },

  async sendMessage(appId, text) {
    if (DEMO_MODE) {
      const senderId = state.profile?.role === 'master' ? (state.masterProfile?.id || 'me') : 'me';
      const m = { id: 'msg_' + Date.now(), application_id: appId, sender_id: senderId, text, created_at: new Date().toISOString() };
      DEMO.messages.push(m);
      return m;
    }
    const { data, error } = await sb.from('messages').insert({ application_id: appId, sender_id: state.user.id, text }).select().single();
    if (error) throw error;
    return data;
  },

  async getStats() {
    if (DEMO_MODE) {
      const salons = new Set(DEMO.vacancies.map(v => v.salon_name)).size;
      return { masters: DEMO.masters.length, salons, activeVacancies: DEMO.vacancies.filter(v => v.is_active !== false).length };
    }
    const [{ count: masters }, { count: salons }, { count: activeVacancies }] = await Promise.all([
      sb.from('master_profiles').select('*', { count: 'exact', head: true }),
      sb.from('salon_profiles').select('*', { count: 'exact', head: true }),
      sb.from('vacancies').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);
    return { masters: masters || 0, salons: salons || 0, activeVacancies: activeVacancies || 0 };
  },

  async uploadPhoto(file, folder) {
    if (DEMO_MODE) return URL.createObjectURL(file);
    const path = `${folder}/${state.user.id}/${Date.now()}-${file.name}`;
    const { error } = await sb.storage.from('avatars').upload(path, file);
    if (error) throw error;
    const { data } = sb.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  },
};

// ---------------------------------------------------------------------------
// 5. АУТЕНТИФИКАЦИЯ
// ---------------------------------------------------------------------------
async function loadMyProfile() {
  if (!state.user) { state.profile = state.masterProfile = state.salonProfile = null; return; }
  if (DEMO_MODE) return;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
  state.profile = profile;
  if (profile?.role === 'master') {
    const { data } = await sb.from('master_profiles').select('*, portfolio_photos(url)').eq('id', state.user.id).maybeSingle();
    state.masterProfile = data;
  } else if (profile?.role === 'salon') {
    const { data } = await sb.from('salon_profiles').select('*').eq('id', state.user.id).maybeSingle();
    state.salonProfile = data;
  }
}

async function signUp(email, password, role) {
  state.roleTab = role;
  if (DEMO_MODE) {
    state.user = { id: 'me', email };
    state.profile = { id: 'me', role, email };
    showToast('Демо-режим: аккаунт создан локально (не сохраняется).');
    goto(role === 'master' ? '#/onboarding/master' : '#/onboarding/salon');
    return;
  }
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return showToast(error.message, 'error');
  if (data.session) {
    await sb.from('profiles').insert({ id: data.user.id, role, email });
    state.user = data.user;
    await loadMyProfile();
    showToast('Регистрация успешна!');
    goto(role === 'master' ? '#/onboarding/master' : '#/onboarding/salon');
  } else {
    showToast('Проверьте почту — нужно подтвердить регистрацию.');
    window.__pendingRole = role;
    goto('#/login');
  }
}

async function signIn(email, password) {
  if (DEMO_MODE) return showToast('В демо-режиме доступна только регистрация.', 'error');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return showToast(error.message, 'error');
  state.user = data.user;
  let { data: profile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
  if (!profile && window.__pendingRole) {
    await sb.from('profiles').insert({ id: state.user.id, role: window.__pendingRole, email });
    profile = { id: state.user.id, role: window.__pendingRole, email };
  }
  await loadMyProfile();
  showToast('Добро пожаловать!');
  if (profile?.role) state.roleTab = profile.role;
  const hasFullProfile = profile?.role === 'master' ? state.masterProfile : state.salonProfile;
  goto(hasFullProfile ? '#/' : `#/onboarding/${profile?.role}`);
}

async function signOut() {
  if (!DEMO_MODE) await sb.auth.signOut();
  state.user = state.profile = state.masterProfile = state.salonProfile = null;
  showToast('Вы вышли из аккаунта.');
  goto('#/');
}

// ---------------------------------------------------------------------------
// 6. РОУТИНГ
// ---------------------------------------------------------------------------
function parseRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);
  state.route = '/' + (parts[0] || '');
  state.params = { id: parts[1], action: parts[2] };
}
window.addEventListener('hashchange', () => { parseRoute(); render(); window.scrollTo(0, 0); });

// ---------------------------------------------------------------------------
// 7. ПЕРЕИСПОЛЬЗУЕМЫЕ БЛОКИ ИНТЕРФЕЙСА
// ---------------------------------------------------------------------------
function fillDistrictSelects() {
  const sel = document.getElementById('headerSearchDistrict');
  if (sel && sel.children.length <= 1) DISTRICTS.forEach(d => sel.insertAdjacentHTML('beforeend', `<option>${d}</option>`));
}

function renderHeaderAuth() {
  const box = document.getElementById('authArea');
  document.querySelectorAll('.role-tab').forEach(b => {
    const active = b.dataset.roleTab === state.roleTab;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow-sm', active);
    b.classList.toggle('text-plum', active);
    b.classList.toggle('text-warm-500', !active);
  });

  const favCount = state.favorites.size;
  const msgCount = state.user ? (state.profile?.role === 'master' ? DEMO.applications.filter(a => a.master_id === (state.masterProfile?.id || 'me')).length : DEMO.vacancies.filter(v => v.salon_id === 'me').reduce((n, v) => n + DEMO.applications.filter(a => a.vacancy_id === v.id).length, 0)) : 0;

  document.getElementById('favBadgeMobile').classList.toggle('hidden', favCount === 0);
  document.getElementById('favBadgeMobile').textContent = favCount;
  document.getElementById('msgBadgeMobile').classList.toggle('hidden', msgCount === 0);
  document.getElementById('msgBadgeMobile').textContent = msgCount;

  if (!state.user) {
    box.innerHTML = `
      <button data-action="go" data-href="#/login" class="text-sm font-medium text-warm-600 hover:text-plum hidden sm:inline-block">Войти</button>
      <button data-action="go" data-href="#/signup" class="btn-primary !px-4 !py-2 text-sm">Регистрация</button>`;
  } else {
    const isSalon = state.profile?.role === 'salon';
    const avatarUrl = isSalon ? (state.salonProfile?.logo_url || salonLogo(state.salonProfile?.salon_name || 'Салон')) : (state.masterProfile?.avatar_url || state.masterProfile?.avatar || masterAvatar(state.masterProfile?.full_name || 'Мастер'));
    const label = isSalon ? (state.salonProfile?.salon_name || 'Салон') : (state.masterProfile?.full_name || 'Профиль');
    box.innerHTML = `
      ${isSalon ? `<a href="#/vacancy/new" class="btn-primary !px-3 !py-1.5 text-sm hidden sm:inline-block">+ Вакансия</a>` : ''}
      <button data-action="go" data-href="#/chats" class="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-full text-warm-600 hover:bg-plum-50 hover:text-plum transition" title="Сообщения">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        ${msgCount ? `<span class="badge-dot">${msgCount}</span>` : ''}
      </button>
      <button data-action="go" data-href="#/favorites" class="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-full text-warm-600 hover:bg-plum-50 hover:text-plum transition" title="Избранное">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        ${favCount ? `<span class="badge-dot">${favCount}</span>` : ''}
      </button>
      <button data-action="go" data-href="#/profile" class="flex items-center gap-2 group rounded-full hover:bg-plum-50 pr-1 sm:pr-3 transition">
        <img src="${avatarUrl}" class="w-9 h-9 rounded-full object-cover border border-warm-200 bg-white">
        <span class="hidden lg:inline text-sm font-medium text-warm-700 group-hover:text-plum">${escapeHtml(label)}</span>
      </button>
      <button data-action="signout" class="text-sm text-warm-500 hover:text-red-500 hidden sm:inline-block">Выйти</button>`;
  }
}

function activeFilterCount() {
  const f = state.filters;
  return (f.specialty ? 1 : 0) + (f.district ? 1 : 0) + (f.salaryRange ? 1 : 0) + (f.experienced ? 1 : 0) + (f.formats?.length || 0);
}

function sidebarFilters() {
  const f = state.filters;
  const chk = (fmt) => f.formats.includes(fmt);
  const n = activeFilterCount();
  return `
  <aside id="filterSidebar" class="hidden lg:block card p-5 h-fit lg:sticky lg:top-20 relative border-t-4 !border-t-plum">
    <div class="flex items-center justify-between mb-5 relative">
      <h3 class="font-bold flex items-center gap-2 text-base"><span class="w-8 h-8 rounded-lg bg-plum-50 text-plum flex items-center justify-center">${ic('sliders', 16)}</span> Фильтры</h3>
      <span id="filterCountBadge">${n ? `<span class="tag bg-plum text-white">${n}</span>` : ''}</span>
    </div>
    <div class="space-y-4 relative">
      <div>
        <label class="text-xs font-semibold text-warm-600 mb-1.5 flex items-center gap-1.5">${ic('briefcase', 14)} Специализация</label>
        <select data-filter="specialty" class="input">
          <option value="">Все специализации</option>
          ${SPECIALTIES.map(s => `<option ${f.specialty === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-warm-600 mb-1.5 flex items-center gap-1.5">${ic('pin', 14)} Район</label>
        <select data-filter="district" class="input">
          <option value="">Весь Алматы</option>
          ${DISTRICTS.map(d => `<option ${f.district === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-warm-600 mb-1.5 flex items-center gap-1.5">${ic('wallet', 14)} Зарплата</label>
        <select data-filter="salaryRange" class="input">
          ${SALARY_RANGES.map(r => `<option value="${r.value}" ${f.salaryRange === r.value ? 'selected' : ''}>${r.label}</option>`).join('')}
        </select>
      </div>
      <button type="button" data-action="toggle-experienced" class="w-full text-left flex items-center gap-2 text-sm rounded-xl px-3 py-2.5 transition ${f.experienced ? 'bg-plum text-white shadow-sm' : 'bg-warm-50 text-warm-600 border border-warm-200 hover:border-plum hover:text-plum'}">
        ${ic('award', 16)} Только с опытом
      </button>
      <div>
        <p class="text-xs font-semibold text-warm-600 mb-2 flex items-center gap-1.5">${ic('layers', 14)} Формат работы</p>
        <div class="flex flex-wrap gap-1.5">
          ${FORMATS.map(fo => `
          <button type="button" data-action="toggle-format" data-format="${fo}" class="text-sm filter-pill rounded-lg px-3.5 py-2 border ${chk(fo) ? 'bg-plum text-white border-plum shadow-sm' : 'bg-white border-warm-300 text-warm-600 hover:border-plum hover:text-plum'}">
            ${fo}
          </button>`).join('')}
        </div>
      </div>
      <div id="filterResetArea">${n ? `<button data-action="reset-filters" class="text-sm text-plum hover:underline font-medium inline-flex items-center gap-1.5">${ic('x', 14)} Сбросить фильтры (${n})</button>` : `<p class="text-xs text-warm-300">Фильтры не выбраны</p>`}</div>
    </div>
  </aside>`;
}

function updateFilterSidebarBadges() {
  const n = activeFilterCount();
  const badge = document.getElementById('filterCountBadge');
  if (badge) badge.innerHTML = n ? `<span class="tag bg-plum text-white">${n}</span>` : '';
  const resetArea = document.getElementById('filterResetArea');
  if (resetArea) resetArea.innerHTML = n
    ? `<button data-action="reset-filters" class="text-sm text-plum hover:underline font-medium inline-flex items-center gap-1.5">${ic('x', 14)} Сбросить фильтры (${n})</button>`
    : `<p class="text-xs text-warm-300">Фильтры не выбраны</p>`;
}

const TAG_PALETTE = [['bg-plum-50', 'text-plum'], ['bg-gold-50', 'text-gold'], ['bg-sage-50', 'text-sage'], ['bg-peach-50', 'text-peach']];
function tagClass(text) {
  let hash = 0;
  for (const ch of String(text)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const [bg, txt] = TAG_PALETTE[hash % TAG_PALETTE.length];
  return `${bg} ${txt}`;
}
function tagHtml(text) { return `<span class="tag ${tagClass(text)}">${escapeHtml(text)}</span>`; }

function favBtn(type, id) {
  const key = `${type}:${id}`;
  const active = state.favorites.has(key);
  return `<button data-action="toggle-fav" data-fav-type="${type}" data-fav-id="${id}" class="w-11 h-11 shrink-0 rounded-xl border ${active ? 'border-plum bg-plum-50 fav-active' : 'border-warm-200 text-warm-500'} flex items-center justify-center hover:border-plum transition" title="В избранное">
    ${ic('heart', 18, active)}
  </button>`;
}

function vacancyCard(v) {
  const salonName = v.salon_profiles?.salon_name || v.salon_name || 'Салон';
  const logo = v.logo || v.salon_profiles?.logo_url || salonLogo(salonName);
  const photos = (v.photos || []).slice(0, 4);
  const tags = v.tags || [v.specialty];
  const isOwner = state.user && state.profile?.role === 'salon' && (v.salon_id === state.user.id || v.salon_id === 'me');
  return `
  <div class="card p-5 hover:shadow-cardHover ${v.is_premium ? 'ring-2 ring-gold/30' : ''}">
    <div class="flex gap-3 items-start cursor-pointer" data-action="go" data-href="#/vacancy/${v.id}">
      <img src="${logo}" class="w-14 h-14 rounded-full object-cover border border-warm-100 shrink-0 bg-white">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <a href="#/salon/${salonKeyFor(v)}" onclick="event.stopPropagation()" class="font-bold truncate hover:text-plum">${escapeHtml(salonName)}</a>
          ${v.is_premium ? `<span class="tag bg-gold-50 text-gold inline-flex items-center gap-1">${ic('star', 12, true)} Premium</span>` : ''}
          ${isOwner ? '<span class="tag bg-sage-50 text-sage">Ваша вакансия</span>' : ''}
        </div>
        <p class="text-sm text-warm-500">${escapeHtml(v.specialty)}</p>
        <p class="text-gold text-sm">${stars(v.rating)} <span class="text-warm-500">(${v.reviews_count || 0} отзывов)</span></p>
        <p class="text-xs text-warm-500 mt-0.5">${escapeHtml(v.district || '')}</p>
      </div>
      <p class="text-plum font-bold text-sm text-right shrink-0 bg-plum-50 rounded-lg px-2.5 py-1.5">${money(v.salary_from)}–${money(v.salary_to)}</p>
    </div>

    ${photos.length ? `
    <div class="grid grid-cols-4 gap-1.5 mt-3 cursor-pointer" data-action="go" data-href="#/vacancy/${v.id}">
      ${photos.map(p => `<img src="${p}" class="w-full aspect-square object-cover rounded-lg" loading="lazy">`).join('')}
    </div>` : ''}

    <div class="flex flex-wrap gap-1.5 mt-3">
      ${tags.map(t => tagHtml(t)).join('')}
      ${tagHtml(v.schedule || '')}
    </div>

    <div class="flex gap-2 mt-4">
      ${isOwner ? `
        <a href="#/vacancy/${v.id}/edit" onclick="event.stopPropagation()" class="btn-primary flex-1 text-sm text-center">Редактировать</a>
        <button data-action="delete-vacancy" data-id="${v.id}" class="btn-secondary !border-red-300 !text-red-500 text-sm">Удалить</button>
      ` : state.profile?.role === 'salon' ? `
        <div class="flex-1 flex items-center justify-center text-xs text-warm-500 bg-warm-50 rounded-xl">Вакансия другого салона</div>
        ${favBtn('vacancy', v.id)}
      ` : `
        <button data-action="apply" data-id="${v.id}" class="btn-primary flex-1 text-sm">Откликнуться</button>
        ${favBtn('vacancy', v.id)}
      `}
    </div>
  </div>`;
}

function masterCard(m) {
  const photos = (m.portfolio_photos || m.photos || []).map(p => p.url || p).slice(0, 4);
  const avatar = m.avatar_url || m.avatar || masterAvatar(m.full_name);
  return `
  <div class="card p-5 hover:shadow-cardHover">
    <div class="flex gap-3 items-start cursor-pointer" data-action="go" data-href="#/master/${m.id}">
      <img src="${avatar}" class="w-14 h-14 rounded-full object-cover border border-warm-100 shrink-0 bg-white">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 flex-wrap">
          <h3 class="font-bold truncate">${escapeHtml(m.full_name)}</h3>
          ${m.verified ? '<span title="Проверенный профиль" class="text-plum text-sm">' + ic('check', 14) + '</span>' : ''}
          ${m.urgent ? '<span class="tag bg-sage-50 text-sage">Ищет срочно</span>' : ''}
        </div>
        <p class="text-sm text-warm-500">${escapeHtml(m.specialty)} • ${m.experience_years || 0} {{YEARS}}</p>
        <p class="text-gold text-sm">${stars(m.rating)} <span class="text-warm-500">(${m.reviews_count || 0} отзывов)</span></p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-plum font-bold text-sm">${money(m.desired_salary)}</p>
        <p class="text-xs text-warm-500 mt-0.5">${escapeHtml(m.district || '')}</p>
      </div>
    </div>

    ${photos.length ? `
    <div class="grid grid-cols-4 gap-1.5 mt-3 cursor-pointer" data-action="go" data-href="#/master/${m.id}">
      ${photos.map(p => `<img src="${p}" class="w-full aspect-square object-cover rounded-lg" loading="lazy">`).join('')}
    </div>` : ''}

    <div class="flex flex-wrap gap-1.5 mt-3">
      ${(m.skills || []).map(s => tagHtml(s)).join('')}
    </div>

    <div class="flex gap-2 mt-4">
      ${state.profile?.role === 'master' ? `
        <div class="flex-1 flex items-center justify-center text-xs text-warm-500 bg-warm-50 rounded-xl">Профиль коллеги</div>
        ${favBtn('master', m.id)}
      ` : `
        <button data-action="invite" data-id="${m.id}" class="btn-primary flex-1 text-sm">Пригласить</button>
        ${favBtn('master', m.id)}
      `}
    </div>
  </div>`;
}

function yearsWord(n) {
  n = Math.abs(n) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return 'лет опыта';
  if (n1 === 1) return 'год опыта';
  if (n1 >= 2 && n1 <= 4) return 'года опыта';
  return 'лет опыта';
}
function fixYears(html, n) { return html.replace('{{YEARS}}', yearsWord(n)); }

function emptyState(text, icon = 'inbox', ctaLabel, ctaHref) {
  return `
  <div class="col-span-full text-center py-16 px-6 border border-warm-200 rounded-lg bg-white">
    <div class="w-12 h-12 mx-auto rounded-lg bg-plum-50 text-plum flex items-center justify-center mb-4">${ic(icon, 22)}</div>
    <p class="text-warm-500 max-w-sm mx-auto">${escapeHtml(text)}</p>
    ${ctaLabel ? `<a href="${ctaHref}" class="btn-primary inline-block mt-4 text-sm">${escapeHtml(ctaLabel)}</a>` : ''}
  </div>`;
}

function skeletonCards(n = 4) {
  return Array.from({ length: n }).map(() => `
    <div class="card p-4 animate-pulse">
      <div class="flex gap-3">
        <div class="w-14 h-14 rounded-full bg-warm-100 shrink-0"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-3 bg-warm-100 rounded w-2/3"></div>
          <div class="h-3 bg-warm-100 rounded w-1/3"></div>
          <div class="h-3 bg-warm-100 rounded w-1/2"></div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-1.5 mt-3">
        ${'<div class="aspect-square bg-warm-100 rounded-lg"></div>'.repeat(4)}
      </div>
      <div class="h-9 bg-warm-100 rounded-xl mt-4"></div>
    </div>`).join('');
}

// ---------------------------------------------------------------------------
// 8. РЕНДЕР ЭКРАНОВ
// ---------------------------------------------------------------------------
async function render() {
  if (typeof currentChatChannel !== 'undefined' && currentChatChannel && !(state.route === '/chats' && state.params.id)) { try { sb?.removeChannel(currentChatChannel); } catch (e) {} currentChatChannel = null; }
  fillDistrictSelects();
  renderHeaderAuth();
  const r = state.route;
  if (r === '/') return renderBrowse();
  if (r === '/vacancies') { state.roleTab = 'master'; return renderBrowse(); }
  if (r === '/masters') { state.roleTab = 'salon'; return renderBrowse(); }
  if (r === '/vacancy') {
    if (state.params.id === 'new') return renderVacancyForm();
    if (state.params.action === 'edit') return renderVacancyForm(state.params.id);
    return renderVacancyDetail(state.params.id);
  }
  if (r === '/master') return renderMasterDetail(state.params.id);
  if (r === '/login') return renderAuth('login');
  if (r === '/signup') return renderAuth('signup');
  if (r === '/onboarding') return renderOnboarding(state.params.id);
  if (r === '/pricing') return renderPricing();
  if (r === '/profile') return renderMyProfile();
  if (r === '/applications') return renderApplications();
  if (r === '/favorites') return renderFavorites();
  if (r === '/salon') return renderSalonPublicPage(state.params.id);
  if (r === '/services') return renderServicesSettings();
  if (r === '/bookings') return renderMyBookings();
  if (r === '/chats') return state.params.id ? renderChatThread(state.params.id) : renderChats();
  app.innerHTML = `<div class="py-20 text-center text-warm-500">Страница не найдена. <a href="#/" class="text-plum underline">На главную</a></div>`;
}

async function statsBar() {
  const stats = await Data.getStats();
  return `
  <div class="inline-flex flex-wrap divide-x divide-white/25 border border-white/25 rounded-xl bg-white/10 backdrop-blur mt-6 text-sm">
    <div class="px-5 py-3"><span class="text-xl font-bold text-white">${stats.masters}</span> <span class="text-white/75">мастеров</span></div>
    <div class="px-5 py-3"><span class="text-xl font-bold text-white">${stats.salons}</span> <span class="text-white/75">салонов</span></div>
    <div class="px-5 py-3"><span class="text-xl font-bold text-white">${stats.activeVacancies}</span> <span class="text-white/75">активных вакансий</span></div>
  </div>`;
}

async function adSlot() {
  const items = await Data.listVacancies({});
  const promoted = items.find(v => v.is_premium);
  if (!promoted) return '';
  const salonName = promoted.salon_profiles?.salon_name || promoted.salon_name || 'Салон';
  return `
  <a href="#/salon/${salonKeyFor(promoted)}" class="card p-4 flex items-center gap-3 mb-4 border border-gold-50 bg-gold-50/40 hover:shadow-cardHover transition">
    <span class="tag bg-gold-50 text-gold shrink-0">Реклама</span>
    <img src="${promoted.logo || salonLogo(salonName)}" class="w-10 h-10 rounded-full object-cover border border-white bg-white shrink-0">
    <div class="min-w-0">
      <p class="font-medium text-sm truncate">${escapeHtml(salonName)} ищет ${escapeHtml(promoted.specialty)}</p>
      <p class="text-xs text-warm-500">Продвигается салоном • ${escapeHtml(promoted.district || '')}</p>
    </div>
  </a>`;
}

async function renderBrowse() {
  app.innerHTML = `
  <section class="hero-bg text-white rounded-2xl px-6 md:px-10 py-8 md:py-12 mt-6 mb-8 shadow-cardHover">
    <h1 class="text-3xl md:text-5xl font-serif font-bold max-w-3xl leading-tight">
      ${state.roleTab === 'master' ? 'Вакансии в бьюти-индустрии Алматы' : 'База мастеров для вашего салона'}
    </h1>
    <p class="text-white/80 mt-3 max-w-xl text-base md:text-lg">
      ${state.roleTab === 'master' ? 'Зарплата, график и условия указаны на карточке каждой вакансии.' : 'Портфолио, опыт и отзывы каждого мастера. Приглашайте напрямую, без посредников.'}
    </p>
    <div id="statsBarBox" class="text-white/70 mt-6 text-sm">Загрузка статистики…</div>
  </section>

  <div class="lg:hidden mb-4">
    <input data-filter="text" value="${escapeHtml(state.filters.text || '')}" placeholder="${state.roleTab === 'master' ? 'Поиск по вакансиям…' : 'Поиск по мастерам…'}" class="input">
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
    ${sidebarFilters()}
    <div>
      <div id="adSlotBox"></div>
      <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div class="flex items-center gap-2">
          <button data-action="open-filter-drawer" class="lg:hidden btn-secondary !px-3 !py-2 text-sm flex items-center gap-1.5">
            ${ic('sliders', 16)} Фильтры <span id="mobileFilterBadge"></span>
          </button>
          <p id="resultsCount" class="text-sm text-warm-600 font-medium">Загрузка…</p>
        </div>
        <select id="sortSelect" class="input w-auto text-sm !py-2 !pr-8">
          ${(state.roleTab === 'master' ? SORT_VACANCY : SORT_MASTER).map(o => `<option value="${o.value}" ${state.filters.sort === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </div>
      <div id="filterChips" class="flex flex-wrap gap-2 mb-3"></div>
      <div id="results" class="grid sm:grid-cols-2 gap-4">${skeletonCards(4)}</div>
    </div>
  </div>`;
  document.getElementById('statsBarBox').outerHTML = await statsBar();
  if (state.roleTab === 'master') document.getElementById('adSlotBox').innerHTML = await adSlot();
  await refreshResults();
}


function openMobileMenu() {
  const isAuth = !!state.user;
  const link = (href, icon, label) => `<button data-modal-close data-action="go" data-href="${href}" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm font-medium text-warm-700 hover:bg-warm-100">${ic(icon, 18)} ${label}</button>`;
  document.getElementById('modalRoot').innerHTML = `
    <div class="fixed inset-0 bg-black/40 z-50 flex" data-modal-overlay>
      <div class="bg-white w-[84%] max-w-xs h-full overflow-y-auto p-5 flex flex-col" data-modal-panel style="animation:slideInLeft .2s ease">
        <div class="flex items-center justify-between mb-5">
          <span class="font-serif font-bold text-lg text-plum">BeautyHire</span>
          <button data-modal-close class="text-warm-500 p-1" aria-label="Закрыть меню">${ic('x', 20)}</button>
        </div>
        <p class="text-xs text-warm-500 mb-2">Раздел</p>
        <div class="grid grid-cols-2 gap-1 bg-warm-100 rounded-lg p-1 text-sm font-medium mb-5">
          <button data-modal-close data-action="go" data-href="#/vacancies" class="py-2 rounded-md ${state.roleTab === 'master' ? 'bg-white text-plum shadow-sm' : 'text-warm-500'}">Вакансии</button>
          <button data-modal-close data-action="go" data-href="#/masters" class="py-2 rounded-md ${state.roleTab === 'salon' ? 'bg-white text-plum shadow-sm' : 'text-warm-500'}">Мастера</button>
        </div>
        <nav class="space-y-0.5 flex-1">
          ${link('#/', 'search', 'Поиск')}
          ${link('#/favorites', 'heart', 'Избранное')}
          ${link('#/chats', 'message', 'Чаты')}
          ${link('#/pricing', 'tag', 'Тарифы')}
          ${isAuth ? link('#/profile', 'user', 'Профиль') : ''}
          ${isAuth && state.profile?.role === 'salon' ? link('#/vacancy/new', 'briefcase', 'Разместить вакансию') : ''}
        </nav>
        <div class="pt-4 mt-4 border-t border-warm-200 space-y-2">
          ${isAuth
            ? `<button data-modal-close data-action="signout" class="btn-secondary w-full text-sm">Выйти</button>`
            : `<button data-modal-close data-action="go" data-href="#/signup" class="btn-primary w-full text-sm">Регистрация</button>
               <button data-modal-close data-action="go" data-href="#/login" class="btn-secondary w-full text-sm">Войти</button>`}
        </div>
      </div>
    </div>`;
}

function openFilterDrawer() {
  const sidebar = document.getElementById('filterSidebar');
  if (!sidebar) return;
  const placeholder = document.createElement('div');
  placeholder.id = 'filterSidebarPlaceholder';
  placeholder.style.display = 'none';
  sidebar.parentNode.insertBefore(placeholder, sidebar);
  document.getElementById('modalRoot').innerHTML = `
    <div class="fixed inset-0 bg-black/40 z-50 flex" data-modal-overlay>
      <div class="bg-white w-[86%] max-w-sm h-full overflow-y-auto p-5 relative" data-modal-panel style="animation:slideInLeft .2s ease">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-bold text-lg">Фильтры</h2>
          <button data-modal-close class="text-warm-500">${ic('x', 18)}</button>
        </div>
        <div id="drawerSidebarSlot"></div>
        <button data-modal-close class="btn-primary w-full mt-4">Показать результаты</button>
      </div>
    </div>`;
  const slot = document.getElementById('drawerSidebarSlot');
  slot.appendChild(sidebar);
  sidebar.classList.remove('hidden');
}

function chipRow() {
  const f = state.filters;
  const chips = [];
  if (f.specialty) chips.push(['specialty', f.specialty]);
  if (f.district) chips.push(['district', f.district]);
  if (f.salaryRange) chips.push(['salaryRange', SALARY_RANGES.find(r => r.value === f.salaryRange)?.label]);
  if (f.experienced) chips.push(['experienced', 'Только с опытом']);
  (f.formats || []).forEach(fo => chips.push(['format:' + fo, fo]));
  const box = document.getElementById('filterChips');
  if (!box) return;
  box.innerHTML = chips.map(([key, label]) => `
    <button data-action="remove-chip" data-key="${key}" class="tag ${tagClass(label)} inline-flex items-center gap-1.5 hover:opacity-80">
      ${escapeHtml(label)} ${ic('x', 12)}
    </button>`).join('');
}

async function refreshResults() {
  const box = document.getElementById('results');
  if (!box) return;
  updateFilterSidebarBadges();
  chipRow();
  try {
    if (state.roleTab === 'master') {
      const items = await Data.listVacancies(state.filters);
      setResultsCount(items.length, 'вакансия', 'вакансии', 'вакансий');
      box.innerHTML = items.length ? items.map(vacancyCard).join('') : emptyState('Пока нет вакансий по этим фильтрам. Попробуйте изменить условия слева.', 'search');
    } else {
      const items = await Data.listMasters(state.filters);
      setResultsCount(items.length, 'мастер', 'мастера', 'мастеров');
      box.innerHTML = items.length ? items.map(m => fixYears(masterCard(m), m.experience_years || 0)).join('') : emptyState('Пока нет мастеров по этим фильтрам. Попробуйте изменить условия слева.', 'search');
    }
  } catch (e) { box.innerHTML = emptyState('Не удалось загрузить данные: ' + e.message, 'alert'); }
}

function setResultsCount(n, one, few, many) {
  const el = document.getElementById('resultsCount');
  if (!el) return;
  const mod10 = n % 10, mod100 = n % 100;
  let word = many;
  if (mod10 === 1 && mod100 !== 11) word = one;
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = few;
  el.textContent = `Найдено ${n} ${word}`;
}

async function renderVacancyDetail(id) {
  app.innerHTML = `<p class="py-20 text-center text-warm-500">Загрузка…</p>`;
  const v = await Data.getVacancy(id);
  if (!v) return (app.innerHTML = emptyState('Вакансия не найдена.'));
  const salonName = v.salon_profiles?.salon_name || v.salon_name || 'Салон';
  const photos = v.photos || [];
  const isOwner = state.user && state.profile?.role === 'salon' && (v.salon_id === state.user.id || v.salon_id === 'me');
  app.innerHTML = `
  <div class="max-w-3xl mx-auto py-8">
    <a href="#/vacancies" class="inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 hover:text-plum">${ic('back', 16)} Все вакансии</a>
    <div class="card p-6 mt-4">
      <div class="flex gap-4 items-center">
        <img src="${v.logo || salonLogo(salonName)}" class="w-16 h-16 rounded-full object-cover border border-warm-100 bg-white">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <a href="#/salon/${salonKeyFor(v)}" class="text-2xl font-serif font-bold hover:text-plum">${escapeHtml(salonName)}</a>
            ${v.is_premium ? `<span class="tag bg-gold-50 text-gold inline-flex items-center gap-1">${ic('star', 12, true)} Premium</span>` : ''}
          </div>
          <p class="text-gold text-sm">${stars(v.rating)} <span class="text-warm-500">(${v.reviews_count || 0} отзывов)</span></p>
        </div>
      </div>

      ${photos.length ? `
      <div class="swiper mt-5"><div class="swiper-wrapper">
        ${photos.map(p => `<div class="swiper-slide"><img src="${p}" class="w-full h-64 object-cover rounded-xl"></div>`).join('')}
      </div><div class="swiper-pagination"></div></div>` : ''}

      <p class="text-plum font-bold text-xl mt-4">${money(v.salary_from)} – ${money(v.salary_to)}</p>
      <div class="flex flex-wrap gap-1.5 my-3">
        ${tagHtml(v.specialty)}${tagHtml(v.district || '')}
        ${(v.tags || []).map(t => tagHtml(t)).join('')}
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-sm">
        <div><p class="text-warm-500">Опыт</p><p class="font-medium">${escapeHtml(v.experience_required || '—')}</p></div>
        <div><p class="text-warm-500">График</p><p class="font-medium">${escapeHtml(v.schedule || '—')}</p></div>
        <div><p class="text-warm-500">Формат</p><p class="font-medium">${escapeHtml(v.format || '—')}</p></div>
      </div>
      <h3 class="font-bold mb-1">Описание</h3>
      <p class="text-warm-600 mb-4">${escapeHtml(v.description || '—')}</p>
      <h3 class="font-bold mb-1">Требования</h3>
      <p class="text-warm-600 mb-4">${escapeHtml(v.requirements || '—')}</p>
      <h3 class="font-bold mb-1">Условия и бонусы</h3>
      <p class="text-warm-600 mb-6">${escapeHtml(v.bonuses || '—')}</p>
      <div class="flex gap-2">
        ${isOwner ? `
          <a href="#/vacancy/${v.id}/edit" class="btn-primary flex-1 sm:flex-none sm:px-8 text-center">Редактировать</a>
          <button data-action="delete-vacancy" data-id="${v.id}" class="btn-secondary !border-red-300 !text-red-500">Удалить</button>
        ` : state.profile?.role === 'salon' ? `
          <div class="flex-1 flex items-center justify-center text-xs text-warm-500 bg-warm-50 rounded-xl px-4">Это вакансия другого салона</div>
          ${favBtn('vacancy', v.id)}
        ` : `
          <button data-action="apply" data-id="${v.id}" class="btn-primary flex-1 sm:flex-none sm:px-8">Откликнуться</button>
          ${favBtn('vacancy', v.id)}
        `}
      </div>
    </div>
  </div>`;
  if (photos.length) new Swiper('.swiper', { pagination: { el: '.swiper-pagination', clickable: true } });
}

async function renderMasterDetail(id) {
  app.innerHTML = `<p class="py-20 text-center text-warm-500">Загрузка…</p>`;
  const m = await Data.getMaster(id);
  if (!m) return (app.innerHTML = emptyState('Мастер не найден.'));
  const photos = (m.portfolio_photos || m.photos || []).map(p => p.url || p);
  const reviews = await Data.listReviews(id, 'master');
  app.innerHTML = `
  <div class="max-w-3xl mx-auto py-8">
    <a href="#/masters" class="text-sm text-warm-500 hover:text-plum">← Все мастера</a>
    <div class="card p-6 mt-4">
      <div class="flex gap-4 items-center">
        <img src="${m.avatar_url || m.avatar || masterAvatar(m.full_name)}" class="w-20 h-20 rounded-full object-cover border border-warm-100 shrink-0 bg-white">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-2xl font-serif font-bold">${escapeHtml(m.full_name)}</h1>
            ${m.verified ? '<span title="Проверенный профиль" class="text-plum">' + ic('check', 16) + '</span>' : ''}
          </div>
          <p class="text-warm-500 text-sm">${escapeHtml(m.specialty)} • ${m.experience_years || 0} ${yearsWord(m.experience_years || 0)} • ${escapeHtml(m.district || '')}</p>
          <p class="text-gold">${stars(m.rating)} <span class="text-warm-500 text-sm">(${m.reviews_count || 0} отзывов)</span></p>
        </div>
      </div>

      ${photos.length ? `
      <div class="swiper mt-5"><div class="swiper-wrapper">
        ${photos.map(p => `<div class="swiper-slide"><img src="${p}" class="w-full h-64 object-cover rounded-xl"></div>`).join('')}
      </div><div class="swiper-pagination"></div></div>` : ''}

      <p class="text-warm-600 my-4">${escapeHtml(m.bio || '')}</p>
      <div class="flex flex-wrap gap-2 mb-4">${(m.skills || []).map(s => tagHtml(s)).join('')}</div>
      <div class="grid grid-cols-3 gap-3 text-sm mb-6">
        <div><p class="text-warm-500">Желаемая ЗП</p><p class="font-medium">${money(m.desired_salary)}</p></div>
        <div><p class="text-warm-500">График</p><p class="font-medium">${escapeHtml(m.schedule || '—')}</p></div>
        <div><p class="text-warm-500">Формат</p><p class="font-medium">${escapeHtml(m.format || '—')}</p></div>
      </div>
      <div class="flex gap-2">
        ${state.profile?.role === 'master' ? `
          <div class="flex-1 flex items-center justify-center text-xs text-warm-500 bg-warm-50 rounded-xl px-4 py-3">Это профиль коллеги по цеху</div>
        ` : `
          <button data-action="invite" data-id="${m.id}" class="btn-primary flex-1 sm:flex-none sm:px-8">Пригласить / написать</button>
        `}
        ${favBtn('master', m.id)}
      </div>

      <h3 class="font-bold mt-8 mb-3">Отзывы</h3>
      <div class="space-y-3">
        ${reviews.length ? reviews.map(r => `
          <div class="border border-warm-100 rounded-xl p-3">
            <p class="text-gold text-sm">${stars(r.rating)}</p>
            <p class="text-sm text-warm-600 mt-1">${escapeHtml(r.text)}</p>
            <p class="text-xs text-warm-500 mt-1">${escapeHtml(r.author_name || 'Салон')}</p>
          </div>`).join('') : '<p class="text-warm-500 text-sm">Пока нет отзывов.</p>'}
      </div>
    </div>
  </div>`;
  if (photos.length) new Swiper('.swiper', { pagination: { el: '.swiper-pagination', clickable: true } });
}

function authDecorPanel() {
  const points = ['Вакансии салонов Алматы с зарплатой и графиком', 'Профили мастеров с портфолио и отзывами', 'Чат и онлайн-запись клиентов в одном месте'];
  return `
  <div class="relative h-48 lg:h-full overflow-hidden hero-bg">
    <svg class="absolute inset-0 w-full h-full" aria-hidden="true"><defs><pattern id="gridp" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="white" stroke-opacity=".06"/></pattern></defs><rect width="100%" height="100%" fill="url(#gridp)"/></svg>
    <div class="relative h-full flex flex-col justify-center px-8 lg:px-14 py-8">
      <p class="text-white/60 text-sm mb-2">Платформа для бьюти-индустрии</p>
      <h1 class="text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">BeautyHire</h1>
      <ul class="hidden lg:block mt-8 space-y-3 text-sm text-white/80 max-w-sm">
        ${points.map(p => `<li class="flex items-start gap-3"><span class="mt-0.5 text-white/60">${ic('check', 16)}</span><span>${p}</span></li>`).join('')}
      </ul>
    </div>
  </div>`;
}

function renderAuth(mode) {
  app.innerHTML = `
  <div style="width:100vw;margin-left:calc(-50vw + 50%);margin-right:calc(-50vw + 50%);" class="lg:min-h-[calc(100vh-73px)] grid lg:grid-cols-2 bg-white">
    ${authDecorPanel()}
    <div class="flex items-center justify-center py-10 px-4">
      <div class="w-full max-w-sm" style="animation: fadeIn .5s ease .1s backwards;">
        <div class="flex gap-1 bg-warm-50 rounded-lg p-1 mb-6 text-sm font-medium">
          <a href="#/signup" class="flex-1 text-center rounded-md py-2 transition ${mode === 'signup' ? 'bg-white shadow-sm text-plum' : 'text-warm-500'}">Регистрация</a>
          <a href="#/login" class="flex-1 text-center rounded-md py-2 transition ${mode === 'login' ? 'bg-white shadow-sm text-plum' : 'text-warm-500'}">Вход</a>
        </div>
        <h2 class="text-xl font-serif font-bold mb-5">${mode === 'login' ? 'С возвращением' : 'Создайте аккаунт'}</h2>
        <form id="authForm" class="space-y-3">
          ${mode === 'signup' ? `
          <div class="flex gap-2 mb-2">
            <label class="flex-1 border border-warm-200 rounded-xl p-3 text-sm text-center cursor-pointer flex items-center justify-center gap-2 has-[:checked]:border-plum has-[:checked]:bg-plum-50 has-[:checked]:text-plum transition">
              <input type="radio" name="role" value="master" class="hidden" checked>${ic('scissors', 16)} Я мастер
            </label>
            <label class="flex-1 border border-warm-200 rounded-xl p-3 text-sm text-center cursor-pointer flex items-center justify-center gap-2 has-[:checked]:border-plum has-[:checked]:bg-plum-50 has-[:checked]:text-plum transition">
              <input type="radio" name="role" value="salon" class="hidden">${ic('store', 16)} Я салон
            </label>
          </div>` : ''}
          <input required name="email" type="email" placeholder="Email" class="input">
          <input required name="password" type="password" minlength="6" placeholder="Пароль" class="input">
          <button class="btn-primary w-full">${mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
        </form>
      </div>
    </div>
  </div>`;
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (mode === 'login') await signIn(fd.get('email'), fd.get('password'));
    else await signUp(fd.get('email'), fd.get('password'), fd.get('role'));
  });
}

function renderOnboarding(role) {
  const isMaster = role === 'master';
  app.innerHTML = `
  <div class="max-w-xl mx-auto py-10">
    <h1 class="text-2xl font-serif font-bold mb-1">${isMaster ? 'Профиль мастера' : 'Профиль салона'}</h1>
    <p class="text-warm-500 mb-6">Заполните карточку — её увидят ${isMaster ? 'салоны' : 'мастера'}.</p>
    <form id="onboardForm" class="space-y-3">
      ${isMaster ? `
        <input required name="full_name" placeholder="Имя и фамилия" class="input">
        <select required name="specialty" class="input"><option value="">Специализация</option>${SPECIALTIES.map(s => `<option>${s}</option>`).join('')}</select>
        <div class="grid grid-cols-2 gap-3">
          <input name="experience_years" type="number" placeholder="Опыт, лет" class="input">
          <input name="desired_salary" type="number" placeholder="Желаемая ЗП, ₸" class="input">
        </div>
        <select name="district" class="input"><option value="">Район</option>${DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select>
        <select name="schedule" class="input"><option value="">График</option>${SCHEDULES.map(s => `<option>${s}</option>`).join('')}</select>
        <select name="format" class="input"><option value="">Формат работы</option>${FORMATS.map(f => `<option>${f}</option>`).join('')}</select>
        <input name="skills" placeholder="Услуги через запятую (например: Маникюр, Наращивание)" class="input">
        <textarea name="bio" placeholder="О себе" rows="3" class="input"></textarea>
        <div>
          <label class="text-sm text-warm-500">Фото портфолио (можно несколько)</label>
          <input name="photos" type="file" multiple accept="image/*" class="input mt-1">
        </div>
      ` : `
        <input required name="salon_name" placeholder="Название салона" class="input">
        <input name="address" placeholder="Адрес" class="input">
        <select name="district" class="input"><option value="">Район</option>${DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select>
        <textarea name="description" placeholder="О салоне" rows="3" class="input"></textarea>
      `}
      <button class="btn-primary w-full">Сохранить и продолжить</button>
    </form>
  </div>`;
  document.getElementById('onboardForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (isMaster) {
        const payload = {
          full_name: fd.get('full_name'), specialty: fd.get('specialty'),
          experience_years: Number(fd.get('experience_years')) || 0,
          desired_salary: Number(fd.get('desired_salary')) || 0,
          district: fd.get('district'), schedule: fd.get('schedule'), format: fd.get('format'),
          skills: (fd.get('skills') || '').split(',').map(s => s.trim()).filter(Boolean),
          bio: fd.get('bio'), is_open: true,
        };
        const saved = await Data.createMasterProfile(payload);
        const files = fd.getAll('photos').filter(f => f.size > 0);
        saved.photos = saved.photos && saved.photos.length ? saved.photos : makePhotos(payload.specialty);
        for (const file of files) {
          const url = await Data.uploadPhoto(file, 'portfolio');
          saved.photos.unshift(url);
          if (!DEMO_MODE) await sb.from('portfolio_photos').insert({ master_id: state.user.id, url });
        }
        saved.avatar = saved.avatar || masterAvatar(saved.full_name || 'Мастер');
        state.masterProfile = saved;
      } else {
        const payload = { salon_name: fd.get('salon_name'), address: fd.get('address'), district: fd.get('district'), description: fd.get('description') };
        state.salonProfile = await Data.createSalonProfile(payload);
      }
      showToast('Профиль сохранён!');
      goto('#/');
    } catch (err) { showToast(err.message, 'error'); }
  });
}

async function renderVacancyForm(existingId) {
  if (!state.user) { showToast('Сначала войдите или зарегистрируйтесь как салон.'); return goto('#/signup'); }
  if (state.profile?.role !== 'salon') { showToast('Разместить вакансию может только аккаунт салона.', 'error'); return goto('#/'); }
  if (!state.salonProfile) { showToast('Сначала заполните профиль салона.'); return goto('#/onboarding/salon'); }

  const editing = !!existingId;
  const existing = editing ? await Data.getVacancy(existingId) : null;
  if (editing && !existing) { app.innerHTML = emptyState('Вакансия не найдена.'); return; }

  const v = existing || {};
  app.innerHTML = `
  <div class="max-w-xl mx-auto py-10">
    <h1 class="text-2xl font-serif font-bold mb-1">${editing ? 'Редактировать вакансию' : 'Новая вакансия'}</h1>
    <p class="text-warm-500 mb-6">Заполните условия — вакансию увидят мастера в поиске.</p>
    <form id="vacancyForm" class="space-y-3">
      <select required name="specialty" class="input"><option value="">Специализация</option>${SPECIALTIES.map(s => `<option ${v.specialty === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select name="district" class="input"><option value="">Район</option>${DISTRICTS.map(d => `<option ${v.district === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <div class="grid grid-cols-2 gap-3">
        <input required name="salary_from" type="number" placeholder="ЗП от, ₸" value="${v.salary_from || ''}" class="input">
        <input required name="salary_to" type="number" placeholder="ЗП до, ₸" value="${v.salary_to || ''}" class="input">
      </div>
      <input name="experience_required" placeholder="Требуемый опыт (например: от 1 года)" value="${escapeHtml(v.experience_required || '')}" class="input">
      <select name="schedule" class="input"><option value="">График</option>${SCHEDULES.map(s => `<option ${v.schedule === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select name="format" class="input"><option value="">Формат работы</option>${FORMATS.map(f => `<option ${v.format === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
      <input name="tags" placeholder="Услуги через запятую (например: Маникюр, Наращивание)" value="${(v.tags || []).join(', ')}" class="input">
      <textarea name="description" placeholder="Описание вакансии" rows="3" class="input">${escapeHtml(v.description || '')}</textarea>
      <textarea name="requirements" placeholder="Требования к мастеру" rows="2" class="input">${escapeHtml(v.requirements || '')}</textarea>
      <textarea name="bonuses" placeholder="Условия и бонусы" rows="2" class="input">${escapeHtml(v.bonuses || '')}</textarea>
      <div class="flex gap-2">
        <button class="btn-primary flex-1">${editing ? 'Сохранить изменения' : 'Опубликовать вакансию'}</button>
        ${editing ? `<button type="button" data-action="delete-vacancy" data-id="${existingId}" class="btn-secondary !border-red-300 !text-red-500">Удалить</button>` : ''}
      </div>
    </form>
  </div>`;

  document.getElementById('vacancyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      specialty: fd.get('specialty'), district: fd.get('district'),
      salary_from: Number(fd.get('salary_from')) || 0, salary_to: Number(fd.get('salary_to')) || 0,
      experience_required: fd.get('experience_required'), schedule: fd.get('schedule'), format: fd.get('format'),
      tags: (fd.get('tags') || '').split(',').map(s => s.trim()).filter(Boolean),
      description: fd.get('description'), requirements: fd.get('requirements'), bonuses: fd.get('bonuses'),
    };
    try {
      if (editing) { await Data.updateVacancy(existingId, payload); showToast('Вакансия обновлена!'); goto(`#/vacancy/${existingId}`); }
      else { const created = await Data.createVacancy(payload); showToast('Вакансия опубликована!'); goto(`#/vacancy/${created.id}`); }
    } catch (err) { showToast(err.message, 'error'); }
  });
}

async function getSalonDisplay(key) {
  if (key === 'me') return { name: state.salonProfile?.salon_name || 'Мой салон', logo: state.salonProfile?.logo_url || salonLogo(state.salonProfile?.salon_name || 'Салон'), district: state.salonProfile?.district, address: state.salonProfile?.address, rating: state.salonProfile?.rating || 0, reviews_count: state.salonProfile?.reviews_count || 0 };
  if (key.startsWith('seed:')) {
    const v = DEMO.vacancies.find(vv => 'seed:' + slug(vv.salon_name) === key);
    return v ? { name: v.salon_name, logo: v.logo, district: v.district, address: '', rating: v.rating, reviews_count: v.reviews_count, specialty: v.specialty } : null;
  }
  if (!DEMO_MODE) {
    const { data } = await sb.from('salon_profiles').select('*').eq('id', key).maybeSingle();
    return data ? { name: data.salon_name, logo: data.logo_url || salonLogo(data.salon_name), district: data.district, address: data.address, rating: data.rating, reviews_count: data.reviews_count } : null;
  }
  return null;
}

async function renderSalonPublicPage(key) {
  app.innerHTML = `<p class="py-20 text-center text-warm-500">Загрузка…</p>`;
  const salon = await getSalonDisplay(key);
  if (!salon) { app.innerHTML = emptyState('Салон не найден.', 'store'); return; }
  const services = await Data.getSalonServices(key, salon.specialty);
  app.innerHTML = `
  <div class="max-w-2xl mx-auto py-8">
    <div class="card p-6">
      <div class="flex gap-4 items-center">
        <img src="${salon.logo || salonLogo(salon.name)}" class="w-16 h-16 rounded-full border border-warm-100 bg-white">
        <div>
          <h1 class="text-2xl font-serif font-bold">${escapeHtml(salon.name)}</h1>
          <p class="text-warm-500 text-sm">${escapeHtml(salon.district || '')}${salon.address ? ' • ' + escapeHtml(salon.address) : ''}</p>
          ${salon.rating ? `<p class="text-gold text-sm">${stars(salon.rating)} <span class="text-warm-500">(${salon.reviews_count || 0})</span></p>` : ''}
        </div>
      </div>
      <h3 class="font-bold mt-6 mb-3">Услуги и запись</h3>
      <div class="space-y-2" id="serviceList">
        ${services.length ? services.map(s => `
          <div class="flex items-center justify-between border border-warm-100 rounded-xl p-3 flex-wrap gap-2">
            <div><p class="font-medium">${escapeHtml(s.name)}</p><p class="text-xs text-warm-500">${s.duration_minutes} мин</p></div>
            <div class="flex items-center gap-3">
              <span class="text-plum font-bold text-sm">${money(s.price)}</span>
              <button data-action="start-booking" data-salon="${key}" data-service='${JSON.stringify(s).replace(/'/g, '&#39;')}' class="btn-primary text-sm !px-4 !py-2">Записаться</button>
            </div>
          </div>`).join('') : emptyState('Салон пока не добавил услуги для записи.', 'calendar')}
      </div>
    </div>
    <div id="bookingWidget" class="mt-6"></div>
  </div>`;
}

async function renderBookingWidget(salonKey, service) {
  const box = document.getElementById('bookingWidget');
  if (!box) return;
  const salon = await getSalonDisplay(salonKey);
  const days = Array.from({ length: 14 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  state._booking = { salonKey, service, date: null, time: null, specialtyHint: salon?.specialty };
  box.innerHTML = `
  <div class="card p-6">
    <h3 class="font-bold mb-1">Запись: ${escapeHtml(service.name)}</h3>
    <p class="text-sm text-warm-500 mb-4">${money(service.price)} • ${service.duration_minutes} мин</p>
    <p class="text-xs text-warm-500 mb-2">Выберите дату</p>
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4">
      ${days.map(d => `<button data-action="pick-date" data-date="${d.toISOString().slice(0, 10)}" class="shrink-0 border border-warm-200 rounded-xl px-3 py-2 text-xs hover:border-plum transition">${d.toLocaleDateString('ru-RU', { weekday: 'short' })}<br><b>${d.getDate()}</b></button>`).join('')}
    </div>
    <div id="timeRow" class="mb-4"></div>
    <form id="bookingForm" class="space-y-2 hidden">
      <input required name="client_name" placeholder="Ваше имя" class="input">
      <input required name="client_phone" placeholder="Телефон" class="input">
      <input name="client_email" type="email" placeholder="Email (для уведомления о подтверждении)" class="input">
      <div class="bg-gold-50 text-warm-700 text-xs rounded-xl p-3">
        ${ic('card', 16)} Депозит ${service.price >= 10000 ? '1 500' : '1 000'} ₸ бронирует за вами время. Приём оплаты картой подключается отдельно через Kaspi Pay — заявка создаётся без реального списания, пока это не подключено.
      </div>
      <button class="btn-primary w-full">Забронировать</button>
    </form>
  </div>`;
  document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const b = state._booking;
    try {
      const booking = await Data.createBooking({
        salon_id: b.salonKey, service_id: service.id, service_name: service.name,
        client_name: fd.get('client_name'), client_phone: fd.get('client_phone'), client_email: fd.get('client_email'),
        booking_date: b.date, booking_time: b.time, price: service.price,
      });
      notifyByEmail({ to_email: fd.get('client_email'), subject: 'Заявка на запись создана', message: `Вы записаны в ${salon?.name || 'салон'} на ${b.date} в ${b.time}. Депозит: ${booking.deposit_amount} ₸.` });
      document.getElementById('bookingWidget').innerHTML = `<div class="card p-6 text-center">
        <div class="mb-2 text-sage">${ic('check', 36)}</div>
        <p class="font-bold">Заявка принята</p>
        <p class="text-sm text-warm-500 mt-1">${escapeHtml(b.date)} в ${b.time} • депозит ${money(booking.deposit_amount)}</p>
        <p class="text-xs text-warm-500 mt-2">Салон подтвердит запись.</p>
      </div>`;
      showToast('Заявка на запись отправлена!');
    } catch (err) { showToast(err.message, 'error'); }
  });
}

async function renderServicesSettings() {
  if (!state.user || state.profile?.role !== 'salon') { showToast('Доступно только салонам.', 'error'); return goto('#/'); }
  const key = mySalonKey();
  const services = await Data.getSalonServices(key);
  const availability = await Data.getSalonAvailability(key);
  const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  app.innerHTML = `
  <div class="max-w-xl mx-auto py-10">
    <h1 class="text-2xl font-serif font-bold mb-1">Услуги и расписание</h1>
    <p class="text-warm-500 mb-6">Это увидят клиенты на публичной странице записи.</p>
    <div class="card p-5 mb-6">
      <h3 class="font-bold mb-3">Услуги</h3>
      <div id="serviceRows" class="space-y-2 mb-3">
        ${services.map(s => `
        <div class="flex gap-2 items-center" data-service-row>
          <input class="input" data-f="name" placeholder="Название" value="${escapeHtml(s.name)}">
          <input class="input w-24" data-f="price" type="number" placeholder="₸" value="${s.price}">
          <input class="input w-20" data-f="duration_minutes" type="number" placeholder="мин" value="${s.duration_minutes}">
          <button type="button" data-action="remove-service-row" class="text-red-500 px-2 shrink-0">${ic('x', 18)}</button>
        </div>`).join('')}
      </div>
      <button type="button" data-action="add-service-row" class="text-sm text-plum hover:underline">+ Добавить услугу</button>
    </div>
    <div class="card p-5 mb-6">
      <h3 class="font-bold mb-3">Часы работы</h3>
      <div class="space-y-2">
        ${[1, 2, 3, 4, 5, 6, 0].map(wd => {
          const a = availability.find(x => x.weekday === wd) || { open_time: '10:00', close_time: '20:00', is_closed: wd === 0 };
          return `<div class="flex items-center gap-2 text-sm flex-wrap" data-avail-row data-weekday="${wd}">
            <span class="w-8 font-medium">${DAYS[wd]}</span>
            <label class="flex items-center gap-1 text-xs text-warm-500"><input type="checkbox" data-f="is_closed" ${a.is_closed ? 'checked' : ''} class="rounded text-plum" data-avail-closed-toggle> выходной</label>
            <input class="input !py-1.5 !w-24" data-f="open_time" type="time" value="${a.open_time || '10:00'}" ${a.is_closed ? 'disabled' : ''}>
            <span>–</span>
            <input class="input !py-1.5 !w-24" data-f="close_time" type="time" value="${a.close_time || '20:00'}" ${a.is_closed ? 'disabled' : ''}>
          </div>`;
        }).join('')}
      </div>
    </div>
    <button data-action="save-services" class="btn-primary w-full">Сохранить</button>
  </div>`;
}

async function renderMyBookings() {
  if (!state.user || state.profile?.role !== 'salon') { showToast('Доступно только салонам.', 'error'); return goto('#/'); }
  app.innerHTML = `<h1 class="text-2xl font-serif font-bold py-6">Мои записи</h1><div id="bookingsList">Загрузка…</div>`;
  const bookings = await Data.listSalonBookings(mySalonKey());
  const box = document.getElementById('bookingsList');
  box.innerHTML = bookings.length ? bookings.map(b => `
    <div class="card p-4 mb-3 flex justify-between items-center flex-wrap gap-2">
      <div>
        <p class="font-bold">${escapeHtml(b.client_name)} • ${escapeHtml(b.service_name || '')}</p>
        <p class="text-sm text-warm-500">${escapeHtml(b.booking_date)} в ${escapeHtml(b.booking_time)} • ${escapeHtml(b.client_phone)}</p>
        <p class="text-xs text-warm-500">Депозит: ${money(b.deposit_amount)} • оплата картой не подключена</p>
      </div>
      <div class="flex gap-2">
        ${b.status === 'pending' ? `
          <button data-action="booking-status" data-id="${b.id}" data-status="confirmed" class="btn-primary !px-3 !py-1.5 text-sm">Подтвердить</button>
          <button data-action="booking-status" data-id="${b.id}" data-status="cancelled" class="btn-secondary !px-3 !py-1.5 text-sm !border-red-300 !text-red-500">Отклонить</button>
        ` : `<span class="tag ${tagClass(b.status)}">${b.status === 'confirmed' ? 'Подтверждено' : b.status === 'cancelled' ? 'Отменено' : 'Завершено'}</span>`}
      </div>
    </div>`).join('') : emptyState('Пока нет записей клиентов.', 'calendar', 'Настроить услуги', '#/services');
}

function renderPricing() {
  app.innerHTML = `
  <div class="py-14 max-w-4xl mx-auto text-center">
    <h1 class="text-3xl font-serif font-bold">Тарифы для салонов</h1>
    <p class="text-warm-500 mt-2 mb-10">Для мастеров регистрация и базовый профиль всегда бесплатны.</p>
    <div class="grid md:grid-cols-2 gap-6 text-left">
      <div class="card p-6">
        <h3 class="font-bold text-lg">Бесплатно</h3>
        <p class="text-3xl font-extrabold my-3">0 ₸</p>
        <ul class="text-sm text-warm-600 space-y-2 mb-6">
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>1 активная вакансия</span></li>
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>Базовый поиск мастеров</span></li>
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>Отклики и сообщения</span></li>
        </ul>
      </div>
      <div class="card p-6 border-2 border-plum relative">
        <span class="absolute -top-3 left-6 tag bg-plum text-white">Популярный</span>
        <h3 class="font-bold text-lg">Premium</h3>
        <p class="text-3xl font-extrabold my-3">9 990 ₸<span class="text-sm font-normal text-warm-500">/мес</span></p>
        <ul class="text-sm text-warm-600 space-y-2 mb-6">
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>Неограниченные вакансии</span></li>
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>Продвижение в поиске</span></li>
          <li class="flex items-start gap-2"><span class="text-sage mt-0.5">${ic('check', 16)}</span><span>Расширенные фильтры и статистика</span></li>
        </ul>
        <button data-action="go" data-href="#/vacancy/new" class="btn-primary w-full">Оформить</button>
        <p class="text-xs text-warm-500 mt-2">Оплата подключается отдельно (Kaspi/Freedom Pay) — см. INSTRUCTIONS.md</p>
      </div>
    </div>
  </div>`;
}

function renderMyProfile() {
  if (!state.user) { goto('#/signup'); return; }
  const isMaster = state.profile?.role === 'master';
  const p = isMaster ? state.masterProfile : state.salonProfile;
  const avatarUrl = p ? (isMaster ? (p.avatar_url || p.avatar || masterAvatar(p.full_name)) : (p.logo_url || salonLogo(p.salon_name))) : null;

  const navButtons = [
    { href: '#/applications', icon: ic('clipboard', 20), label: isMaster ? 'Мои отклики' : 'Мои вакансии' },
    { href: '#/favorites', icon: ic('heart', 20), label: 'Избранное' },
    { href: '#/chats', icon: ic('message', 20), label: 'Чаты' },
    ...(!isMaster ? [
      { href: '#/services', icon: ic('sliders', 20), label: 'Услуги и расписание' },
      { href: '#/bookings', icon: ic('calendar', 20), label: 'Записи клиентов' },
    ] : []),
  ];

  app.innerHTML = `
  <div class="max-w-xl mx-auto py-8">
    <div class="card overflow-hidden mb-6">
      <div class="h-20 bg-plum relative"></div>
      <div class="px-6 pb-6 -mt-10">
        ${p ? `
        <img src="${avatarUrl}" class="w-20 h-20 rounded-full object-cover border-4 border-white bg-white shadow-card">
        <h2 class="font-serif font-bold text-xl mt-3">${escapeHtml(isMaster ? p.full_name : p.salon_name)}</h2>
        <p class="text-warm-500 text-sm">${escapeHtml(isMaster ? p.specialty : (p.address || 'Адрес не указан'))}</p>
        ${isMaster ? `<p class="text-gold text-sm mt-1">${stars(p.rating || 0)} <span class="text-warm-500">(${p.reviews_count || 0} отзывов)</span></p>` : ''}
        ` : `
        <div class="w-20 h-20 rounded-full border-4 border-white bg-warm-100 shadow-card flex items-center justify-center text-warm-400">${ic('user', 32)}</div>
        <p class="text-warm-500 mt-3">Профиль ещё не заполнен — заполните карточку, чтобы вас видели ${isMaster ? 'салоны' : 'мастера'}.</p>
        <button data-action="go" data-href="#/onboarding/${state.profile?.role}" class="btn-primary text-sm mt-3">Заполнить профиль</button>
        `}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      ${navButtons.map(b => `
        <button data-action="go" data-href="${b.href}" class="card p-4 flex items-center gap-3 text-left hover:shadow-cardHover  transition">
          <span class="w-10 h-10 rounded-lg bg-plum-50 text-plum flex items-center justify-center shrink-0">${b.icon}</span>
          <span class="text-sm font-medium">${b.label}</span>
        </button>`).join('')}
    </div>

    ${!isMaster ? `
    <div class="card p-5 mt-6 border-2 border-dashed border-gold-50 bg-gold-50/40">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-plum shrink-0">${ic('trending', 20)}</span>
        <div class="flex-1">
          <p class="font-bold text-sm">Продвижение и реклама</p>
          <p class="text-xs text-warm-500 mt-0.5">Поднимайте вакансии в топ поиска и размещайте баннер салона на главной. Подключается вместе с Premium-тарифом.</p>
        </div>
        <button data-action="go" data-href="#/pricing" class="btn-secondary !px-3 !py-1.5 text-xs shrink-0">Подробнее</button>
      </div>
    </div>` : ''}
  </div>`;
}

async function renderApplications() {
  if (!state.user) { goto('#/signup'); return; }
  const isMaster = state.profile?.role === 'master';
  app.innerHTML = `<h1 class="text-2xl font-serif font-bold py-6">${isMaster ? 'Мои отклики' : 'Отклики на мои вакансии'}</h1><div id="appList">Загрузка…</div>`;
  const box = document.getElementById('appList');
  if (isMaster) {
    const apps = await Data.listMyApplications();
    box.innerHTML = apps.length ? apps.map(a => {
      const v = a.vacancies || DEMO.vacancies.find(vv => vv.id === a.vacancy_id);
      return `<div class="card p-4 mb-3 flex justify-between items-center flex-wrap gap-2">
        <div><p class="font-medium">${escapeHtml(v?.specialty || '')}</p><p class="text-sm text-warm-500">${escapeHtml(v?.salon_name || v?.salon_profiles?.salon_name || '')}</p></div>
        <div class="flex items-center gap-2">
          <span class="tag ${a.status === 'accepted' ? 'bg-sage-50 text-sage' : ''}">${a.status === 'pending' ? 'На рассмотрении' : a.status === 'accepted' ? 'Принято' : 'Отклонено'}</span>
          <button data-action="withdraw-application" data-id="${a.id}" class="text-sm text-red-500 hover:underline">Отозвать</button>
        </div>
      </div>`;
    }).join('') : emptyState('Пока нет откликов — самое время найти вакансию.', 'inbox', 'Смотреть вакансии', '#/vacancies');
  } else {
    const myVacancies = await Data.listMyVacancies();
    const addBtn = `<a href="#/vacancy/new" class="btn-primary inline-block mb-4">+ Новая вакансия</a>`;
    if (!myVacancies.length) { box.innerHTML = addBtn + emptyState('Вы ещё не разместили ни одной вакансии.'); return; }
    let html = addBtn;
    for (const v of myVacancies) {
      const apps = await Data.listApplicationsForVacancy(v.id);
      html += `<div class="card p-4 mb-4">
        <div class="flex justify-between items-start gap-2">
          <div><p class="font-bold">${escapeHtml(v.specialty)}</p><p class="text-sm text-warm-500">${apps.length} откликов • ${escapeHtml(v.district || '')}</p></div>
          <div class="flex gap-2 shrink-0">
            <a href="#/vacancy/${v.id}/edit" class="text-sm text-plum hover:underline">Изменить</a>
            <button data-action="delete-vacancy" data-id="${v.id}" class="text-sm text-red-500 hover:underline">Удалить</button>
          </div>
        </div>
        ${apps.length ? apps.map(a => `
          <div class="flex justify-between items-center border-t border-warm-100 py-2 text-sm mt-2">
            <span>${escapeHtml(a.master_profiles?.full_name || 'Мастер')}</span>
            <span class="tag">${a.status === 'pending' ? 'Новый' : a.status}</span>
          </div>`).join('') : '<p class="text-warm-500 text-sm mt-2">Пока нет откликов.</p>'}
      </div>`;
    }
    box.innerHTML = html;
  }
}

async function renderFavorites() {
  app.innerHTML = `<h1 class="text-2xl font-serif font-bold py-6">Избранное</h1><div id="favList" class="grid sm:grid-cols-2 gap-4">Загрузка…</div>`;
  const box = document.getElementById('favList');
  if (!state.favorites.size) { box.innerHTML = emptyState('Здесь появятся сохранённые вакансии и мастера — нажмите на сердечко на карточке.', 'heart'); return; }
  const cards = [];
  for (const key of state.favorites) {
    const [type, id] = key.split(':');
    if (type === 'master') { const m = await Data.getMaster(id); if (m) cards.push(fixYears(masterCard(m), m.experience_years || 0)); }
    else { const v = await Data.getVacancy(id); if (v) cards.push(vacancyCard(v)); }
  }
  box.innerHTML = cards.join('') || emptyState('Ничего не найдено.');
}

async function listMyConversations() {
  const isMaster = state.profile?.role === 'master';
  if (DEMO_MODE) {
    const apps = isMaster
      ? DEMO.applications.filter(a => a.master_id === (state.masterProfile?.id || 'me'))
      : DEMO.applications.filter(a => DEMO.vacancies.find(v => v.id === a.vacancy_id && v.salon_id === 'me'));
    return apps.map(a => {
      const v = DEMO.vacancies.find(vv => vv.id === a.vacancy_id);
      const msgs = DEMO.messages.filter(m => m.application_id === a.id);
      return { id: a.id, counterpart: isMaster ? (v?.salon_name || 'Салон') : (state.masterProfile?.full_name || 'Мастер'), specialty: v?.specialty, lastMessage: msgs[msgs.length - 1]?.text || '' };
    });
  }
  if (isMaster) {
    const { data } = await sb.from('applications').select('id, vacancies(specialty, salon_profiles(salon_name))').eq('master_id', state.user.id);
    return (data || []).map(a => ({ id: a.id, counterpart: a.vacancies?.salon_profiles?.salon_name || 'Салон', specialty: a.vacancies?.specialty, lastMessage: '' }));
  }
  const { data } = await sb.from('applications').select('id, vacancies!inner(specialty, salon_id), master_profiles(full_name)').eq('vacancies.salon_id', state.user.id);
  return (data || []).map(a => ({ id: a.id, counterpart: a.master_profiles?.full_name || 'Мастер', specialty: a.vacancies?.specialty, lastMessage: '' }));
}

async function renderChats() {
  if (!state.user) { app.innerHTML = emptyState('Войдите, чтобы видеть переписку.', 'message', 'Войти', '#/login'); return; }
  app.innerHTML = `<h1 class="text-2xl font-serif font-bold py-6">Чаты</h1><div id="chatsList">Загрузка…</div>`;
  const list = await listMyConversations();
  document.getElementById('chatsList').innerHTML = list.length ? list.map(c => `
    <button data-action="open-chat" data-id="${c.id}" class="card p-4 mb-3 w-full text-left flex justify-between items-center hover:shadow-cardHover transition">
      <div><p class="font-bold">${escapeHtml(c.counterpart)}</p><p class="text-sm text-warm-500 truncate max-w-xs">${escapeHtml(c.lastMessage || c.specialty || 'Открыть переписку')}</p></div>
      <span class="text-plum">${ic('chevron', 18)}</span>
    </button>`).join('') : emptyState('Чат откроется после отклика на вакансию или приглашения мастера.', 'message');
}

let currentChatChannel = null;
async function renderChatThread(appId) {
  app.innerHTML = `
  <div class="max-w-xl mx-auto py-6">
    <button data-action="go" data-href="#/chats" class="inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 hover:text-plum">${ic('back', 16)} Все чаты</button>
    <div class="card p-4 mt-3 h-[65vh] flex flex-col">
      <div id="chatMessages" class="flex-1 overflow-y-auto space-y-2 mb-3 px-1"></div>
      <form id="chatForm" class="flex gap-2">
        <input name="text" required placeholder="Сообщение…" class="input flex-1" autocomplete="off">
        <button class="btn-primary !px-4" aria-label="Отправить">${ic('send', 18)}</button>
      </form>
    </div>
  </div>`;

  async function loadMessages() {
    const msgs = await Data.listMessages(appId);
    const myId = DEMO_MODE ? (state.profile?.role === 'master' ? (state.masterProfile?.id || 'me') : 'me') : state.user.id;
    const box = document.getElementById('chatMessages');
    if (!box) return;
    box.innerHTML = msgs.length ? msgs.map(m => `
      <div class="max-w-[75%] ${m.sender_id === myId ? 'ml-auto bg-plum text-white' : 'bg-warm-100 text-ink'} rounded-2xl px-3 py-2 text-sm break-words">${escapeHtml(m.text)}</div>
    `).join('') : `<p class="text-warm-500 text-sm text-center mt-10">Начните переписку — напишите первое сообщение.</p>`;
    box.scrollTop = box.scrollHeight;
  }
  await loadMessages();

  document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const text = (fd.get('text') || '').toString().trim();
    if (!text) return;
    e.target.reset();
    try { await Data.sendMessage(appId, text); if (DEMO_MODE) await loadMessages(); }
    catch (err) { showToast(err.message, 'error'); }
  });

  if (currentChatChannel) { sb?.removeChannel(currentChatChannel); currentChatChannel = null; }
  if (!DEMO_MODE) {
    currentChatChannel = sb.channel('chat-' + appId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `application_id=eq.${appId}` }, () => loadMessages())
      .subscribe();
  }
}

// ---------------------------------------------------------------------------
// 9. ДЕЛЕГИРОВАНИЕ СОБЫТИЙ
// ---------------------------------------------------------------------------
document.addEventListener('click', async (e) => {
  if (e.target.closest('[data-modal-overlay]') && !e.target.closest('[data-modal-panel]')) closeModal();
  if (e.target.closest('[data-modal-close]')) closeModal();

  const t = e.target.closest('[data-action]');
  if (!t) return;
  const action = t.dataset.action;

  if (action === 'go') { e.preventDefault(); goto(t.dataset.href); }
  if (action === 'open-menu') { e.preventDefault(); openMobileMenu(); }
  if (action === 'open-filter-drawer') { e.preventDefault(); openFilterDrawer(); }
  if (action === 'signout') signOut();
  if (action === 'reset-filters') { state.filters = { specialty: '', district: '', salaryRange: '', formats: [], experienced: false, text: '', sort: '' }; render(); }

  if (action === 'apply') {
    e.stopPropagation();
    if (!state.user) return goto('#/signup');
    if (state.profile?.role === 'salon') return showToast('Откликаться на вакансии могут только мастера.', 'error');
    try {
      await Data.applyToVacancy(t.dataset.id);
      showToast('Отклик отправлен!');
      renderHeaderAuth();
      if (!DEMO_MODE) {
        const v = await Data.getVacancy(t.dataset.id);
        const { data: salonProfileRow } = await sb.from('profiles').select('email').eq('id', v?.salon_id).maybeSingle();
        notifyByEmail({ to_email: salonProfileRow?.email, subject: 'Новый отклик на вашу вакансию', message: `Мастер ${state.masterProfile?.full_name || ''} откликнулся на вакансию «${v?.specialty}».` });
      }
    } catch (err) { showToast(err.message, 'error'); }
  }

  if (action === 'invite') {
    e.stopPropagation();
    if (!state.user) return goto('#/signup');
    if (state.profile?.role === 'master') return showToast('Приглашать мастеров могут только салоны.', 'error');
    showToast('Приглашение отправлено мастеру!');
    if (!DEMO_MODE) {
      const { data: masterProfileRow } = await sb.from('profiles').select('email').eq('id', t.dataset.id).maybeSingle();
      notifyByEmail({ to_email: masterProfileRow?.email, subject: 'Вас пригласил салон', message: `Салон «${state.salonProfile?.salon_name || ''}» приглашает вас на вакансию.` });
    }
  }

  if (action === 'delete-vacancy') {
    e.stopPropagation();
    if (!confirm('Удалить эту вакансию? Действие необратимо.')) return;
    try { await Data.deleteVacancy(t.dataset.id); showToast('Вакансия удалена.'); goto('#/applications'); render(); }
    catch (err) { showToast(err.message, 'error'); }
  }

  if (action === 'open-chat') { e.stopPropagation(); goto('#/chats/' + t.dataset.id); }

  if (action === 'withdraw-application') {
    e.stopPropagation();
    if (!confirm('Отозвать отклик?')) return;
    try { await Data.withdrawApplication(t.dataset.id); showToast('Отклик отозван.'); renderApplications(); renderHeaderAuth(); }
    catch (err) { showToast(err.message, 'error'); }
  }

  if (action === 'remove-chip') {
    e.stopPropagation();
    const key = t.dataset.key;
    if (key.startsWith('format:')) state.filters.formats = state.filters.formats.filter(f => f !== key.slice(7));
    else if (key === 'experienced') state.filters.experienced = false;
    else state.filters[key] = '';
    renderBrowse();
  }

  if (action === 'start-booking') {
    e.stopPropagation();
    const service = JSON.parse(t.dataset.service);
    await renderBookingWidget(t.dataset.salon, service);
    document.getElementById('bookingWidget')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (action === 'pick-date') {
    e.stopPropagation();
    const b = state._booking; if (!b) return;
    b.date = t.dataset.date; b.time = null;
    document.querySelectorAll('[data-action="pick-date"]').forEach(el => el.classList.toggle('border-plum', el === t));
    const slots = await Data.getAvailableSlots(b.salonKey, b.date, b.service.duration_minutes, b.specialtyHint);
    document.getElementById('timeRow').innerHTML = slots.length
      ? `<p class="text-xs text-warm-500 mb-2">Выберите время</p><div class="flex flex-wrap gap-2">${slots.map(s => `<button type="button" data-action="pick-time" data-time="${s}" class="border border-warm-200 rounded-lg px-3 py-1.5 text-sm hover:border-plum transition">${s}</button>`).join('')}</div>`
      : `<p class="text-sm text-warm-500">На этот день свободных слотов нет — выберите другую дату.</p>`;
    document.getElementById('bookingForm')?.classList.add('hidden');
  }

  if (action === 'pick-time') {
    e.stopPropagation();
    if (!state._booking) return;
    state._booking.time = t.dataset.time;
    document.querySelectorAll('[data-action="pick-time"]').forEach(el => {
      el.classList.toggle('bg-plum', el === t);
      el.classList.toggle('text-white', el === t);
      el.classList.toggle('border-plum', el === t);
    });
    document.getElementById('bookingForm')?.classList.remove('hidden');
  }

  if (action === 'add-service-row') {
    e.preventDefault();
    document.getElementById('serviceRows').insertAdjacentHTML('beforeend', `
      <div class="flex gap-2 items-center" data-service-row>
        <input class="input" data-f="name" placeholder="Название">
        <input class="input w-24" data-f="price" type="number" placeholder="₸">
        <input class="input w-20" data-f="duration_minutes" type="number" placeholder="мин">
        <button type="button" data-action="remove-service-row" class="text-red-500 px-2 shrink-0">${ic('x', 18)}</button>
      </div>`);
  }

  if (action === 'remove-service-row') { e.preventDefault(); t.closest('[data-service-row]')?.remove(); }

  if (action === 'save-services') {
    e.preventDefault();
    const services = [...document.querySelectorAll('[data-service-row]')].map(row => ({
      id: 'svc_' + Math.random().toString(36).slice(2, 9),
      name: row.querySelector('[data-f=name]').value.trim(),
      price: Number(row.querySelector('[data-f=price]').value) || 0,
      duration_minutes: Number(row.querySelector('[data-f=duration_minutes]').value) || 60,
    })).filter(s => s.name);
    const availability = [...document.querySelectorAll('[data-avail-row]')].map(row => ({
      weekday: Number(row.dataset.weekday),
      is_closed: row.querySelector('[data-f=is_closed]').checked,
      open_time: row.querySelector('[data-f=open_time]').value,
      close_time: row.querySelector('[data-f=close_time]').value,
    }));
    try {
      await Data.saveServices(mySalonKey(), services);
      await Data.saveAvailability(mySalonKey(), availability);
      showToast('Сохранено!');
    } catch (err) { showToast(err.message, 'error'); }
  }

  if (action === 'booking-status') {
    e.stopPropagation();
    try { await Data.updateBookingStatus(t.dataset.id, t.dataset.status); showToast('Статус обновлён.'); renderMyBookings(); }
    catch (err) { showToast(err.message, 'error'); }
  }

  if (action === 'toggle-format') {
    e.preventDefault(); e.stopPropagation();
    const fo = t.dataset.format;
    const active = state.filters.formats.includes(fo);
    state.filters.formats = active ? state.filters.formats.filter(x => x !== fo) : [...state.filters.formats, fo];
    t.classList.toggle('bg-plum', !active);
    t.classList.toggle('text-white', !active);
    t.classList.toggle('border-plum', !active);
    t.classList.toggle('border-warm-200', active);
    t.classList.toggle('text-warm-600', active);
    refreshResults();
  }

  if (action === 'toggle-experienced') {
    e.preventDefault(); e.stopPropagation();
    state.filters.experienced = !state.filters.experienced;
    t.classList.toggle('bg-plum', state.filters.experienced);
    t.classList.toggle('text-white', state.filters.experienced);
    t.classList.toggle('bg-warm-50', !state.filters.experienced);
    t.classList.toggle('text-warm-600', !state.filters.experienced);
    refreshResults();
  }

  if (action === 'toggle-fav') {
    e.stopPropagation();
    const key = `${t.dataset.favType}:${t.dataset.favId}`;
    if (state.favorites.has(key)) { state.favorites.delete(key); showToast('Убрано из избранного'); }
    else { state.favorites.add(key); showToast('Добавлено в избранное'); }
    renderHeaderAuth();
    if (state.route === '/favorites') renderFavorites(); else render();
  }
});

document.addEventListener('change', (e) => {
  if (e.target.matches('[data-avail-closed-toggle]')) {
    const row = e.target.closest('[data-avail-row]');
    row.querySelectorAll('[data-f="open_time"], [data-f="close_time"]').forEach(inp => inp.disabled = e.target.checked);
    return;
  }
  if (e.target.id === 'sortSelect') { state.filters.sort = e.target.value; refreshResults(); return; }
  if (e.target.dataset.filter) {
    state.filters[e.target.dataset.filter] = e.target.value;
    refreshResults();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.dataset.filter === 'text') { state.filters.text = e.target.value; refreshResults(); }
});

document.getElementById('headerSearchForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  state.filters.text = document.getElementById('headerSearchText').value;
  state.filters.district = document.getElementById('headerSearchDistrict').value;
  goto(state.roleTab === 'master' ? '#/vacancies' : '#/masters');
  refreshResults();
});

document.querySelectorAll('[data-role-tab]').forEach(btn => {
  btn.addEventListener('click', () => { state.roleTab = btn.dataset.roleTab; goto(state.roleTab === 'master' ? '#/vacancies' : '#/masters'); });
});

document.querySelectorAll('[data-bottom-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.bottomNav;
    if (v === 'browse') goto('#/');
    if (v === 'favorites') goto('#/favorites');
    if (v === 'chats') goto('#/chats');
    if (v === 'profile') goto(state.user ? '#/profile' : '#/signup');
  });
});


// ---------------------------------------------------------------------------
// 10. ФОН: плавно дрейфующие цветы (canvas, спрайты рисуются один раз)
// ---------------------------------------------------------------------------
function initFlowers() {
  const canvas = document.getElementById('bgFlowers');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  const resize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; };
  resize();
  window.addEventListener('resize', resize);

  const S = 120; // размер спрайта
  function sprite(draw) {
    const c = document.createElement('canvas'); c.width = c.height = S * dpr;
    const g = c.getContext('2d'); g.scale(dpr, dpr); g.translate(S / 2, S / 2); draw(g); return c;
  }
  const petal = (g, len, wid, color, rot) => { g.save(); g.rotate(rot); g.fillStyle = color; g.beginPath(); g.ellipse(0, -len * 0.55, wid, len * 0.55, 0, 0, Math.PI * 2); g.fill(); g.restore(); };
  const kinds = [
    // сакура: 5 сердцевидных лепестков
    (col) => sprite(g => { for (let i = 0; i < 5; i++) { g.save(); g.rotate(i * Math.PI * 2 / 5); g.fillStyle = col; g.beginPath(); g.moveTo(0, -4); g.bezierCurveTo(-20, -22, -12, -54, 0, -46); g.bezierCurveTo(12, -54, 20, -22, 0, -4); g.fill(); g.restore(); }
      g.fillStyle = '#FFE08A'; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); g.strokeStyle = 'rgba(190,40,110,.55)'; g.lineWidth = 1.4; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(i * 0.9) * 13, Math.sin(i * 0.9) * 13); g.stroke(); } }),
    // ромашка: много тонких лепестков
    (col) => sprite(g => { for (let i = 0; i < 14; i++) petal(g, 50, 6.5, col, i * Math.PI * 2 / 14); g.fillStyle = '#F9B93C'; g.beginPath(); g.arc(0, 0, 9, 0, 7); g.fill(); }),
    // тюльпан-розетка: 6 круглых лепестков
    (col) => sprite(g => { for (let i = 0; i < 6; i++) petal(g, 44, 15, col, i * Math.PI / 3); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill(); g.fillStyle = col; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); }),
    // роза: концентрические завитки
    (col) => sprite(g => { for (let r = 44, i = 0; r > 6; r -= 8, i++) { g.fillStyle = col; g.globalAlpha = 0.55 + i * 0.09; g.beginPath(); for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) { const rr = r + Math.sin(a * 5 + i) * 4; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.fill(); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.2; g.stroke(); } g.globalAlpha = 1; }),
    // маленький бутон
    (col) => sprite(g => { for (let i = 0; i < 4; i++) petal(g, 30, 11, col, i * Math.PI / 2 + 0.4); g.fillStyle = '#FFF4C2'; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill(); }),
  ];
  const colors = ['#FFB3D1', '#FF8DB8', '#F9A8D4', '#FBCFE8', '#F472B6', '#FFC9DE', '#E9D5FF', '#FFD5C2', '#FF9EC4'];
  const sprites = [];
  kinds.forEach(k => colors.forEach(c => sprites.push(k(c))));

  const count = Math.max(14, Math.min(34, Math.round(W * H / 55000)));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const flowers = Array.from({ length: count }, () => ({
    s: sprites[Math.floor(Math.random() * sprites.length)],
    x: rnd(0, W), y: rnd(0, H), size: rnd(26, 78), vy: rnd(5, 16), amp: rnd(14, 46), freq: rnd(0.15, 0.4),
    ph: rnd(0, 7), rot: rnd(0, 7), vr: rnd(-0.18, 0.18), a: rnd(0.28, 0.62),
  }));

  let last = performance.now(), t = 0;
  function draw(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const f of flowers) {
      if (!reduce) { f.y += f.vy * dt; f.rot += f.vr * dt; if (f.y - f.size > H) { f.y = -f.size; f.x = rnd(0, W); } }
      const x = f.x + Math.sin(t * f.freq + f.ph) * f.amp;
      ctx.save(); ctx.globalAlpha = f.a; ctx.translate(x, f.y); ctx.rotate(f.rot);
      ctx.drawImage(f.s, -f.size / 2, -f.size / 2, f.size, f.size); ctx.restore();
    }
    if (!reduce && !document.hidden) requestAnimationFrame(draw);
  }
  draw(performance.now());
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) { last = performance.now(); requestAnimationFrame(draw); } });
}

// ---------------------------------------------------------------------------
// 10b. СВОИ ВЫПАДАЮЩИЕ СПИСКИ (вместо системных — стилизуются и не зависят от тёмной темы браузера)
// ---------------------------------------------------------------------------
function closeAllSelects() {
  document.querySelectorAll('.cs-list').forEach(l => { l.previousElementSibling?.setAttribute('aria-expanded', 'false'); l.remove(); });
}
function enhanceSelects() {
  document.querySelectorAll('#app select, #modalRoot select').forEach(sel => {
    if (sel.dataset.enhanced) return;
    sel.dataset.enhanced = '1';
    const wrap = document.createElement('div');
    wrap.className = 'cs-wrap';
    if (sel.classList.contains('w-auto')) wrap.style.display = 'inline-block';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add('cs-native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = sel.className.replace('cs-native', '') + ' cs-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `<span class="cs-label"></span>${ic('chevron', 16)}`;
    wrap.appendChild(btn);
    const sync = () => { const o = sel.options[sel.selectedIndex]; btn.querySelector('.cs-label').textContent = o ? o.textContent : ''; };
    sync();
    sel.addEventListener('change', sync);
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const wasOpen = btn.getAttribute('aria-expanded') === 'true';
      closeAllSelects();
      if (wasOpen) return;
      const ul = document.createElement('ul');
      ul.className = 'cs-list'; ul.setAttribute('role', 'listbox');
      [...sel.options].forEach((o, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option'); li.setAttribute('aria-selected', i === sel.selectedIndex ? 'true' : 'false');
        li.innerHTML = `<span>${escapeHtml(o.textContent)}</span>${i === sel.selectedIndex ? ic('check', 15) : ''}`;
        li.addEventListener('click', (ev) => {
          ev.stopPropagation();
          sel.selectedIndex = i;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          closeAllSelects();
        });
        ul.appendChild(li);
      });
      btn.after(ul); btn.setAttribute('aria-expanded', 'true');
      ul.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    });
  });
}
document.addEventListener('click', (e) => { if (!e.target.closest('.cs-wrap')) closeAllSelects(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeAllSelects(); if (document.querySelector('[data-modal-overlay]')) closeModal(); }
});
(function watchSelects() {
  let queued = false;
  const run = () => { queued = false; enhanceSelects(); };
  const mo = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(run); } });
  ['app', 'modalRoot'].forEach(id => { const el = document.getElementById(id); if (el) mo.observe(el, { childList: true, subtree: true }); });
  enhanceSelects();
})();

// ---------------------------------------------------------------------------
// 11. ИНИЦИАЛИЗАЦИЯ
// ---------------------------------------------------------------------------
async function init() {
  initFlowers();
  if (!DEMO_MODE) {
    const { data: { session } } = await sb.auth.getSession();
    if (session) { state.user = session.user; await loadMyProfile(); }
    sb.auth.onAuthStateChange((_event, session) => { state.user = session?.user || null; });
  }
  parseRoute();
  render();
}
init();
