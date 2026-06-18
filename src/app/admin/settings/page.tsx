import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0d3280]">設定</h1>
                <p className="text-sm text-muted-foreground mt-1">システム設定</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-[#0d3280]">
                        <Settings className="h-5 w-5" />
                        システム設定
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">実装予定</p>
                </CardContent>
            </Card>
        </div>
    )
}
