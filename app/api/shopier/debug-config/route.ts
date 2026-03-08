import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/shopier/debug-config
 * 
 * Auth-protected debug endpoint.
 * Returns boolean visibility of all Shopier-related env vars.
 * NEVER exposes actual values.
 */
export async function GET(req: Request) {
    try {
        // Auth check
        const { createServerClient } = await import('@supabase/ssr');
        const { cookies } = await import('next/headers');
        const cookieStore = cookies();

        const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
        const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json({ ok: false, error: 'Supabase env missing' }, { status: 500 });
        }

        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { }
                },
            },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ ok: false, error: 'Giriş gerekli' }, { status: 401 });
        }

        // Env visibility map — only booleans, never values
        const envSeen: Record<string, boolean> = {
            // Supabase
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,

            // Shopier – API
            SHOPIER_API_KEY: !!process.env.SHOPIER_API_KEY,
            SHOPIER_API_SECRET: !!process.env.SHOPIER_API_SECRET,
            SHOPIER_API_TOKEN: !!process.env.SHOPIER_API_TOKEN,
            SHOPIER_API_TOKEN_SECRET: !!process.env.SHOPIER_API_TOKEN_SECRET,

            // Shopier – OSB Callback
            SHOPIER_OSB_KEY: !!process.env.SHOPIER_OSB_KEY,
            SHOPIER_OSB_USERNAME: !!process.env.SHOPIER_OSB_USERNAME,

            // Shopier – Product URLs (eski yöntem)
            SHOPIER_PRO_MONTHLY_URL: !!process.env.SHOPIER_PRO_MONTHLY_URL,
            SHOPIER_PRO_YEARLY_URL: !!process.env.SHOPIER_PRO_YEARLY_URL,

            // Site
            NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
            NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,

            // E-mail
            RESEND_API_KEY: !!process.env.RESEND_API_KEY,
            MAIL_FROM: !!process.env.MAIL_FROM,

            // Marketplace
            MARKETPLACE_SECRET_KEY: !!process.env.MARKETPLACE_SECRET_KEY,
        };

        // Resolved values used by create-order (what would actually be used)
        const resolved = {
            apiKey_source: process.env.SHOPIER_API_KEY ? 'SHOPIER_API_KEY' : process.env.SHOPIER_API_TOKEN ? 'SHOPIER_API_TOKEN' : 'NONE',
            apiSecret_source: process.env.SHOPIER_API_SECRET ? 'SHOPIER_API_SECRET' : process.env.SHOPIER_API_TOKEN_SECRET ? 'SHOPIER_API_TOKEN_SECRET' : process.env.SHOPIER_OSB_KEY ? 'SHOPIER_OSB_KEY' : 'NONE',
            siteUrl_source: process.env.NEXT_PUBLIC_SITE_URL ? 'NEXT_PUBLIC_SITE_URL' : process.env.NEXT_PUBLIC_APP_URL ? 'NEXT_PUBLIC_APP_URL' : 'fallback(karnet.com)',
        };

        const host = req.headers.get('host') || 'unknown';
        const vercelEnv = process.env.VERCEL_ENV ?? null;

        return NextResponse.json({
            ok: true,
            host,
            vercel_env: vercelEnv,
            env_seen: envSeen,
            resolved,
            user_id: user.id,
            timestamp: new Date().toISOString(),
        });

    } catch (err: any) {
        console.error('[debug-config] error:', err?.message);
        return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
    }
}
