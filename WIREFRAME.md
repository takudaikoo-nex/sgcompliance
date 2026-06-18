# UI/UX ワイヤーフレーム実装ガイド

**作成日：2026-06-18 | デザイン方針：白基調 + #0d3280**

---

## 概要

このドキュメントは、**コンプライアンス学習システム** の UI/UX ワイヤーフレームと実装ガイドを定義します。

デザイン方針：
- **背景**：白基調（#ffffff）
- **アクセント**：コーポレートカラー（#0d3280）
- **トーン**：シンプル・ミニマル・プロフェッショナル

---

## 1. 共通要素

### 1.1 ヘッダー/ナビゲーション

```
┌─────────────────────────────────────────────────────┐
│ 🔐 コンプラ守るくん     [検索]    [ユーザー] [menu]│
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/components/layouts/Header.tsx
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-2">
          <Image src="/logos/logo.svg" alt="Logo" width={32} height={32} />
          <h1 className="text-xl font-bold text-primary">コンプラ守るくん</h1>
        </div>
        
        {/* ナビゲーション */}
        <nav className="flex items-center gap-4">
          <SearchBar />
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}
```

### 1.2 サイドバー

```
┌────────────┐
│ ダッシュボード
│ 学習
│ テスト
│ 修了証
│ 設定
└────────────┘
```

**実装例**:
```jsx
// src/components/layouts/Sidebar.tsx
export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

### 1.3 ボタン・フォーム要素

**プライマリボタン**:
```jsx
<button className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors">
  アクション
</button>
```

**フォーム入力**:
```jsx
<input
  type="text"
  placeholder="検索..."
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
/>
```

---

## 2. 受講者画面

### 2.1 ダッシュボード

```
┌─────────────────────────────────────────────────────┐
│                    ダッシュボード                      │
├─────────────────────────────────────────────────────┤
│ こんにちは、田中太郎さん                              │
│                                                      │
│ 【全体進捗】                                          │
│ ████████░░  75%                                       │
│                                                      │
│ 【修了証・バッジ】                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ 🎓 修了証 1件          🏅 バッジ取得        │   │
│ │ 有効期限: 2027-06-18                        │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ 【コース一覧】                                        │
│ ┌──────────────────────────────────────────────┐   │
│ │ • コース1: コンプラ基礎     ████████░░ 80%  │   │
│ │ • コース2: 倫理規程          ████░░░░░░ 40%  │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ [学習を始める]                                       │
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/app/(user)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">ダッシュボード</h1>
      
      {/* ウェルカムセクション */}
      <section className="bg-white rounded-lg shadow-card p-6 mb-6">
        <p className="text-xl text-gray-700">こんにちは、<span className="font-semibold">{user.name}</span>さん</p>
      </section>
      
      {/* 進捗 */}
      <section className="bg-white rounded-lg shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">全体進捗</h2>
        <ProgressBar value={75} />
      </section>
      
      {/* 修了証・バッジ */}
      <section className="bg-white rounded-lg shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">修了証・バッジ</h2>
        <div className="grid grid-cols-2 gap-4">
          <CertificateCard />
          <BadgeCard />
        </div>
      </section>
      
      {/* コース一覧 */}
      <section className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">コース一覧</h2>
        <CourseList />
      </section>
    </main>
  )
}
```

### 2.2 コース・レッスン画面

```
┌─────────────────────────────────────────────────────┐
│ < 戻る   コース: コンプラ基礎                        │
├─────────────────────────────────────────────────────┤
│ 【Lesson 2: 動画+テスト】                            │
│                                                      │
│ ┌────────────────────────────────────────────────┐ │
│ │  [YouTube Player]                              │ │
│ │  ▶ 再生中 2:45 / 10:00                         │ │
│ │  再生進捗: ███████░░░░ 27%                     │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ 【テスト開始】                                        │
│ ☑ 動画を最後まで見てください                         │
│ [ テスト開始 ]（再生完了後に有効）                  │
│                                                      │
│ [ 学習完了 ]                                        │
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/app/(user)/courses/[id]/lesson/[lessonId]/page.tsx
export default function LessonPage() {
  const [videoProgress, setVideoProgress] = useState(0)
  const [canTakeTest, setCanTakeTest] = useState(false)
  
  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress)
    if (progress >= 90) setCanTakeTest(true)
  }
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 動画 */}
      <section className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allowFullScreen
        />
      </section>
      
      {/* 進捗表示 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600 mb-2">再生進捗: {videoProgress}%</p>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      </div>
      
      {/* テストボタン */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <p className="text-gray-700 mb-4">
          {canTakeTest ? '動画を見終わりました！' : '動画を最後まで見てください'}
        </p>
        <button
          disabled={!canTakeTest}
          className="bg-primary hover:bg-primary-light disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          テスト開始
        </button>
      </div>
    </main>
  )
}
```

### 2.3 テスト実施画面

```
┌─────────────────────────────────────────────────────┐
│ 【テスト実施 - コンプラ基礎】                          │
│ 進捗: 1 / 10  ██░░░░░░░░░░░░░░░░░░ 10%             │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Q1. 以下のうち、正しい行為はどれか？                 │
│                                                      │
│ ○ A. 不正なデータアクセス                            │
│ ○ B. 規程に基づいた適切な処理                        │
│ ○ C. 顧客情報の無断転送                              │
│ ○ D. 上司への無断報告                                │
│                                                      │
├─────────────────────────────────────────────────────┤
│ [ < 前へ ]                        [ 次へ > ]         │
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/app/(user)/courses/[id]/quiz/[quizId]/page.tsx
export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  
  const handleSelectAnswer = (optionId: string) => {
    setAnswers({
      ...answers,
      [quiz.questions[currentQuestion].id]: optionId
    })
  }
  
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-4">テスト実施</h1>
      
      {/* 進捗 */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          進捗: {currentQuestion + 1} / {quiz.questions.length}
        </p>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* 問題 */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Q{currentQuestion + 1}. {quiz.questions[currentQuestion].text}
        </h2>
        
        {/* 選択肢 */}
        <div className="space-y-3">
          {quiz.questions[currentQuestion].options.map((option) => (
            <label key={option.id} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="answer"
                value={option.id}
                checked={answers[quiz.questions[currentQuestion].id] === option.id}
                onChange={() => handleSelectAnswer(option.id)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* ナビゲーション */}
      <div className="flex justify-between">
        <button
          disabled={currentQuestion === 0}
          className="px-6 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          < 前へ
        </button>
        <button
          onClick={() => currentQuestion < quiz.questions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : submitQuiz()}
          className="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium"
        >
          {currentQuestion < quiz.questions.length - 1 ? '次へ >' : '送信'}
        </button>
      </div>
    </main>
  )
}
```

### 2.4 テスト結果画面

```
┌─────────────────────────────────────────────────────┐
│                   【採点結果】                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ スコア: 85/100                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                                      │
│ ✓ 合格 おめでとうございます！                        │
│                                                      │
│ 【問題別結果】                                        │
│ Q1. ✓ 正解 (選択: B, 正解: B)                       │
│ Q2. ✗ 不正解 (選択: A, 正解: B)                     │
│ Q3. ✓ 正解                                           │
│ ...                                                  │
│                                                      │
│ 【获得】                                              │
│ 🏅 コンプライアンス修了バッジを獲得！                │
│ 🎓 修了証が発行されました                            │
│                                                      │
│ [ 修了証をダウンロード ]  [ 試行履歴 ]  [ 戻る ]   │
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/app/(user)/courses/[id]/quiz/[quizId]/result/page.tsx
export default function QuizResultPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* スコア */}
      <div className="bg-white rounded-lg shadow-card p-8 mb-6 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {score >= 80 ? '✓ 合格' : '✗ 再挑戦'}
        </h1>
        <p className="text-2xl font-semibold text-gray-900">スコア: {score}/100</p>
        <p className="text-gray-600 mt-2">
          {score >= 80 ? 'おめでとうございます！' : 'もう一度挑戦してください'}
        </p>
      </div>
      
      {/* バッジ・修了証 */}
      {score >= 80 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3">🎉 成就！</h2>
          <p className="text-blue-800 mb-2">🏅 コンプライアンス修了バッジを獲得しました</p>
          <p className="text-blue-800">🎓 修了証が発行されました</p>
        </div>
      )}
      
      {/* 問題別結果 */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">問題別結果</h2>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className={`p-4 border-l-4 ${isCorrect[i] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <p className={`font-medium ${isCorrect[i] ? 'text-green-800' : 'text-red-800'}`}>
                Q{i + 1}. {isCorrect[i] ? '✓ 正解' : '✗ 不正解'}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* アクション */}
      <div className="flex gap-4 mt-6 justify-center">
        <button className="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg">
          修了証をダウンロード
        </button>
        <button className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg">
          試行履歴を見る
        </button>
      </div>
    </main>
  )
}
```

---

## 3. 管理画面

### 3.1 管理ダッシュボード

```
┌─────────────────────────────────────────────────────┐
│ 【管理画面】                                          │
├─────────────────────────────────────────────────────┤
│ 【全体サマリー】                                      │
│ ┌──────┬──────┬──────┐                              │
│ │ユーザー│ 合格者│ 平均スコア│                          │
│ │ 100  │  75  │ 82.5  │                              │
│ └──────┴──────┴──────┘                              │
│                                                      │
│ 【部門別進捗】                                        │
│ ┌──────────────┬──────┬────┬───┐                    │
│ │ 部門         │ 人数 │合格│率 │                     │
│ ├──────────────┼──────┼────┼───┤                    │
│ │ コンプラ部   │ 30   │ 28 │93%│                    │
│ │ 営業部       │ 40   │ 30 │75%│                    │
│ │ 技術部       │ 30   │ 17 │57%│                    │
│ └──────────────┴──────┴────┴───┘                    │
│                                                      │
│ 【最近のテスト実施】                                  │
│ • 田中太郎 (営業部) - 87/100 ✓ 2026-06-18         │
│ • 佐藤花子 (技術部) - 73/100 ✗ 2026-06-18         │
└─────────────────────────────────────────────────────┘
```

**実装例**:
```jsx
// src/app/(admin)/dashboard/page.tsx
export default function AdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">管理画面</h1>
      
      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="ユーザー数" value={100} />
        <StatCard label="合格者" value={75} />
        <StatCard label="平均スコア" value="82.5" />
      </div>
      
      {/* 部門別進捗 */}
      <section className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">部門別進捗</h2>
        <DepartmentTable />
      </section>
    </main>
  )
}
```

---

## 4. コンポーネント実装リスト

### 優先度 HIGH

- [ ] Header コンポーネント
- [ ] Sidebar コンポーネント
- [ ] Button コンポーネント
- [ ] ProgressBar コンポーネント
- [ ] Card コンポーネント
- [ ] Badge コンポーネント

### 優先度 MEDIUM

- [ ] Table コンポーネント
- [ ] Modal/Dialog コンポーネント
- [ ] Form Input コンポーネント
- [ ] Select/Dropdown コンポーネント
- [ ] Tabs コンポーネント

### 優先度 LOW

- [ ] Tooltip コンポーネント
- [ ] Pagination コンポーネント
- [ ] Spinner/Loader コンポーネント

---

## 5. 実装チェックリスト

### レイアウト・共通

- [ ] Header レイアウト実装
- [ ] Sidebar ナビゲーション実装
- [ ] Footer 実装（必要に応じて）
- [ ] レスポンシブ対応確認

### 受講者画面

- [ ] ダッシュボード実装
- [ ] コース一覧実装
- [ ] レッスン表示実装
- [ ] 動画再生 + 進捗管理実装
- [ ] テスト実施画面実装
- [ ] テスト結果画面実装
- [ ] 試行履歴表示実装
- [ ] 修了証表示実装

### 管理画面

- [ ] 管理ダッシュボード実装
- [ ] ユーザー管理画面実装
- [ ] 部門別進捗確認実装
- [ ] テスト結果管理実装
- [ ] 修了証・バッジ管理実装

---

## 6. デザイン参考資料

- **カラーパレット**：[TAILWIND.md](TAILWIND.md) 参照
- **アセット管理**：[ASSETS.md](ASSETS.md) 参照
- **フォント**：Inter（Google Fonts）
- **アイコン**：Radix UI / lucide-react

---

**このドキュメントは実装進捗に応じて更新されます。**
