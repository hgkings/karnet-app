import { NextResponse } from 'next/server';
import { prepareSyncContext, writeSyncLog } from '@/lib/marketplace-sync-helpers';
import { fetchAllProducts } from '@/lib/hepsiburada-api';

export const dynamic = 'force-dynamic';

export async function GET() {
    const startedAt = new Date().toISOString();

    try {
        const { ctx, error, status } = await prepareSyncContext(undefined, 'hepsiburada');
        if (!ctx) {
            return NextResponse.json(
                { success: false, error: error || 'Hepsiburada hesabı bağlı değil' },
                { status }
            );
        }

        await writeSyncLog(ctx.admin, ctx.connectionId, 'products', 'running', 'Hepsiburada ürün senkronizasyonu başladı...', startedAt);

        const { items, totalCount } = await fetchAllProducts({
            apiKey: ctx.credentials.apiKey,
            apiSecret: ctx.credentials.apiSecret,
            merchantId: ctx.sellerId,
        });

        let syncedCount = 0;

        for (const product of items) {
            const productId = String(product.hepsiburadaSku || product.merchantSku || '');
            if (!productId) continue;

            await ctx.admin
                .from('hb_products')
                .upsert(
                    {
                        user_id: ctx.userId,
                        connection_id: ctx.connectionId,
                        hepsiburada_sku: product.hepsiburadaSku || null,
                        merchant_sku: product.merchantSku || null,
                        title: product.urunAdi || 'İsimsiz',
                        price: product.fiyat ?? null,
                        stock: product.stok ?? null,
                        raw_json: product,
                    },
                    { onConflict: 'hepsiburada_sku,user_id' }
                );

            syncedCount++;
        }

        await ctx.admin
            .from('marketplace_connections')
            .update({ last_sync_at: new Date().toISOString(), status: 'connected' })
            .eq('id', ctx.connectionId);

        const message = `${syncedCount} ürün senkronize edildi.`;
        await writeSyncLog(ctx.admin, ctx.connectionId, 'products', 'success', message, startedAt, new Date().toISOString());

        return NextResponse.json({
            success: true,
            syncedCount,
            products: items,
            message,
        });
    } catch (err: any) {
        console.error('[marketplace/hepsiburada/sync-products] Error:', err?.message);

        try {
            const { ctx } = await prepareSyncContext(undefined, 'hepsiburada');
            if (ctx) {
                await writeSyncLog(ctx.admin, ctx.connectionId, 'products', 'failed', `Hata: ${err?.message || 'Bilinmeyen'}`, startedAt, new Date().toISOString());
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
