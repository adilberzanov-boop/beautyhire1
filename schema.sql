-- Быстрый фикс: не хватало колонки tags в таблице vacancies
alter table public.vacancies add column if not exists tags text[] default '{}';
