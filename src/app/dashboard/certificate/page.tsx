import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function CertificatePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">修了証・バッジ</h1>
                <p className="text-sm text-muted-foreground mt-1">取得済みの修了証とバッジ</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <Award className="h-5 w-5" />
                        取得状況
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">実装予定</p>
                </CardContent>
            </Card>
        </div>
    )
}
