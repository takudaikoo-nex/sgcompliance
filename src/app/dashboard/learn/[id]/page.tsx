import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ClipboardList, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { markContentViewed } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function ContentPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/auth/login")

    const [{ data: content }, { data: allContents }, { data: attempts }, { data: progress }] = await Promise.all([
        supabase.from("contents").select("*").eq("id", params.id).eq("is_published", true).single(),
        supabase.from("contents").select("id, order_index").eq("is_published", true).order("order_index"),
        supabase.from("exam_attempts").select("attempt_number, score, passed").eq("user_id", user.id).eq("content_id", params.id).order("attempt_number"),
        supabase.from("content_progress").select("completed").eq("user_id", user.id).eq("content_id", params.id).maybeSingle(),
    ])

    if (!content) notFound()

    // 閲覧記録
    await markContentViewed(params.id)

    const currentIndex = allContents?.findIndex((c) => c.id === params.id) ?? -1
    const prevContent = currentIndex > 0 ? allContents?.[currentIndex - 1] : null
    const nextContent = currentIndex < (allContents?.length ?? 0) - 1 ? allContents?.[currentIndex + 1] : null

    const attemptCount = attempts?.length ?? 0
    const passed = attempts?.some((a) => a.passed) ?? false
    const remainingAttempts = Math.max(0, 3 - attemptCount)
    const bestScore = attempts?.length ? Math.max(...attempts.map((a) => a.score)) : null

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* ヘッダー */}
            <div>
                <Link href="/dashboard/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#0d3280] mb-4">
                    <ChevronLeft className="h-4 w-4" />
                    学習コンテンツ一覧
                </Link>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">#{String(content.order_index).padStart(2, "0")}</p>
                        <h1 className="text-2xl font-bold text-[#0d3280] mt-1">{content.title}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
                    </div>
                    {passed && <Badge className="bg-green-100 text-green-700 border-green-200 flex-shrink-0">合格済み</Badge>}
                </div>
            </div>

            {/* 本文 */}
            <div className="prose prose-slate max-w-none bg-white rounded-xl border p-6 md:p-8 shadow-sm">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({ src, alt }) => {
                            if (!src) return null
                            const isThumbnail = src.includes("_thumbnail")
                            return (
                                <div className={`my-4 rounded-lg overflow-hidden relative ${isThumbnail ? "aspect-video" : "aspect-[4/3]"}`}>
                                    <Image
                                        src={src}
                                        alt={alt ?? ""}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 720px"
                                    />
                                </div>
                            )
                        },
                    }}
                >
                    {content.body ?? ""}
                </ReactMarkdown>
            </div>

            {/* 確認テストカード */}
            <Card className={`border-2 ${passed ? "border-green-200 bg-green-50/40" : "border-[#0d3280]/20"}`}>
                <CardContent className="py-5 px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {passed ? (
                                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                            ) : attemptCount >= 3 ? (
                                <XCircle className="h-8 w-8 text-red-400 flex-shrink-0" />
                            ) : (
                                <ClipboardList className="h-8 w-8 text-[#0d3280] flex-shrink-0" />
                            )}
                            <div>
                                <p className="font-semibold text-slate-800">確認テスト</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {passed
                                        ? `合格 — 最高スコア ${bestScore}点`
                                        : attemptCount === 0
                                        ? "5問・合格ライン80点・最大3回受験"
                                        : `${attemptCount}回受験済 — 残り${remainingAttempts}回 / 最高スコア ${bestScore}点`}
                                </p>
                            </div>
                        </div>
                        {!passed && remainingAttempts > 0 && (
                            <Link href={`/dashboard/learn/${params.id}/quiz`}>
                                <Button className="bg-[#0d3280] hover:bg-[#0a2560] flex-shrink-0">
                                    {attemptCount === 0 ? "テストを受ける" : "再受験する"}
                                </Button>
                            </Link>
                        )}
                        {passed && (
                            <Link href={`/dashboard/learn/${params.id}/quiz`}>
                                <Button variant="outline" className="border-green-300 text-green-700 flex-shrink-0">結果を確認</Button>
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 前後ナビゲーション */}
            <div className="flex items-center justify-between">
                {prevContent ? (
                    <Link href={`/dashboard/learn/${prevContent.id}`}>
                        <Button variant="outline" className="gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            前の教材
                        </Button>
                    </Link>
                ) : <div />}
                {nextContent ? (
                    <Link href={`/dashboard/learn/${nextContent.id}`}>
                        <Button variant="outline" className="gap-1">
                            次の教材
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Link href="/dashboard/learn">
                        <Button variant="outline">一覧に戻る</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}
