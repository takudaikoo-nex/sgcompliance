import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">成績分析</h1>
                <p className="text-sm text-muted-foreground mt-1">部門別・ユーザー別の受講状況と得点分析</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <BarChart3 className="h-5 w-5" />
                        分析データ
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">実装予定</p>
                </CardContent>
            </Card>
        </div>
    )
}
