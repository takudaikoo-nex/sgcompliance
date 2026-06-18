# アセット管理ガイド

**作成日：2026-06-18**

---

## 概要

このドキュメントは、デザインアセット（ロゴ、アイコン、画像）の保存・管理方法を定義します。

---

## フォルダ構造

```
sgcompliance/
├── public/
│   ├── logos/              ← ロゴ・ブランド画像
│   │   ├── logo-light.svg
│   │   ├── logo-dark.svg
│   │   ├── favicon.ico
│   │   └── ...
│   ├── icons/              ← アイコン
│   │   ├── badge.svg
│   │   ├── certificate.svg
│   │   └── ...
│   ├── images/             ← その他画像
│   │   ├── hero.jpg
│   │   └── ...
│   └── fonts/              ← カスタムフォント（必要に応じて）
└── ...
```

---

## フォルダ説明

### 1. `public/logos/`

**用途**：企業ロゴ、ブランド画像

**保存形式**：
- **SVG**：ロゴ（ベクトル形式、推奨）
- **PNG**：フォールバック用
- **ICO/PNG**：favicon

**ファイル例**：
```
logos/
├── logo.svg              # メインロゴ（カラー）
├── logo-white.svg        # ホワイトロゴ（背景用）
├── logo-icon.svg         # アイコンロゴ
├── favicon.ico           # ブラウザタブ
└── apple-touch-icon.png  # iOS ホーム画面用
```

**使用例（Next.js）**：
```jsx
import Image from 'next/image';

export default function Header() {
  return (
    <Image
      src="/logos/logo.svg"
      alt="Company Logo"
      width={40}
      height={40}
    />
  );
}
```

### 2. `public/icons/`

**用途**：UI アイコン

**保存形式**：SVG（推奨）

**ファイル例**：
```
icons/
├── badge.svg            # バッジアイコン
├── certificate.svg      # 修了証アイコン
├── course.svg           # コースアイコン
├── quiz.svg             # クイズアイコン
├── progress.svg         # 進捗アイコン
└── ...
```

**注**：Radix UI アイコン（lucide-react）も併用：
```jsx
import { Badge, Certificate, BookOpen } from 'lucide-react';

// アイコン使用
<Badge className="w-6 h-6" />
```

### 3. `public/images/`

**用途**：背景画像、イラスト、その他メディア

**保存形式**：JPG、PNG、WebP

**ファイル例**：
```
images/
├── hero-bg.jpg          # ヒーロー背景
├── course-placeholder.png
└── ...
```

---

## アセット管理のベストプラクティス

### 1. ファイルサイズ最適化
- **SVG**：テキストエディタで確認可能
- **PNG**：`pngquant` や `TinyPNG` で圧縮
- **JPG**：品質 75～85% での圧縮推奨
- **WebP**：次世代形式（エッジブラウザ対応）

### 2. ネーミング規則
- **小文字**：`logo-light.svg`（大文字は避ける）
- **ハイフン区切り**：`logo-light.svg`（アンダースコアではなく）
- **説明的**：`icon-checkbox-checked.svg`（汎用 `icon1.svg` は避ける）

### 3. バージョン管理
```bash
# ロゴ更新時は Git で追跡
git add public/logos/
git commit -m "chore: update logo branding"
git push
```

### 4. アクセスシビリティ
```jsx
// 必ず alt テキストを指定
<Image
  src="/logos/logo.svg"
  alt="Company Logo - SG Compliance"
  width={40}
  height={40}
/>

// SVG の場合
<svg aria-label="Company Logo">
  {/* ... */}
</svg>
```

---

## 色に関する注意

### プライマリカラー

| カラー | 16進数 | 用途 |
|--------|---------|------|
| **#0d3280** | コーポレートカラー（濃紺） | ロゴ、ボタン、リンク |
| **#ffffff** | ホワイト | 背景、テキスト（深色背景時） |
| **#f3f4f6** | ライトグレー | 背景サブ |
| **#1f2937** | ダークグレー | テキスト（通常） |

### アセット内での色使用
- **ロゴ**：#0d3280 を使用
- **アイコン**：現在の文字色に継承（SVG `fill="currentColor"` 推奨）
- **背景画像**：#0d3280 をアクセントに

**SVG カラー継承例**：
```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="currentColor" strokeWidth="2" />
  <!-- currentColor により、親要素のテキスト色を継承 -->
</svg>
```

---

## Tailwind CSS での画像利用

### 背景画像設定

```ts
// tailwind.config.ts
export default {
  theme: {
    backgroundImage: {
      'hero': "url('/images/hero-bg.jpg')",
      'gradient-primary': 'linear-gradient(135deg, #0d3280 0%, #1e5a96 100%)',
    },
  },
};
```

### 使用例

```jsx
<div className="bg-hero bg-cover bg-center h-96">
  {/* ... */}
</div>
```

---

## デプロイ時の注意

### 1. Vercel でのアセット最適化
- Next.js の Image コンポーネント使用により自動最適化
- Vercel の CDN から高速配信

### 2. Supabase Storage への保存（オプション）
- 大容量ファイル（動画など）は Supabase Storage を使用
- ロゴやアイコンは `public/` で十分

---

## チェックリスト

- [ ] ロゴ SVG ファイルを `public/logos/` に保存
- [ ] favicon を `public/logos/favicon.ico` に設定
- [ ] アイコン SVG を `public/icons/` に保存
- [ ] 全ファイルで色コードを確認（#0d3280 使用）
- [ ] Git でコミット
- [ ] Vercel に自動デプロイ

---

## 次のステップ

1. ロゴファイルをアップロード
2. Tailwind カラーパレット確認
3. UI コンポーネント実装時にアイコン適用
