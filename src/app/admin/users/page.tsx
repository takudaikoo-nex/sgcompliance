import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">ユーザー管理</h1>
                <p className="text-sm text-muted-foreground mt-1">受講者・管理者のアカウント管理</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <Users className="h-5 w-5" />
                        ユーザー一覧
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">実装予定</p>
                </CardContent>
            </Card>
        </div>
    )
}
