/**
 * Client-side helper to initiate Shopier checkout.
 * 
 * Calls POST /api/shopier/create-order → gets { redirectUrl }
 * Then redirects the browser to the Shopier product page.
 * 
 * VERSION: 2026-02-26-v2
 */
export async function startShopierCheckout(plan: 'pro_monthly' | 'pro_yearly'): Promise<void> {
    // Alert to prove this code is running (temporary debug)
    console.log('[shopier-client v2] ▶ START plan=' + plan);

    const url = '/api/shopier/create-order';

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
            credentials: 'same-origin',
        });
    } catch (networkErr: any) {
        console.error('[shopier-client v2] Network error:', networkErr);
        throw new Error('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    }

    console.log('[shopier-client v2] Response status:', res.status);

    if (!res.ok) {
        const errText = await res.text();
        console.error('[shopier-client v2] Error body:', errText);
        let errMsg = 'Ödeme başlatılamadı.';
        try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.error || errMsg;
        } catch { }
        throw new Error(errMsg + ` (HTTP ${res.status})`);
    }

    const data = await res.json();
    console.log('[shopier-client v2] Got data:', JSON.stringify(data));

    if (!data.redirectUrl) {
        console.error('[shopier-client v2] Missing redirectUrl');
        throw new Error('Ödeme bağlantısı alınamadı.');
    }

    console.log('[shopier-client v2] ▶ REDIRECTING to:', data.redirectUrl);
    window.location.href = data.redirectUrl;
}
