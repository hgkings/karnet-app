import { NextRequest, NextResponse } from 'next/server';
import { prepareSyncContext, writeSyncLog } from '@/lib/marketplace-sync-helpers';
import { fetchAllOrders } from '@/lib/hepsiburada-api';

export const dynamic = 'force-dynamic';

const DEFAULT_DAYS_BACK = 30;

export async function GET(request: NextRequest) {
    const startedAt = new Date().toISOString();

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

        await writeSyncLog(ctx.admin, ctx.connectionId, 'orders', 'running', 'Hepsiburada sipariş senkronizasyonu başladı...', startedAt);

        const orders = await fetchAllOrders(
            {
                apiKey: ctx.credentials.apiKey,
                apiSecret: ctx.credentials.apiSecret,
                merchantId: ctx.sellerId,
            },
            startDate,
            now
        );

        let syncedCount = 0;

        for (const order of orders) {
            const siparisNo = String(order.siparisNo || order.orderNumber || '');
            if (!siparisNo) continue;

            await ctx.admin
                .from('hb_orders')
                .upsert(
                    {
                        user_id: ctx.userId,
                        connection_id: ctx.connectionId,
                        siparis_no: siparisNo,
                        siparis_tarihi: order.siparisTarihi || null,
                        musteri_adi: order.musteriAdi || null,
                        status: order.status || null,
                        raw_json: order,
                    },
                    { onConflict: 'siparis_no,user_id' }
                );

            syncedCount++;
        }

        await ctx.admin
            .from('marketplace_connections')
            .update({ last_sync_at: new Date().toISOString(), status: 'connected' })
            .eq('id', ctx.connectionId);

        const message = `${syncedCount} sipariş senkronize edildi (son ${gun} gün).`;
        await writeSyncLog(ctx.admin, ctx.connectionId, 'orders', 'success', message, startedAt, new Date().toISOString());

        return NextResponse.json({
            success: true,
            syncedCount,
            orders,
            message,
        });
    } catch (err: any) {
        console.error('[marketplace/hepsiburada/sync-orders] Error:', err?.message);

        try {
            const { ctx } = await prepareSyncContext(undefined, 'hepsiburada');
            if (ctx) {
                await writeSyncLog(ctx.admin, ctx.connectionId, 'orders', 'failed', `Hata: ${err?.message || 'Bilinmeyen'}`, startedAt, new Date().toISOString());
                await ctx.admin.from('marketplace_connections').update({ status: 'error' }).eq('id', ctx.connectionId);
            }
        } catch { /* ignore logging errors */ }

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
