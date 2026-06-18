-- profilesテーブルに department テキストカラムを追加
-- (既存の department_id とは別に、部署名を直接保持する)
alter table profiles
  add column if not exists department text;
