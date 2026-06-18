import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Award, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">ダッシュボード</h1>
                <p className="text-sm text-muted-foreground mt-1">コンプライアンス学習の進捗状況</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">受講者数</CardTitle>
                        <Users className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">登録済みユーザー</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">受講完了率</CardTitle>
                        <BookOpen className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">全コンテンツ完了</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">合格者数</CardTitle>
                        <Award className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">テスト合格（80点以上）</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">平均スコア</CardTitle>
                        <TrendingUp className="h-4 w-4 text-[#0d3280]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0d3280]">—</div>
                        <p className="text-xs text-muted-foreground mt-1">全受講者の平均点</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base text-[#0d3280]">部門別進捗</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Supabase接続後にデータが表示されます</p>
                </CardContent>
            </Card>
        </div>
    )
}
