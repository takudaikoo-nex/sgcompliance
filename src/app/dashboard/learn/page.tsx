import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ChevronRight, BookOpen, ClipboardList } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LearnPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: contents }, { data: progress }, { data: passedAttempts }] = await Promise.all([
        supabase.from("contents").select("id, title, description, order_index").eq("is_published", true).order("order_index"),
        supabase.from("content_progress").select("content_id, completed").eq("user_id", user!.id),
        supabase.from("exam_attempts").select("content_id").eq("user_id", user!.id).eq("passed", true),
    ])

    const completedSet = new Set(progress?.filter((p) => p.completed).map((p) => p.content_id) ?? [])
    const viewedSet = new Set(progress?.map((p) => p.content_id) ?? [])
    const passedSet = new Set(passedAttempts?.map((a) => a.content_id) ?? [])

    const totalCount = contents?.length ?? 0
    const passedCount = passedSet.size

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0d3280]">学習コンテンツ</h1>
                    <p className="text-sm text-muted-foreground mt-1">コンプライアンス研修の教材一覧（全{totalCount}項目）</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-[#0d3280]">{passedCount} <span className="text-base font-normal text-muted-foreground">/ {totalCount} 合格</span></p>
                </div>
            </div>

            <div className="space-y-2">
                {contents?.map((content) => {
                    const passed = passedSet.has(content.id)
                    const viewed = viewedSet.has(content.id)

                    return (
                        <Link key={content.id} href={`/dashboard/learn/${content.id}`}>
                            <Card className={`transition-all hover:shadow-md hover:border-[#0d3280]/30 cursor-pointer ${passed ? "border-green-200 bg-green-50/30" : ""}`}>
                                <CardContent className="flex items-center gap-4 py-4 px-5">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                        {passed ? (
                                            <CheckCircle className="h-7 w-7 text-green-500" />
                                        ) : (
                                            <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${viewed ? "border-[#0d3280]/40 text-[#0d3280]/60" : "border-slate-200 text-slate-400"}`}>
                                                {content.order_index}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">#{String(content.order_index).padStart(2, "0")}</span>
                                            <p className={`font-medium truncate ${passed ? "text-green-700" : "text-slate-800"}`}>
                                                {content.title}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{content.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {passed ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">合格</Badge>
                                        ) : viewed ? (
                                            <Badge variant="outline" className="text-[#0d3280] border-[#0d3280]/30">学習中</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-400">未学習</Badge>
                                        )}
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {!contents?.length && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-muted-foreground">コンテンツが登録されていません</p>
                        <p className="text-xs text-muted-foreground mt-1">管理者がコンテンツを追加するまでお待ちください</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
