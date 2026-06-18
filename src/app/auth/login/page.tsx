"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Lock, Mail, ShieldAlert } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg(null)

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
            if (signInError) throw signInError

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("ユーザー情報の取得に失敗しました")

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (profile?.role === "admin") {
                router.push("/admin/dashboard")
            } else {
                router.push("/dashboard")
            }
            router.refresh()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "ログインに失敗しました"
            setErrorMsg(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/logo.png"
                        alt="SMARTGOLF"
                        width={240}
                        height={60}
                        priority
                        className="mb-6"
                    />
                    <h1 className="text-xl font-bold text-[#0d3280]">コンプライアンス学習システム</h1>
                    <p className="text-sm text-muted-foreground mt-1">ログインしてください</p>
                </div>

                <Card className="border-slate-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-center text-lg text-[#0d3280]">ログイン</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {errorMsg && (
                            <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@smartgolf.co.jp"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#0d3280] hover:bg-[#092460] text-white"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                ログイン
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
