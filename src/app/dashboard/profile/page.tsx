import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">プロフィール</h1>
                <p className="text-sm text-muted-foreground mt-1">アカウント情報</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <User className="h-5 w-5" />
                        アカウント情報
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">実装予定</p>
                </CardContent>
            </Card>
        </div>
    )
}
