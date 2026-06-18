"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon, BookOpen, LayoutDashboard, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Profile = {
    full_name: string | null
    email: string | null
    department: string | null
}

export function UserHeader({ profile }: { profile: Profile }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container flex h-16 items-center gap-6">
                <Link href="/dashboard">
                    <Image src="/images/logo.png" alt="SMARTGOLF" width={140} height={35} priority />
                </Link>

                <nav className="flex items-center gap-1 text-sm font-medium">
                    <Link href="/dashboard" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0d3280]">
                        <LayoutDashboard className="h-4 w-4" />
                        ホーム
                    </Link>
                    <Link href="/dashboard/learn" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0d3280]">
                        <BookOpen className="h-4 w-4" />
                        学習コンテンツ
                    </Link>
                    <Link href="/dashboard/certificate" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0d3280]">
                        <Award className="h-4 w-4" />
                        修了証・バッジ
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-700">{profile.full_name || "ユーザー"}</p>
                        {profile.department && (
                            <p className="text-xs text-muted-foreground">{profile.department}</p>
                        )}
                    </div>
                    <Link href="/dashboard/profile">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-[#0d3280]/10 text-[#0d3280]">
                            <UserIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8 text-slate-400 hover:text-red-500">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
