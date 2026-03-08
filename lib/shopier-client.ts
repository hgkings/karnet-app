/**
 * Client-side helper to initiate Shopier checkout.
 * 
 * Calls POST /api/shopier/create-order → gets { formHtml }
 * Returns the data object so the caller can open a popup / redirect.
 * 
 * VERSION: 2026-03-08-v3
 */
export async function startShopierCheckout(plan: 'pro_monthly' | 'pro_yearly'): Promise<{ formHtml?: string, redirectUrl?: string, paymentId?: string }> {
    // Alert to prove this code is running (temporary debug)
    console.log('[shopier-client v3] ▶ START plan=' + plan);

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

    console.log('[shopier-client v3] Response status:', res.status);

    if (!res.ok) {
        const errText = await res.text();
        console.error('[shopier-client v3] Error body:', errText);
        let errMsg = 'Ödeme başlatılamadı.';
        try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.error || errMsg;
        } catch { }
        throw new Error(errMsg + ` (HTTP ${res.status})`);
    }

    const data = await res.json();
    console.log('[shopier-client v3] Got data:', JSON.stringify({ ...data, formHtml: data.formHtml ? '(HTML string)' : undefined }));

    if (!data.formHtml && !data.redirectUrl) {
        console.error('[shopier-client v3] Missing formHtml and redirectUrl');
        throw new Error('Ödeme bağlantısı veya formu alınamadı.');
    }

    return data;
}
