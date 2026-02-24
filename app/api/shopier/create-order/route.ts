import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server-client';
import { supabaseAdmin } from '@/lib/supabase-server-client';
import { generateShopierForm } from '@/lib/shopier';
import { getPlanAmount, PlanId } from '@/config/pricing';

export async function POST(req: Request) {
    try {
        // 1. Auth check
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
        }

        // 2. Parse body
        const body = await req.json();
        const plan = body.plan as PlanId;

        if (plan !== 'pro_monthly' && plan !== 'pro_yearly') {
            return NextResponse.json({ error: 'Geçersiz plan türü.' }, { status: 400 });
        }

        // 3. Generate unique order ID
        const providerOrderId = crypto.randomUUID();
        const amount = getPlanAmount(plan);

        // 4. Insert payment record (status = created)
        const { error: insertError } = await supabaseAdmin
            .from('payments')
            .insert({
                user_id: user.id,
                plan,
                amount_try: amount,
                status: 'created',
                provider: 'shopier',
                provider_order_id: providerOrderId,
            });

        if (insertError) {
            console.error('[create-order] DB insert error:', insertError);
            return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
        }

        // 5. Get user profile for buyer info
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single();

        const buyerEmail = profile?.email || user.email;
        const nameParts = buyerEmail.split('@')[0].split('.');
        const firstName = nameParts[0] || 'Müşteri';
        const lastName = nameParts[1] || 'Karnet';

        // 6. Generate Shopier form HTML
        const productName = plan === 'pro_monthly'
            ? 'Kârnet Pro - Aylık Abonelik'
            : 'Kârnet Pro - Yıllık Abonelik';

        const formHtml = generateShopierForm({
            platformOrderId: providerOrderId,
            productName,
            totalAmount: amount,
            currency: 0, // TRY
            buyer: {
                name: firstName,
                surname: lastName,
                email: buyerEmail,
                phone: '05000000000',
                address: 'Türkiye',
                city: 'İstanbul',
                country: 'TR',
                postcode: '34000',
            },
        });

        // Return HTML that auto-submits to Shopier
        return new Response(formHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });

    } catch (error: any) {
        console.error('[create-order] Error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
