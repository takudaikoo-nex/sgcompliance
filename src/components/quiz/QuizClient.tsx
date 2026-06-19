"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, ChevronLeft, RotateCcw } from "lucide-react"
import { submitQuizAttempt } from "@/app/actions"

type Question = {
    id: string
    question_text: string
    options: { id: string; text: string }[]
    order_index: number
}

type Props = {
    contentId: string
    contentTitle: string
    questions: Question[]
    attemptCount: number
    alreadyPassed: boolean
    previousAttempts: { attempt_number: number; score: number; passed: boolean }[]
}

type Result = {
    score: number
    total: number
    passed: boolean
    attemptNumber: number
    correctAnswers: Record<string, string>
}

export function QuizClient({ contentId, contentTitle, questions, attemptCount, alreadyPassed, previousAttempts }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<Result | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const remainingAttempts = Math.max(0, 3 - attemptCount)
    const canTake = !alreadyPassed && remainingAttempts > 0

    const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id])

    const handleSelect = (questionId: string, optionId: string) => {
        if (result) return
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    }

    const handleSubmit = () => {
        setErrorMsg(null)
        startTransition(async () => {
            const res = await submitQuizAttempt(contentId, answers)
            if ("error" in res) {
                setErrorMsg(res.error)
            } else {
                setResult(res)
            }
        })
    }

    const getOptionClass = (questionId: string, optionId: string): string => {
        const base = "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all "
        if (!result) {
            const selected = answers[questionId] === optionId
            return base + (selected ? "border-[#0d3280] bg-[#0d3280]/5 shadow-sm" : "border-slate-200 hover:border-[#0d3280]/40 hover:bg-slate-50")
        }
        const correct = result.correctAnswers[questionId]
        const isCorrect = optionId === correct
        const isSelected = answers[questionId] === optionId
        if (isCorrect) return base + "border-green-400 bg-green-50"
        if (isSelected && !isCorrect) return base + "border-red-300 bg-red-50"
        return base + "border-slate-100 opacity-60"
    }

    // 合格済み表示
    if (alreadyPassed) {
        const bestScore = previousAttempts.reduce((max, a) => Math.max(max, a.score), 0)
        return (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                    <h2 className="text-2xl font-bold text-green-700">合格済み</h2>
                    <p className="text-muted-foreground mt-2">「{contentTitle}」の確認テストに合格しています</p>
                    <p className="text-3xl font-bold text-green-600 mt-4">{bestScore}点</p>
                    <p className="text-sm text-muted-foreground">最高スコア</p>
                </div>
                <Link href={`/dashboard/learn/${contentId}`}>
                    <Button variant="outline" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        教材に戻る
                    </Button>
                </Link>
            </div>
        )
    }

    // 結果表示
    if (result) {
        const correct = questions.filter((q) => answers[q.id] === result.correctAnswers[q.id]).length
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className={`border-2 text-center py-8 ${result.passed ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50/30"}`}>
                    <CardContent>
                        {result.passed ? (
                            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-3" />
                        ) : (
                            <XCircle className="h-14 w-14 text-red-400 mx-auto mb-3" />
                        )}
                        <p className="text-xl font-bold mb-1">{result.passed ? "合格！" : "不合格"}</p>
                        <p className="text-4xl font-bold text-[#0d3280] my-2">{result.score}点</p>
                        <p className="text-sm text-muted-foreground">{correct} / {result.total}問 正解 — 第{result.attemptNumber}回受験</p>
                        {!result.passed && remainingAttempts - 1 > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">残り{remainingAttempts - 1}回受験できます</p>
                        )}
                        {!result.passed && remainingAttempts - 1 <= 0 && (
                            <p className="text-sm text-red-500 mt-1">受験回数の上限に達しました</p>
                        )}
                    </CardContent>
                </Card>

                {/* 解答レビュー */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700">解答レビュー</h3>
                    {questions.map((q, qi) => {
                        const selected = answers[q.id]
                        const correct = result.correctAnswers[q.id]
                        const isCorrect = selected === correct
                        return (
                            <Card key={q.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-start gap-2 mb-3">
                                        {isCorrect ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />}
                                        <p className="text-sm font-medium">問題{qi + 1}. {q.question_text}</p>
                                    </div>
                                    <div className="space-y-1.5 pl-6">
                                        {q.options.map((opt) => {
                                            const isSelected = selected === opt.id
                                            const isCorrectOpt = correct === opt.id
                                            return (
                                                <div key={opt.id} className={`text-sm px-3 py-1.5 rounded ${isCorrectOpt ? "bg-green-100 text-green-800 font-medium" : isSelected ? "bg-red-50 text-red-600 line-through" : "text-slate-600"}`}>
                                                    {opt.id.toUpperCase()}. {opt.text}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="flex gap-3">
                    <Link href={`/dashboard/learn/${contentId}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            教材に戻る
                        </Button>
                    </Link>
                    {!result.passed && remainingAttempts - 1 > 0 && (
                        <Button
                            className="flex-1 bg-[#0d3280] hover:bg-[#0a2560] gap-2"
                            onClick={() => { setResult(null); setAnswers({}) }}
                        >
                            <RotateCcw className="h-4 w-4" />
                            再受験する
                        </Button>
                    )}
                    {result.passed && (
                        <Link href="/dashboard/learn" className="flex-1">
                            <Button className="w-full bg-[#0d3280] hover:bg-[#0a2560]">一覧に戻る</Button>
                        </Link>
                    )}
                </div>
            </div>
        )
    }

    // 受験回数上限
    if (!canTake) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
                <AlertCircle className="h-16 w-16 text-orange-400 mx-auto" />
                <div>
                    <h2 className="text-xl font-bold text-slate-700">受験回数の上限に達しました</h2>
                    <p className="text-muted-foreground mt-2">「{contentTitle}」の確認テストは3回まで受験できます</p>
                    <div className="mt-4 space-y-1">
                        {previousAttempts.map((a) => (
                            <p key={a.attempt_number} className="text-sm text-muted-foreground">第{a.attempt_number}回: {a.score}点（{a.passed ? "合格" : "不合格"}）</p>
                        ))}
                    </div>
                </div>
                <Link href={`/dashboard/learn/${contentId}`}>
                    <Button variant="outline" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        教材に戻る
                    </Button>
                </Link>
            </div>
        )
    }

    // テスト画面
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{contentTitle}</p>
                    <h2 className="text-xl font-bold text-[#0d3280]">確認テスト</h2>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-[#0d3280]">
                        {attemptCount === 0 ? "初回受験" : `第${attemptCount + 1}回受験`}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">残り{remainingAttempts}回 / 合格80点以上</p>
                </div>
            </div>

            {previousAttempts.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {previousAttempts.map((a) => (
                        <Badge key={a.attempt_number} variant="outline" className={a.passed ? "text-green-600 border-green-300" : "text-red-500 border-red-200"}>
                            第{a.attempt_number}回: {a.score}点
                        </Badge>
                    ))}
                </div>
            )}

            {/* 問題 */}
            <div className="space-y-6">
                {questions.map((q, qi) => (
                    <Card key={q.id}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-slate-800">
                                問題{qi + 1}. {q.question_text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {q.options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={getOptionClass(q.id, opt.id)}
                                    onClick={() => handleSelect(q.id, opt.id)}
                                >
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${answers[q.id] === opt.id ? "border-[#0d3280] bg-[#0d3280] text-white" : "border-slate-300 text-slate-500"}`}>
                                        {opt.id.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-slate-700">{opt.text}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {errorMsg && (
                <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            )}

            <div className="flex gap-3">
                <Link href={`/dashboard/learn/${contentId}`}>
                    <Button variant="outline" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        戻る
                    </Button>
                </Link>
                <Button
                    className="flex-1 bg-[#0d3280] hover:bg-[#0a2560] disabled:opacity-50"
                    disabled={!allAnswered || isPending}
                    onClick={handleSubmit}
                >
                    {isPending ? "採点中..." : `回答を提出する（${Object.keys(answers).length} / ${questions.length}問回答済）`}
                </Button>
            </div>
        </div>
    )
}
