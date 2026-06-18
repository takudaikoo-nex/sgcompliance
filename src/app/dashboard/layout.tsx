import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserHeader } from "@/components/user/Header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, department")
        .eq("id", user.id)
        .single()

    return (
        <div className="min-h-screen bg-slate-50">
            <UserHeader profile={profile ?? { full_name: null, email: user.email ?? null, department: null }} />
            <main className="container py-8">
                {children}
            </main>
        </div>
    )
}
