import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, Award, ClipboardList } from "lucide-react"

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, department")
        .eq("id", user!.id)
        .single()

    return (
        <div className="space-y-6">
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">学習コンテンツ</CardTitle>
                        <BookOpen className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">受講済み / 全体</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">テスト結果</CardTitle>
                        <ClipboardList className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">最新スコア</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">合格状況</CardTitle>
                        <CheckCircle className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-400">未受験</div>
                        <p className="text-xs text-muted-foreground mt-1">合格ライン 80点</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">バッジ</CardTitle>
                        <Award className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-400">未取得</div>
                        <p className="text-xs text-muted-foreground mt-1">全体合格で取得</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base text-[#0d3280]">学習コンテンツ一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Supabase接続後にコンテンツが表示されます</p>
                </CardContent>
            </Card>
        </div>
    )
}
