import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, Award, ClipboardList, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [
        { data: profile },
        { data: contents, error: contentsError },
        { data: progress },
        { data: passedAttempts },
        { data: allAttempts },
        { data: badges },
    ] = await Promise.all([
        supabase.from("profiles").select("full_name, department").eq("id", user!.id).single(),
        supabase.from("contents").select("id").eq("is_published", true),
        supabase.from("content_progress").select("content_id, completed").eq("user_id", user!.id),
        supabase.from("exam_attempts").select("content_id, score").eq("user_id", user!.id).eq("passed", true),
        supabase.from("exam_attempts").select("score").eq("user_id", user!.id).order("finished_at", { ascending: false }).limit(1),
        supabase.from("user_badges").select("id").eq("user_id", user!.id),
    ])

    console.error("[DEBUG] contents:", contents, "error:", contentsError)

    const totalContents = contents?.length ?? 0
    const passedSet = new Set(passedAttempts?.map((a) => a.content_id) ?? [])
    const passedCount = passedSet.size
    const latestScore = allAttempts?.[0]?.score ?? null
    const allPassed = totalContents > 0 && passedCount === totalContents
    const hasBadge = (badges?.length ?? 0) > 0

    const recentContents = contents?.slice(0, 5)

    return (
        <div className="space-y-6">
            {contentsError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-800 font-mono">
                    [DEBUG] contents error: {JSON.stringify(contentsError)}
                </div>
            )}
            {!contentsError && contents !== null && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-xs text-green-800">
                    [DEBUG] contents count: {contents.length}
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0d3280]">
                        こんにちは、{profile?.full_name || "ユーザー"}さん
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        コンプライアンス研修の受講状況
                    </p>
                </div>
                {profile?.department && (
                    <Badge variant="outline" className="border-[#0d3280] text-[#0d3280]">
                        {profile.department}
                    </Badge>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">テスト合格</CardTitle>
                        <BookOpen className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">
                            {passedCount} <span className="text-base font-normal text-muted-foreground">/ {totalContents}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">合格済みコンテンツ数</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">最新スコア</CardTitle>
                        <ClipboardList className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">
                            {latestScore !== null ? `${latestScore}点` : "—"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">直近のテスト結果</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">合格状況</CardTitle>
                        <CheckCircle className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${allPassed ? "text-green-600" : "text-slate-400"}`}>
                            {allPassed ? "合格" : "未完了"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">合格ライン 80点</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">バッジ</CardTitle>
                        <Award className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${hasBadge ? "text-yellow-500" : "text-slate-400"}`}>
                            {hasBadge ? "取得済み" : "未取得"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">全体合格で取得</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="text-base text-[#0d3280]">学習コンテンツ</CardTitle>
                    <Link href="/dashboard/learn">
                        <Button variant="ghost" size="sm" className="text-[#0d3280] gap-1 text-xs">
                            すべて見る <ChevronRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-2">
                    {totalContents === 0 ? (
                        <p className="text-sm text-muted-foreground">コンテンツが登録されていません</p>
                    ) : (
                        <>
                            {/* 進捗バー */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>全体進捗</span>
                                    <span>{passedCount} / {totalContents} 完了</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0d3280] rounded-full transition-all"
                                        style={{ width: `${totalContents > 0 ? (passedCount / totalContents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <Link href="/dashboard/learn">
                                <Button className="w-full bg-[#0d3280] hover:bg-[#0a2560]">
                                    学習を始める
                                </Button>
                            </Link>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
