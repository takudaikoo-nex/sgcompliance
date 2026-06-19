import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, Users, ClipboardList } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminContentPage() {
    const supabase = createClient()

    const [{ data: contents }, { data: questions }, { data: passedAttempts }, { count: userCount }] = await Promise.all([
        supabase.from("contents").select("id, title, description, order_index, is_published").order("order_index"),
        supabase.from("questions").select("content_id"),
        supabase.from("exam_attempts").select("content_id, user_id").eq("passed", true),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    ])

    const questionCountByContent: Record<string, number> = {}
    for (const q of questions ?? []) {
        questionCountByContent[q.content_id] = (questionCountByContent[q.content_id] ?? 0) + 1
    }

    const passedCountByContent: Record<string, number> = {}
    const totalUsers = userCount ?? 0

    for (const a of passedAttempts ?? []) {
        if (a.content_id) {
            passedCountByContent[a.content_id] = (passedCountByContent[a.content_id] ?? 0) + 1
        }
    }

    const publishedCount = contents?.filter((c) => c.is_published).length ?? 0
    const totalQuestions = questions?.length ?? 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">コンテンツ管理</h1>
                <p className="text-sm text-muted-foreground mt-1">学習教材・確認テストの管理</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">公開コンテンツ</CardTitle>
                        <BookOpen className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">{publishedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">全{contents?.length ?? 0}件中</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">登録問題数</CardTitle>
                        <ClipboardList className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">{totalQuestions}</div>
                        <p className="text-xs text-muted-foreground mt-1">全コンテンツの問題合計</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">受講ユーザー数</CardTitle>
                        <Users className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">登録済みユーザー</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <BookOpen className="h-5 w-5" />
                        コンテンツ一覧
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {contents?.map((content) => {
                            const qCount = questionCountByContent[content.id] ?? 0
                            const pCount = passedCountByContent[content.id] ?? 0
                            const passRate = totalUsers > 0 ? Math.round((pCount / totalUsers) * 100) : 0

                            return (
                                <div key={content.id} className="flex items-center gap-4 py-3 px-4 rounded-lg border bg-white hover:border-[#0d3280]/30 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#0d3280]/10 text-[#0d3280] flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {content.order_index}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{content.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{content.description}</p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <ClipboardList className="h-3.5 w-3.5" />
                                            {qCount}問
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            合格率 {passRate}%
                                        </span>
                                        {content.is_published ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">公開中</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-400">非公開</Badge>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {!contents?.length && (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                コンテンツがありません。シードスクリプトを実行してください。
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
