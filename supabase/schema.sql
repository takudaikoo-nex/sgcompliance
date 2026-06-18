-- =============================================
-- SGコンプライアンス学習システム スキーマ
-- =============================================

-- profiles テーブル（auth.usersと1:1）
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  department text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 更新日時の自動更新トリガー
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- RLS有効化
alter table profiles enable row level security;

-- 管理者は全プロフィールを参照可能
create policy "Admin can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 自分自身のプロフィールは参照可能
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- 管理者は全プロフィールを更新可能
create policy "Admin can update all profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 自分自身のプロフィールは更新可能（roleは除く）
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- =============================================
-- コンテンツ（学習教材）テーブル
-- =============================================

create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('text', 'video', 'quiz')),
  body text,                          -- Markdownテキスト本文
  youtube_url text,                   -- YouTube埋め込みURL
  order_index integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace trigger contents_updated_at
  before update on contents
  for each row execute function update_updated_at();

alter table contents enable row level security;

create policy "All authenticated users can view published contents"
  on contents for select
  to authenticated
  using (is_published = true);

create policy "Admin can manage all contents"
  on contents for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- 問題テーブル（テスト/クイズ用）
-- =============================================

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references contents(id) on delete set null,
  question_text text not null,
  options jsonb not null,             -- [{"id":"a","text":"選択肢A"}, ...]
  correct_answer text not null,
  explanation text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table questions enable row level security;

create policy "All authenticated users can view questions"
  on questions for select
  to authenticated
  using (true);

create policy "Admin can manage questions"
  on questions for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- テスト受験結果テーブル（最大3回）
-- =============================================

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  attempt_number integer not null default 1,
  score integer not null,
  total_questions integer not null,
  passed boolean not null,
  answers jsonb,                      -- {"question_id": "selected_answer", ...}
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table exam_attempts enable row level security;

create policy "Users can view own attempts"
  on exam_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on exam_attempts for insert
  with check (auth.uid() = user_id);

create policy "Admin can view all attempts"
  on exam_attempts for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- 受講進捗テーブル
-- =============================================

create table if not exists content_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content_id uuid references contents(id) on delete cascade not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, content_id)
);

alter table content_progress enable row level security;

create policy "Users can manage own progress"
  on content_progress for all
  using (auth.uid() = user_id);

create policy "Admin can view all progress"
  on content_progress for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- バッジ取得テーブル（年次リセット用）
-- =============================================

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_type text not null default 'compliance_complete',
  year integer not null,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_type, year)
);

alter table user_badges enable row level security;

create policy "Users can view own badges"
  on user_badges for select
  using (auth.uid() = user_id);

create policy "Admin can view all badges"
  on user_badges for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
