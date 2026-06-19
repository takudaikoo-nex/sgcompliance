"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function markContentViewed(contentId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("content_progress").upsert(
        { user_id: user.id, content_id: contentId, completed: false },
        { onConflict: "user_id,content_id", ignoreDuplicates: true }
    )
}

export async function submitQuizAttempt(
    contentId: string,
    answers: Record<string, string>
): Promise<{ score: number; total: number; passed: boolean; attemptNumber: number; correctAnswers: Record<string, string> } | { error: string }> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "ログインが必要です" }

    // 既存の受験回数を確認
    const { data: attempts } = await supabase
        .from("exam_attempts")
        .select("id, passed")
        .eq("user_id", user.id)
        .eq("content_id", contentId)
        .order("attempt_number", { ascending: true })

    const attemptCount = attempts?.length ?? 0
    if (attemptCount >= 3) return { error: "受験回数の上限（3回）に達しています" }

    const alreadyPassed = attempts?.some((a) => a.passed) ?? false
    if (alreadyPassed) return { error: "このテストはすでに合格しています" }

    // 問題を取得
    const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, correct_answer")
        .eq("content_id", contentId)

    if (qErr || !questions) return { error: "問題の取得に失敗しました" }

    // 採点
    const correctAnswers: Record<string, string> = {}
    let correct = 0
    for (const q of questions) {
        correctAnswers[q.id] = q.correct_answer
        if (answers[q.id] === q.correct_answer) correct++
    }
    const total = questions.length
    const score = Math.round((correct / total) * 100)
    const passed = score >= 80
    const attemptNumber = attemptCount + 1

    // 結果を保存
    await supabase.from("exam_attempts").insert({
        user_id: user.id,
        content_id: contentId,
        attempt_number: attemptNumber,
        score,
        total_questions: total,
        passed,
        answers,
        finished_at: new Date().toISOString(),
    })

    // 合格したら進捗を完了に更新
    if (passed) {
        await supabase.from("content_progress").upsert(
            { user_id: user.id, content_id: contentId, completed: true, completed_at: new Date().toISOString() },
            { onConflict: "user_id,content_id" }
        )
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/learn")
    }

    return { score, total, passed, attemptNumber, correctAnswers }
}
