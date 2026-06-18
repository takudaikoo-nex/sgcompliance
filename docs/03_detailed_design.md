# コンプライアンス学習システム - 実装設計書

**版：v1.0 | 作成日：2026-06-18 | ステータス：確定**

---

## 1. 確定された仕様

### 1.1 バッジシステム
- **バッジ種類**：全体合格バッジ（1種類のみ）
- **名称**：「コンプライアンス修了バッジ」
- **取得条件**：全コース合格（80点以上）
- **有効期限**：1年間（更新制）

### 1.2 修了証仕様
- **記載内容**：ユーザー名 + コース名 + 発行日 + シリアルナンバー
- **表示方法**：
  - **ユーザー**：個人ダッシュボード内に修了証一覧表示（PDF/画像DL可）
  - **管理者**：修了証管理リスト（一覧表）で全ユーザーの修了証確認
- **形式**：PDF（サーバーサイド生成 + Supabase Storage保存）

### 1.3 テスト・チャレンジ仕様
- **最大挑戦回数**：3回
- **試行管理**：
  - 試行1回目、2回目、3回目をそれぞれ記録
  - 最高スコアは自動保存
  - 過去ログ画面で全試行結果をリスト表示（スコア、日時、正答率など）
- **合格判定**：各試行で80点以上で合格
- **再受験後**：直前の試行内容が上書きされない（全試行履歴保持）

### 1.4 部門別アクセス・管理
- **ユーザー**：自分の部門データのみ表示（RLS）
- **管理者**：全部門のデータを表示可能
- **部門ビュー**：部門一覧、部門別進捗サマリー、ユーザー詳細確認

### 1.5 動画コンテンツ + テスト
- **構成**：「レッスン = 動画 + テスト」
- **フロー**：
  1. ユーザーが動画を再生
  2. 動画再生完了 → 「テスト開始」ボタン有効化
  3. テスト実施 → リアルタイム採点
  4. 合格 → 修了証・バッジ候補に追加

---

## 2. データベース設計（詳細版）

### 2.1 追加テーブル

#### badges テーブル（修正）
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  criteria JSONB,
  valid_years INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### user_badges テーブル（修正）
```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, badge_id, earned_at)
);
```

#### quiz_attempts テーブル（詳細化）
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  attempt_number INT NOT NULL,
  answers JSONB NOT NULL,
  score INT NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  total_questions INT,
  correct_count INT,
  attempted_at TIMESTAMP DEFAULT NOW(),
  csv_file_path VARCHAR(255),
  UNIQUE(user_id, lesson_id, attempt_number),
  CONSTRAINT max_attempts CHECK (attempt_number <= 3)
);
```

#### video_watch_progress（新規）
```sql
CREATE TABLE video_watch_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  current_time INT,
  duration INT,
  watch_percentage INT,
  last_watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

---

## 3. API設計（主要エンドポイント）

### テスト・クイズ関連

#### POST /api/quiz/submit
```json
// Response
{
  "score": 85,
  "total_questions": 10,
  "correct_count": 8.5,
  "passed": true,
  "attempt_number": 1,
  "csv_file_path": "quiz-results/2026/06/user_id_1718700000.csv",
  "badge_awarded": {
    "id": "uuid",
    "name": "コンプライアンス修了バッジ",
    "expires_at": "2027-06-18"
  },
  "certificate_issued": {
    "id": "uuid",
    "certificate_number": "CERT-20260618-001",
    "pdf_url": "https://..."
  }
}
```

#### GET /api/quiz/:lessonId/attempts
```json
// Response
{
  "lesson_id": "uuid",
  "attempts": [
    {
      "attempt_number": 1,
      "score": 85,
      "passed": true,
      "attempted_at": "2026-06-10T10:30:00Z",
      "correct_count": 8.5
    }
  ],
  "max_attempts": 3,
  "remaining_attempts": 1
}
```

---

## 4. CSV連携仕様

### テスト実施記録CSV

**ファイル名**: `quiz-results/{year}/{month}/{user_id}_{timestamp}.csv`

**内容**:
```csv
user_id,user_name,department_id,department_name,lesson_id,lesson_name,attempt_number,total_questions,correct_count,score,passed,attempted_at
```

---

## 5. セキュリティ・RLS設定

### Row Level Security (RLS)

#### quiz_attempts テーブル
```sql
CREATE POLICY "Users can view own attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 6. 実装フェーズ・優先度

| フェーズ | 内容 | 優先度 |
|---------|------|--------|
| **Phase 1** | 認証・基本構造・テーブル作成 | 🔴 高 |
| **Phase 2** | 受講者画面（学習・テスト） | 🔴 高 |
| **Phase 3** | 修了証・バッジシステム | 🟡 中 |
| **Phase 4** | 管理画面（基本） | 🟡 中 |
| **Phase 5** | ビデオ進捗管理 | 🟢 低 |
