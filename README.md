# 開発環境セットアップ完了チェックリスト

**作成日：2026-06-18**

---

## ✅ セットアップドキュメント完成

以下のドキュメントを作成しました。実装開始前に必ず確認してください。

### 📋 ドキュメント一覧

| ドキュメント | 内容 | 優先度 |
|---------------|------|--------|
| **SETUP.md** | Supabase・GitHub・Next.js の完全セットアップ手順 | 🔴 必須 |
| **ASSETS.md** | ロゴ・アイコン・画像の管理ガイド | 🟡 重要 |
| **TAILWIND.md** | Tailwind CSS カラーパレット設定ガイド | 🟡 重要 |
| **WIREFRAME.md** | UI/UX ワイヤーフレーム + 実装コード例 | 🟡 重要 |

---

## 🚀 次のステップ（実装開始前）

### Step 1: Supabaseプロジェクト作成

```bash
# SETUP.md の「ステップ1」に従って:
1. Supabase アカウント確認
2. 新規プロジェクト作成 (sgcompliance)
3. API キー取得 (.env.local 用)
4. Storage バケット作成 (certificates, quiz-results, logos)
```

### Step 2: GitHub リポジトリ作成・初期化

```bash
# SETUP.md の「ステップ2」に従って:
1. GitHub 上で新規リポジトリ作成 (sgcompliance)
2. ローカルで Next.js プロジェクト初期化
3. 依存パッケージインストール
4. GitHub にプッシュ
```

### Step 3: 環境変数設定

```bash
# SETUP.md の「ステップ3」に従って:
1. .env.local ファイル作成
2. Supabase キーをコピーペースト
3. .gitignore で保護
```

### Step 4: ローカル開発サーバー起動

```bash
cd sgcompliance
npm run dev
# ブラウザで http://localhost:3000 確認
```

### Step 5: Vercel デプロイ準備

```bash
# SETUP.md の「ステップ7」に従って:
1. Vercel アカウント連携
2. Environment Variables 設定
3. 初回デプロイ
```

---

## 📁 ロゴ・アセット保存場所

**ASSETS.md を確認してください**

```
public/
├── logos/           ← ロゴ・ブランド画像ここに保存
│   ├── logo.svg
│   ├── favicon.ico
│   └── ...
├── icons/           ← アイコンここに保存
│   ├── badge.svg
│   └── ...
└── images/          ← その他画像ここに保存
    └── ...
```

**保存方法**：
1. ロゴファイルを用意
2. `public/logos/` フォルダに配置
3. `git add` + `git push`
4. Vercel 自動デプロイ

---

## 🎨 デザイン・カラー確認

**TAILWIND.md を確認してください**

### プライマリカラー
- **#0d3280**：コーポレートカラー（濃紺）← **必ず守る**
- **#1e5a96**：セカンダリブルー
- **#ffffff**：背景（ホワイト）
- **#f3f4f6**：背景サブ（ライトグレー）

### Tailwind 設定
- `tailwind.config.ts` をカスタマイズ済み
- プライマリカラーを `#0d3280` で定義
- コンポーネント実装時に `bg-primary` で使用

---

## 🔧 ワイヤーフレーム・UI実装

**WIREFRAME.md を確認してください**

### 主要画面

1. **受講者画面**
   - ダッシュボード
   - コース・レッスン表示
   - テスト実施
   - テスト結果
   - 修了証表示

2. **管理画面**
   - ダッシュボード（サマリー）
   - ユーザー管理
   - 部門別進捗確認
   - 修了証・バッジ管理

### 実装順序（推奨）

- [ ] 共通要素（Header, Sidebar, Button など）
- [ ] 受講者ダッシュボード
- [ ] コース・レッスン表示
- [ ] テスト機能
- [ ] 管理画面ダッシュボード
- [ ] その他管理機能

---

## 📝 実装開始時のGitフロー

```bash
# リポジトリをクローン
git clone https://github.com/takudaikoo-nex/sgcompliance.git
cd sgcompliance

# 環境変数設定
cp .env.local.example .env.local
# .env.local を編集（Supabase キー入力）

# 開発開始
npm install
npm run dev

# コミット例
git checkout -b feature/user-dashboard
# ... 実装 ...
git add .
git commit -m "feat: implement user dashboard"
git push origin feature/user-dashboard
# GitHub で PR 作成 → merge
```

---

## ⚠️ 注意事項

### セキュリティ
1. **.env.local は絶対に Git にコミットしない**
   - `.gitignore` に `*.local` が含まれていることを確認
2. **SUPABASE_SERVICE_ROLE_KEY は機密**
   - ローカルのみ（`.env.local`）に保存
3. **Vercel Environment Variables で安全に設定**
   - Vercel ダッシュボードから設定（Git には含めない）

### 開発環境
1. **Node.js 18以上を使用**
2. **npm または yarn で統一**
3. **Prettier / ESLint で自動整形**
   - `npm run lint` で確認

### Supabase 設定
1. **RLS (Row Level Security) は必須**
   - `supabase/schema.sql` で定義済み
2. **Storage バケットはセキュアに**
   - `certificates` / `quiz-results`：Private
   - `logos`：Public（必要に応じて）

---

## 📞 トラブルシューティング

### よくある問題

#### Q: Supabase に接続できない
**A:** SETUP.md 「デバッグ・トラブルシューティング」を確認

#### Q: ロゴが表示されない
**A:** `public/logos/` フォルダ確認、ファイルパス確認（大文字小文字）

#### Q: Vercel デプロイが失敗
**A:** Environment Variables が正しく設定されているか確認

#### Q: テスト実施時に採点されない
**A:** Supabase API キーと RLS ポリシー確認

---

## 📚 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [lucide-react](https://lucide.dev)

---

## ✅ 最終確認

実装開始前に、以下をすべて確認してください：

- [ ] SETUP.md を読了
- [ ] ASSETS.md を読了
- [ ] TAILWIND.md を読了
- [ ] WIREFRAME.md を読了
- [ ] Supabase プロジェクト作成完了
- [ ] GitHub リポジトリ作成完了
- [ ] ローカル環境で `npm run dev` 動作確認
- [ ] .env.local ファイル作成・設定完了
- [ ] ロゴファイル保存準備完了

---

**すべて確認できたら、実装開始です！🚀**

---

**最終更新：2026-06-18**
**ステータス：セットアップドキュメント完成 → 実装開始待機**
