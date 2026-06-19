import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { QuizClient } from "@/components/quiz/QuizClient"

export const dynamic = "force-dynamic"

export default async function QuizPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/auth/login")

    const [{ data: content }, { data: questions }, { data: attempts }] = await Promise.all([
        supabase.from("contents").select("id, title, order_index").eq("id", params.id).eq("is_published", true).single(),
        supabase.from("questions").select("id, question_text, options, order_index").eq("content_id", params.id).order("order_index"),
        supabase.from("exam_attempts").select("attempt_number, score, passed").eq("user_id", user.id).eq("content_id", params.id).order("attempt_number"),
    ])

    if (!content) notFound()

    const attemptCount = attempts?.length ?? 0
    const alreadyPassed = attempts?.some((a) => a.passed) ?? false

    return (
        <div className="space-y-4">
            <Link href={`/dashboard/learn/${params.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#0d3280]">
                <ChevronLeft className="h-4 w-4" />
                {content.title}
            </Link>

            <QuizClient
                contentId={content.id}
                contentTitle={content.title}
                questions={(questions ?? []).map((q) => ({
                    id: q.id,
                    question_text: q.question_text,
                    options: q.options as { id: string; text: string }[],
                    order_index: q.order_index,
                }))}
                attemptCount={attemptCount}
                alreadyPassed={alreadyPassed}
                previousAttempts={attempts ?? []}
            />
        </div>
    )
}
