import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Sadece genel durum bilgisi — hassas detaylar gizli
    const sha = process.env.VERCEL_GIT_COMMIT_SHA
    return NextResponse.json({
        version: '2.0.0',
        sha: sha ? sha.slice(0, 7) : 'local', // Sadece ilk 7 karakter
        status: 'ok',
    });
}
