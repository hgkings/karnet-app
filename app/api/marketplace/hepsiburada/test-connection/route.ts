import { NextResponse } from 'next/server';
import { prepareSyncContext, writeSyncLog } from '@/lib/marketplace-sync-helpers';
import { testConnection } from '@/lib/hepsiburada-api';

export const dynamic = 'force-dynamic';

export async function GET() {
    const startedAt = new Date().toISOString();

    try {
        const { ctx, error, status } = await prepareSyncContext(undefined, 'hepsiburada');
        if (!ctx) {
            return NextResponse.json({ ok: false, message: error || 'Hepsiburada hesabı bağlı değil' }, { status });
        }

        const result = await testConnection({
            apiKey: ctx.credentials.apiKey,
            apiSecret: ctx.credentials.apiSecret,
            merchantId: ctx.sellerId,
        });

        await ctx.admin
            .from('marketplace_connections')
            .update({
                status: result.success ? 'connected' : 'error',
                last_sync_at: result.success ? new Date().toISOString() : undefined,
            })
            .eq('id', ctx.connectionId);

        await writeSyncLog(
            ctx.admin,
            ctx.connectionId,
            'test',
            result.success ? 'success' : 'failed',
            result.message,
            startedAt,
            new Date().toISOString()
        );

        return NextResponse.json({
            ok: result.success,
            message: result.message,
        });
    } catch (err: any) {
        console.error('[marketplace/hepsiburada/test-connection] Error:', err?.message);

        if (err?.message?.includes('Kimlik bilgileri hatalı')) {
            return NextResponse.json({ ok: false, message: 'Kimlik bilgileri hatalı' }, { status: 401 });
        }
        if (err?.message?.includes('rate limit') || err?.message?.includes('429')) {
            return NextResponse.json({ ok: false, message: 'İstek limiti aşıldı, bekleyin' }, { status: 429 });
        }

        return NextResponse.json(
            { ok: false, message: 'Bir hata oluştu', detail: err?.message },
            { status: 500 }
        );
    }
}
