import { NextRequest, NextResponse } from 'next/server';
import { prepareSyncContext } from '@/lib/marketplace-sync-helpers';
import { getFinanceRecords } from '@/lib/hepsiburada-api';

export const dynamic = 'force-dynamic';

const DEFAULT_DAYS_BACK = 30;

export async function GET(request: NextRequest) {
    try {
        const { ctx, error, status } = await prepareSyncContext(undefined, 'hepsiburada');
        if (!ctx) {
            return NextResponse.json(
                { success: false, error: error || 'Hepsiburada hesabı bağlı değil' },
                { status }
            );
        }

        const { searchParams } = new URL(request.url);
        const gun = Number(searchParams.get('gun') ?? DEFAULT_DAYS_BACK);

        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - gun);

        const { records, toplamlar } = await getFinanceRecords(
            {
                apiKey: ctx.credentials.apiKey,
                apiSecret: ctx.credentials.apiSecret,
                merchantId: ctx.sellerId,
            },
            startDate,
            now
        );

        return NextResponse.json({
            success: true,
            records,
            toplamlar,
            aralik: `Son ${gun} gün`,
        });
    } catch (err: any) {
        console.error('[marketplace/hepsiburada/finance] Error:', err?.message);

        if (err?.message?.includes('Kimlik bilgileri hatalı')) {
            return NextResponse.json({ success: false, error: 'Kimlik bilgileri hatalı' }, { status: 401 });
        }
        if (err?.message?.includes('rate limit') || err?.message?.includes('429')) {
            return NextResponse.json({ success: false, error: 'İstek limiti aşıldı, bekleyin' }, { status: 429 });
        }

        return NextResponse.json(
            { success: false, error: 'Bir hata oluştu', detail: err?.message },
            { status: 500 }
        );
    }
}
