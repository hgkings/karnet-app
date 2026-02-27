import { NextResponse } from 'next/server';
import { getPlanAmount, PlanId } from '@/config/pricing';

export const dynamic = 'force-dynamic';

// GET → redirect to pricing (prevent 405)
export async function GET() {
    return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'https://xn--krnet-3qa.com'));
}

export async function POST(req: Request) {
    console.log('[create-order] POST hit');

    try {
        // 1. Env guards
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const shopierMonthlyUrl = process.env.SHOPIER_PRO_MONTHLY_URL;
        const shopierYearlyUrl = process.env.SHOPIER_PRO_YEARLY_URL;

        if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
            console.error('[create-order] Missing Supabase env');
            return NextResponse.json({ error: 'Sunucu yapılandırması eksik.' }, { status: 500 });
        }
        if (!shopierMonthlyUrl || !shopierYearlyUrl) {
            console.error('[create-order] Missing Shopier URLs');
            return NextResponse.json({ error: 'Ödeme yapılandırması eksik.' }, { status: 500 });
        }

        // 2. Auth check
        const { createServerClient } = await import('@supabase/ssr');
        const { cookies } = await import('next/headers');

        const cookieStore = cookies();
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
            console.error('[create-order] Auth failed:', authError?.message);
            return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
        }

        console.log('[create-order] user', { userId: user.id, email: user.email });

        // 3. Parse body
        const body = await req.json();
        const plan = body.plan as PlanId;

        if (plan !== 'pro_monthly' && plan !== 'pro_yearly') {
            return NextResponse.json({ error: 'Geçersiz plan türü.' }, { status: 400 });
        }

        // 4. Generate unique orderId (numeric, 12 digits — Shopier-friendly)
        const orderId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
        const amount = getPlanAmount(plan);

        console.log('[create-order] orderId', { orderId, plan, amount });

        // 5. Insert payment with service role
        const adminClient = createServerClient(supabaseUrl, supabaseServiceKey, {
            cookies: { getAll: () => [], setAll: () => { } },
        });

        const { data: payment, error: insertError } = await adminClient
            .from('payments')
            .insert({
                user_id: user.id,
                plan,
                amount_try: amount,
                status: 'created',
                provider: 'shopier',
                provider_order_id: orderId,
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('[create-order] DB insert error:', insertError.message);
            return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
        }

        console.log('[create-order] payment inserted', { paymentId: payment?.id, orderId, userId: user.id, plan });

        // 6. Build Shopier URL with our orderId as ref parameter
        const baseUrl = plan === 'pro_monthly' ? shopierMonthlyUrl : shopierYearlyUrl;
        const redirectUrl = baseUrl;

        console.log('[create-order] redirecting to', redirectUrl);

        return NextResponse.json({ redirectUrl, orderId });

    } catch (error: any) {
        console.error('[create-order] Error:', error?.message);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
