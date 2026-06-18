import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({ name, value, ...options })
                        response = NextResponse.next({ request: { headers: request.headers } })
                        response.cookies.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({ name, value: '', ...options })
                        response = NextResponse.next({ request: { headers: request.headers } })
                        response.cookies.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // Admin area protection
        if (request.nextUrl.pathname.startsWith('/admin')) {
            if (!user) {
                return NextResponse.redirect(new URL('/auth/login', request.url))
            }
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            if (!profile || profile.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        // Dashboard protection
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            if (!user) {
                return NextResponse.redirect(new URL('/auth/login', request.url))
            }
        }

        // Redirect logged-in users away from login/top
        if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth/login') {
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                if (profile?.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
                } else {
                    return NextResponse.redirect(new URL('/dashboard', request.url))
                }
            }
        }
    } catch {
        // Supabase接続エラー時はリクエストをそのまま通す
        return response
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
