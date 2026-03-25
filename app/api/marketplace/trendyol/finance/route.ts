import { NextRequest, NextResponse } from 'next/server';
import { prepareSyncContext } from '@/lib/marketplace-sync-helpers';
import { getSellerSettlements } from '@/lib/trendyol-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { ctx, error, status } = await prepareSyncContext();
        if (!ctx) {
            return NextResponse.json({ error }, { status });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate')
            ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = searchParams.get('endDate')
            ?? new Date().toISOString().split('T')[0];

        const data = await getSellerSettlements(ctx.credentials, startDate, endDate);

        return NextResponse.json({
            success: true,
            data,
            toplam: data.length,
        });
    } catch (err: any) {
        console.error('[marketplace/trendyol/finance] Error:', err?.message);
        return NextResponse.json(
            { error: err?.message || 'Finans verileri alınamadı.' },
            { status: 500 }
        );
    }
}
