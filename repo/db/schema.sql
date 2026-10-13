-- ============================================================
-- BeautyHire — схема базы данных для Supabase (Postgres)
-- Как использовать: Supabase Dashboard -> SQL Editor -> New query
-- -> вставить весь файл -> Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. ПРОФИЛИ (общая таблица поверх auth.users)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('master','salon')),
  email text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. ПРОФИЛЬ МАСТЕРА
-- ------------------------------------------------------------
create table public.master_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  full_name text not null,
  specialty text not null,
  experience_years int default 0,
  skills text[] default '{}',
  bio text,
  desired_salary int,
  district text,
  schedule text,       -- 'Полный день' | 'Частичная занятость' | 'Аренда места'
  format text,         -- 'Оклад' | 'Процент' | 'Аренда'
  avatar_url text,
  is_open boolean default true,   -- в поиске работы прямо сейчас
  rating numeric default 0,
  reviews_count int default 0,
  created_at timestamptz default now()
);

create table public.portfolio_photos (
  id uuid primary key default uuid_generate_v4(),
  master_id uuid references public.master_profiles(id) on delete cascade,
  url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. ПРОФИЛЬ САЛОНА
-- ------------------------------------------------------------
create table public.salon_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  salon_name text not null,
  address text,
  district text,
  description text,
  logo_url text,
  rating numeric default 0,
  reviews_count int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4. ВАКАНСИИ
-- ------------------------------------------------------------
create table public.vacancies (
  id uuid primary key default uuid_generate_v4(),
  salon_id uuid references public.salon_profiles(id) on delete cascade,
  specialty text not null,
  district text,
  salary_from int,
  salary_to int,
  experience_required text,
  schedule text,
  format text,
  description text,
  requirements text,
  bonuses text,
  is_premium boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. ОТКЛИКИ
-- ------------------------------------------------------------
create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  vacancy_id uuid references public.vacancies(id) on delete cascade,
  master_id uuid references public.master_profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz default now(),
  unique(vacancy_id, master_id)
);

-- ------------------------------------------------------------
-- 6. СООБЩЕНИЯ (чат привязан к отклику)
-- ------------------------------------------------------------
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 7. ОТЗЫВЫ
-- ------------------------------------------------------------
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  target_id uuid not null,          -- id мастера или салона
  target_type text not null check (target_type in ('master','salon')),
  author_id uuid references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  text text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.master_profiles enable row level security;
alter table public.salon_profiles enable row level security;
alter table public.portfolio_photos enable row level security;
alter table public.vacancies enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;

-- profiles
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- master_profiles (публичные, редактирует только владелец)
create policy "master_select_all" on public.master_profiles for select using (true);
create policy "master_insert_own" on public.master_profiles for insert with check (auth.uid() = id);
create policy "master_update_own" on public.master_profiles for update using (auth.uid() = id);
create policy "master_delete_own" on public.master_profiles for delete using (auth.uid() = id);

-- salon_profiles
create policy "salon_select_all" on public.salon_profiles for select using (true);
create policy "salon_insert_own" on public.salon_profiles for insert with check (auth.uid() = id);
create policy "salon_update_own" on public.salon_profiles for update using (auth.uid() = id);
create policy "salon_delete_own" on public.salon_profiles for delete using (auth.uid() = id);

-- portfolio_photos
create policy "portfolio_select_all" on public.portfolio_photos for select using (true);
create policy "portfolio_insert_own" on public.portfolio_photos for insert with check (auth.uid() = master_id);
create policy "portfolio_delete_own" on public.portfolio_photos for delete using (auth.uid() = master_id);

-- vacancies (активные видны всем, свои — всегда себе)
create policy "vacancy_select" on public.vacancies for select using (is_active = true or auth.uid() = salon_id);
create policy "vacancy_insert_own" on public.vacancies for insert with check (auth.uid() = salon_id);
create policy "vacancy_update_own" on public.vacancies for update using (auth.uid() = salon_id);
create policy "vacancy_delete_own" on public.vacancies for delete using (auth.uid() = salon_id);

-- applications (видит мастер-автор и салон-владелец вакансии)
create policy "application_select" on public.applications for select using (
  auth.uid() = master_id
  or auth.uid() = (select salon_id from public.vacancies where id = vacancy_id)
);
create policy "application_insert_own" on public.applications for insert with check (auth.uid() = master_id);
create policy "application_update_salon" on public.applications for update using (
  auth.uid() = (select salon_id from public.vacancies where id = vacancy_id)
);

-- messages (видят только участники переписки по отклику)
create policy "messages_select" on public.messages for select using (
  auth.uid() in (
    select master_id from public.applications where id = application_id
    union
    select v.salon_id from public.vacancies v join public.applications a on a.vacancy_id = v.id where a.id = application_id
  )
);
create policy "messages_insert" on public.messages for insert with check (
  auth.uid() = sender_id and
  auth.uid() in (
    select master_id from public.applications where id = application_id
    union
    select v.salon_id from public.vacancies v join public.applications a on a.vacancy_id = v.id where a.id = application_id
  )
);

-- reviews
create policy "reviews_select_all" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert with check (auth.uid() = author_id);

-- ============================================================
-- STORAGE: бакет для фото портфолио, логотипов, аватаров
-- Выполнить ПОСЛЕ создания бакета "avatars" (Public) в Storage UI
-- ============================================================
insert into storage.buckets (id, name, public) values ('avatars','avatars', true)
  on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_auth_upload" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.role() = 'authenticated'
);
create policy "avatars_owner_update" on storage.objects for update using (
  bucket_id = 'avatars' and owner = auth.uid()
);
create policy "avatars_owner_delete" on storage.objects for delete using (
  bucket_id = 'avatars' and owner = auth.uid()
);

-- ============================================================
-- МОДУЛЬ ЗАПИСИ КЛИЕНТОВ (booking): услуги, расписание, брони
-- Добавлено по запросу: запись клиентов в салон с депозитом
-- ============================================================

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  salon_id uuid references public.salon_profiles(id) on delete cascade,
  name text not null,
  price int not null,
  duration_minutes int not null default 60,
  created_at timestamptz default now()
);

create table public.salon_availability (
  id uuid primary key default uuid_generate_v4(),
  salon_id uuid references public.salon_profiles(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6), -- 0 = воскресенье
  open_time text,   -- '10:00'
  close_time text,  -- '20:00'
  is_closed boolean default false,
  unique(salon_id, weekday)
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  salon_id uuid references public.salon_profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  service_name text,
  client_name text not null,
  client_phone text not null,
  client_email text,
  booking_date date not null,
  booking_time text not null,
  deposit_amount int default 0,
  deposit_status text default 'not_configured' check (deposit_status in ('not_configured','pending','paid','refunded')),
  status text default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz default now()
);

alter table public.services enable row level security;
alter table public.salon_availability enable row level security;
alter table public.bookings enable row level security;

-- услуги и расписание — читает кто угодно (публичная страница записи), меняет только салон
create policy "services_select_all" on public.services for select using (true);
create policy "services_manage_own" on public.services for insert with check (auth.uid() = salon_id);
create policy "services_update_own" on public.services for update using (auth.uid() = salon_id);
create policy "services_delete_own" on public.services for delete using (auth.uid() = salon_id);

create policy "availability_select_all" on public.salon_availability for select using (true);
create policy "availability_manage_own" on public.salon_availability for insert with check (auth.uid() = salon_id);
create policy "availability_update_own" on public.salon_availability for update using (auth.uid() = salon_id);
create policy "availability_delete_own" on public.salon_availability for delete using (auth.uid() = salon_id);

-- брони: создать может ЛЮБОЙ посетитель сайта без аккаунта (это клиенты салона, не пользователи платформы)
-- но видеть и управлять бронями может только сам салон
create policy "bookings_insert_public" on public.bookings for insert with check (true);
create policy "bookings_select_own" on public.bookings for select using (auth.uid() = salon_id);
create policy "bookings_update_own" on public.bookings for update using (auth.uid() = salon_id);

-- ============================================================
-- ПРОДВИЖЕНИЕ ВАКАНСИЙ (реклама/топ) — поле уже есть (is_premium),
-- добавляем срок действия продвижения
-- ============================================================
alter table public.vacancies add column if not exists promoted_until timestamptz;
alter table public.vacancies add column if not exists tags text[] default '{}';

-- Контакты салона: телефон, соцсети, ссылка на 2ГИС
alter table public.salon_profiles add column if not exists phone text;
alter table public.salon_profiles add column if not exists whatsapp text;
alter table public.salon_profiles add column if not exists telegram text;
alter table public.salon_profiles add column if not exists instagram text;
alter table public.salon_profiles add column if not exists twogis_url text;
