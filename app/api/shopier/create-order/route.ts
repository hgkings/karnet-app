import { NextResponse } from 'next/server';
import { getPlanAmount, PlanId } from '@/config/pricing';
import { Shopier, Buyer, Address, ProductType, AutoSubmitFormRenderer } from 'shopier';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    console.log('[create-order] POST hit');

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        const apiKey = process.env.SHOPIER_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmNDRiYmZmOTExZTNlZWE4YTFmN2ZlNTVlOTI1MDRlYSIsImp0aSI6IjNmZjdhNDlmNmU1ZGY5NjhkYmJkZTJiMzFiNDdmMGIwN2M2NzI0NzA4OTdmYWFjMWI5ZTAwZWY2NmU1YzI5NTYxMTM5NjJkZTkwMTE5ODU3OWJhODljZWU0ZjA5NDM4MjY5ZjYzN2ViMDQ1ZmU1YzA2YTZlODhkZGQ4NjFmOGUxNDBkYzZmZDc1ZWUwOGQ3NjQ3ZTg0NDM5M2ZhOTlkOTYiLCJpYXQiOjE3NzI0ODQwMDcsIm5iZiI6MTc3MjQ4NDAwNywiZXhwIjoxOTMwMjY4NzY3LCJzdWIiOiI4MTY0NDEiLCJzY29wZXMiOlsib3JkZXJzOnJlYWQiLCJvcmRlcnM6d3JpdGUiLCJwcm9kdWN0czpyZWFkIiwicHJvZHVjdHM6d3JpdGUiLCJzaGlwcGluZ3M6cmVhZCIsInNoaXBwaW5nczp3cml0ZSIsImRpc2NvdW50czpyZWFkIiwiZGlzY291bnRzOndyaXRlIiwicGF5b3V0czpyZWFkIiwicmVmdW5kczpyZWFkIiwicmVmdW5kczp3cml0ZSIsInNob3A6cmVhZCIsInNob3A6d3JpdGUiXX0.l2D_YDyUSm-hYMNmqxl8ZFnbC3pfqAe3XElIY2A6UjY4WZHSoityepEKFi9WZsTPH-RQxNptWuDBB1Qid4TEf6YP4_u7wrUNTpcNBxuu6MZgFV8wj2TCrLPi3R53SOx-5ABND0RF9o1SgCC6nmDPlr7lBngTiRQISOZGOiXR_ARizGOeOyxcfdoVl35S3J47l-1hDT0U6D3FBJPfs1kDw0aRKsKsS-KIb0eiYumN5Vhoq7LLh3dBlpKTbP3HvqlYL5-G8R_9LMW1ydZmj4axE_1aTM0kekUUovKiXzcylftDwqImCQuae96RWXp74BXKQqauocOECX2O_H259_gsig';
        const apiSecret = process.env.SHOPIER_API_SECRET || '6f0a13e0a08fdb6e30355cf0694b41b3';

        if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
            return NextResponse.json({ error: 'Sunucu yapılandırması eksik.' }, { status: 500 });
        }

        // Auth
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
            return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
        }

        // Parse body
        const body = await req.json();
        const plan = body.plan as PlanId;
        if (plan !== 'pro_monthly' && plan !== 'pro_yearly') {
            return NextResponse.json({ error: 'Geçersiz plan.' }, { status: 400 });
        }

        const amount = getPlanAmount(plan);

        // Insert payment
        const admin = createServerClient(supabaseUrl, serviceKey, {
            cookies: { getAll: () => [], setAll: () => { } },
        });

        const { data: payment, error: insertErr } = await admin
            .from('payments')
            .insert({
                user_id: user.id,
                plan,
                amount_try: amount,
                status: 'pending',
                provider: 'shopier',
                provider_order_id: crypto.randomUUID(),
            })
            .select('id')
            .single();

        if (insertErr || !payment) {
            console.error('[create-order] insert error:', insertErr?.message);
            return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
        }

        const paymentId = payment.id;
        console.log('[create-order] Payment DB inserted:', paymentId);

        // API INTEGRATION
        const shopier = new Shopier(apiKey, apiSecret);

        // Setup buyer details
        const email = user.email || 'bilgi@karnet.com';
        const phone = user.user_metadata?.phone || '05555555555';
        const name = user.user_metadata?.first_name || 'Karnet';
        const surname = user.user_metadata?.last_name || 'Kullanıcısı';

        const buyer = new Buyer({
            id: user.id.substring(0, 10),
            name: name,
            surname: surname,
            email: email,
            phone: phone,
        });

        const address = new Address({
            address: 'Bilinmeyen Adres',
            city: 'İstanbul',
            country: 'Türkiye',
            postcode: '34000',
        });

        const params = shopier.getParams();
        params.setBuyer(buyer);
        params.setAddress(address);

        // Base domain (to create return url)
        const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://xn--krnet-3qa.com';
        const returnUrl = `${domain}/api/shopier/callback?paymentId=${paymentId}`;

        params.setOrderData(paymentId, amount.toString(), returnUrl);
        params.setProductData(
            plan === 'pro_monthly' ? 'Kârnet Pro Aylık' : 'Kârnet Pro Yıllık',
            ProductType.DEFAULT_TYPE
        );

        // Generate HTML with Shopier AutoSubmit Form
        const renderer = new AutoSubmitFormRenderer(shopier);
        const formHtml = shopier.goWith(renderer);

        return NextResponse.json({ formHtml, paymentId });

    } catch (error: any) {
        console.error('[create-order] error:', error?.message);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
