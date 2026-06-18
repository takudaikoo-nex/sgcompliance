"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    BookOpen,
    ClipboardList,
    ShieldCheck,
} from "lucide-react"

const navItems = [
    { href: "/admin/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/admin/content", label: "コンテンツ管理", icon: BookOpen },
    { href: "/admin/quiz", label: "テスト管理", icon: ClipboardList },
    { href: "/admin/users", label: "ユーザー管理", icon: Users },
    { href: "/admin/analytics", label: "成績分析", icon: BarChart3 },
    { href: "/admin/settings", label: "設定", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/login")
        router.refresh()
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white shadow-sm">
            <div className="flex h-16 items-center border-b px-4">
                <Link href="/admin/dashboard">
                    <Image src="/images/logo.png" alt="SMARTGOLF" width={160} height={40} priority />
                </Link>
            </div>
            <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0d3280]" />
                    <span className="font-medium text-[#0d3280]">管理者メニュー</span>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="grid gap-1 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100",
                                        isActive
                                            ? "bg-[#0d3280] text-white hover:bg-[#092460]"
                                            : "text-slate-600"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <div className="border-t p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
                >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                </button>
            </div>
        </div>
    )
}
