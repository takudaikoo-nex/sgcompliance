# コンプライアンス学習システム - 基本設計書

**版：v0.1 | 作成日：2026-06-18**

---

## 1. システム概要

### 目的
社内コンプライアンス学習の提供・進捗管理・実績追跡

### 対象スコープ
- 学習コンテンツの配信（テキスト、画像、動画）
- テスト・クイズの実施・採点
- 受講者の進捗管理
- 修了証・バッジの発行
- 管理者による進捗確認（部門別）

### 非スコープ
- レポート機能（初版では不要）
- 複数回チャレンジの詳細仕様（段階的改修）

---

## 2. システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js + React)                  │
├──────────────────────────────────────────────────────────────────┤
│ 受講者画面                │ 管理画面                             │
│ • ダッシュボード         │ • ユーザー・部門管理                 │
│ • 学習コンテンツ表示     │ • 進捗・結果確認                     │
│ • テスト実施・採点       │ • コンテンツ管理                     │
│ • 修了証表示             │ • バッジ・修了証管理                 │
└──────────────────────────┴──────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  API Layer (Next.js API Routes)                   │
├──────────────────────────────────────────────────────────────────┤
│ • 認証・授権 (Supabase Auth)                                      │
│ • コンテンツ管理                                                  │
│ • テスト・クイズ                                                  │
│ • 進捗管理                                                        │
│ • 修了証・バッジ                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     Supabase (Backend)                            │
├──────────────────────────────────────────────────────────────────┤
│ • PostgreSQL (データベース)                                      │
│ • Auth (ユーザー認証)                                            │
│ • Storage (画像・動画・CSV)                                      │
│ • RLS (Row Level Security)                                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. データベース設計

### 3.1 主要テーブル

#### users (ユーザー)
```sql
- id (UUID, PK)
- email (STRING, UNIQUE)
- name (STRING)
- department_id (UUID, FK → departments)
- role ('admin' | 'user')
- created_at
- updated_at
```

#### departments (部門)
```sql
- id (UUID, PK)
- name (STRING)
- created_at
```

#### courses (学習コース)
```sql
- id (UUID, PK)
- title (STRING)
- description (TEXT)
- order_index (INT)
- created_at
- updated_at
```

#### lessons (学習単元)
```sql
- id (UUID, PK)
- course_id (UUID, FK → courses)
- title (STRING)
- content_type ('text' | 'markdown' | 'image' | 'video')
- content (TEXT/JSONB) - Markdown、YouTube URLなど
- order_index (INT)
- created_at
```

#### questions (クイズ問題)
```sql
- id (UUID, PK)
- lesson_id (UUID, FK → lessons)
- question_text (TEXT)
- question_type ('single' | 'multiple') - 単一選択・複数選択
- options (JSONB) - [{"id": "a", "text": "..."}, ...]
- correct_answers (JSONB) - ["a", "c", ...]
- order_index (INT)
```

#### quiz_attempts (テスト実施記録)
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- lesson_id (UUID, FK → lessons)
- answers (JSONB) - [{"question_id": "xxx", "selected": ["a"]}, ...]
- score (INT) - 0～100
- passed (BOOLEAN) - score >= 80
- attempted_at (TIMESTAMP)
- csv_file_path (STRING) - Supabase Storageパス
```

#### user_progress (ユーザー進捗)
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- course_id (UUID, FK → courses)
- completed_lessons (INT)
- total_lessons (INT)
- progress_percentage (INT)
- updated_at
```

#### certificates (修了証)
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- course_id (UUID, FK → courses)
- issued_at (TIMESTAMP)
- certificate_number (STRING, UNIQUE)
```

#### badges (バッジ)
```sql
- id (UUID, PK)
- name (STRING)
- description (TEXT)
- icon_url (STRING)
- criteria (JSONB) - 取得条件
```

#### user_badges (ユーザーバッジ)
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- badge_id (UUID, FK → badges)
- earned_at (TIMESTAMP)
```

---

## 4. ユーザーロール・権限管理

### 4.1 ロール定義

| ロール | 権限 |
|--------|------|
| **admin** | • ユーザー・部門管理<br>• コース・レッスン管理<br>• 問題・クイズ管理<br>• 全ユーザーの進捗・結果確認<br>• バッジ・修了証管理 |
| **user** | • 割り当てられたコースの受講<br>• テスト実施<br>• 自身の進捗確認<br>• 取得した修了証・バッジ確認 |

### 4.2 RLS (Row Level Security) ポリシー

- **ユーザー進捗**：自分の部門 or 自分自身のデータのみ表示
- **テスト結果**：自分の結果 or 管理者が全員確認可
- **ユーザー一覧**：管理者のみ全員確認、通常ユーザーは自分のみ

---

## 5. 機能仕様

### 5.1 受講者画面

#### ダッシュボード
- 総進捗（%）
- 各コース別の進捗
- 取得済み修了証・バッジ表示
- 次のレッスンへのクイックアクセス

#### 学習画面
- コース・レッスン一覧
- 学習コンテンツ表示
  - Markdown（テキスト・画像）
  - YouTube動画埋め込み
- 「学習完了」ボタン（進捗反映）
- テスト実施ボタン

#### テスト画面
- 問題と選択肢表示
- リアルタイム回答
- 「送信」ボタン
- 即座に採点結果表示
  - スコア：XX/100
  - 合否：✓ 合格 / ✗ 再挑戦
  - 正答率（問題別）
- 修了証・バッジの即座表示（獲得時）

#### 修了証・バッジ画面
- 取得済み修了証のリスト（PDFダウンロード可）
- バッジ一覧

### 5.2 管理画面

#### ダッシュボード
- 全体進捗サマリー
- 部門別進捗
- 最近のテスト実施状況

#### ユーザー・部門管理
- ユーザー一覧（検索・フィルタ）
- 部門管理
- ユーザーの有効化/無効化

#### コース・レッスン管理
- コース一覧・作成・編集・削除
- レッスン一覧・作成・編集・削除
- 学習コンテンツの管理（Markdown、画像、動画URL）

#### クイズ管理
- 問題一覧・作成・編集・削除
- 正答・選択肢の管理

#### 進捗・結果確認
- 部門別進捗サマリー
- ユーザー別進捗詳細
- テスト実施履歴
- スコア・合否確認

#### バッジ・修了証管理
- バッジ定義（名前、説明、アイコン、取得条件）
- 修了証一覧・再発行

---

## 6. デザインシステム

### 6.1 カラーパレット

| 用途 | カラー | 16進数 |
|------|--------|---------|
| プライマリ | コーポレートカラー | #0d3280 |
| セカンダリ | ライトブルー | #1e5a96 |
| 成功 | グリーン | #10b981 |
| 警告 | オレンジ | #f59e0b |
| エラー | レッド | #ef4444 |
| 背景 | ホワイト | #ffffff |
| 背景（薄） | ライトグレー | #f3f4f6 |
| テキスト | ダークグレー | #1f2937 |

### 6.2 トーン・マナー
- シンプル・ミニマル
- 白基調で落ち着き
- コーポレートカラー（#0d3280）を効果的に使用

---

## 7. デプロイメント

### 7.1 新規プロジェクト設定
- **Supabase**：新規プロジェクト作成
- **GitHub**：新規リポジトリ作成
- **Vercel**：新規デプロイ設定

### 7.2 環境変数
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
