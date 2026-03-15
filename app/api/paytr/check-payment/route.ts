import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json({ error: 'paymentId gerekli' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceKey) {
            return NextResponse.json({ error: 'Config eksik' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceKey);

        // Ödeme kaydını bul
        const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .single();

        if (!payment) {
            return NextResponse.json({ error: 'Ödeme bulunamadı' }, { status: 404 });
        }

        // Zaten ödenmiş mi?
        if (payment.status === 'paid') {
            return NextResponse.json({ isPro: true, source: 'db' });
        }

        // PayTR Link API durum-sorgu Link API callback_id'lerini desteklemiyor.
        // Pro aktivasyonu yalnızca callback route üzerinden gerçekleşir.
        console.log('[PayTR Check] payment.status:', payment.status, 'provider_order_id:', payment.provider_order_id);
        return NextResponse.json({ isPro: false, paymentStatus: payment.status });

    } catch (error: any) {
        console.error('[PayTR Check] Hata:', error?.message || error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}
