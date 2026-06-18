# プロジェクトクリーンアップ計画

**作成日：2026-06-18**

---

## 削除対象（AI試験くん特有）

### ルートレベル（削除）
- debug-output.json - デバッグ用
- debug-output.txt - デバッグ用
- debug_titles.txt - デバッグ用
- restructure_script.js - 古いスクリプト
- row_dump.json - データダンプ
- row_dump_fixed.json - データダンプ

### scripts/（大幅削除）
- bulk-import.ts - AIくん用
- check-headers.ts - AIくん用
- check_departments.ts - AIくん用
- debug-import-single.ts - デバッグ用
- debug-programs.ts - デバッグ用
- debug-tests.ts - デバッグ用
- import-kakunin-test.ts - 確認テスト用
- import_ai_review.ts - AIレビュー用
- refine-tests.ts - テスト精錬用
- test_csv.ts - テスト用

**残す：**
- seed_users.ts - 転用可
- setup_storage.ts - 転用可

### src/app/admin/（削除）
- analytics/ - ゲーミフィケーション分析
- kakunin-test/ - 確認テスト機能
- programs/ - プログラム管理
- questions/ - 問題管理
- lectures/ - 講座管理

**残す：**
- dashboard/ - 管理ダッシュボード基本
- users/ - ユーザー管理
- layout.tsx - ロール管理レイアウト

### src/app/dashboard/（削除）
- history/ - 履歴（後で新規実装）
- schedule/ - スケジュール（不要）

**残す：**
- layout.tsx - ユーザー用レイアウト
- page.tsx - ダッシュボード（改修）
- profile/ - プロフィール（改修）
- settings/ - 設定（改修）

### src/components/（削除）
- gamification/ - ゲーミフィケーション全般

**残す：**
- ui/ - Radix UI コンポーネント（全て転用可）
- admin/ - 管理画面コンポーネント（改修）
- user/ - ユーザー画面コンポーネント（改修）

### src/lib/（削除）
- xp-config.ts - XP設定
- level-utils.ts - レベル管理
- csv-import.ts - 削除（後で新規実装）

**残す：**
- supabase/ - Supabase初期化
- utils.ts - ユーティリティ
- date-utils.ts - 日付処理

---

## 残す・転用対象

### 強い転用可
- src/lib/supabase/ - Supabase設定
- src/middleware.ts - 認証ミドルウェア
- tailwind.config.ts - Tailwindカスタマイズ（色を修正）
- tsconfig.json - TypeScript設定
- postcss.config.js - PostCSS設定
- .env.local（修正）
- package.json（依存関係調整）
- src/components/ui/ - UIコンポーネント全て
- src/app/auth/ - 認証フロー
- src/app/layout.tsx - グローバルレイアウト
- src/app/globals.css - グローバルスタイル

---

## 実装順序
1. ルートレベルの不要ファイル削除
2. scripts/の削除・整理
3. src/app/admin/の大幅整理
4. src/app/dashboard/の削除・改修
5. src/components/の不要部分削除
6. src/lib/の不要ファイル削除
7. package.json依存関係調整
8. 各ファイルの名称・構造修正（courses, etc）
