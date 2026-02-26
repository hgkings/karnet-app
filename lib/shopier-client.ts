/**
 * Client-side helper to initiate Shopier checkout.
 * 
 * Calls POST /api/shopier/create-order → gets { redirectUrl }
 * Then redirects the browser to the Shopier product page.
 */
export async function startShopierCheckout(plan: 'pro_monthly' | 'pro_yearly'): Promise<void> {
    console.log('[shopier-client] Starting checkout, plan:', plan);

    const url = '/api/shopier/create-order';
    console.log('[shopier-client] Calling POST', url);

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
            credentials: 'same-origin', // ensure cookies are sent
        });
    } catch (networkErr: any) {
        console.error('[shopier-client] Network error:', networkErr);
        throw new Error('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    }

    console.log('[shopier-client] Response status:', res.status);

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('[shopier-client] Error response:', errData);
        throw new Error(errData.error || `Ödeme başlatılamadı (HTTP ${res.status}).`);
    }

    const data = await res.json();
    console.log('[shopier-client] Response data:', data);

    if (!data.redirectUrl) {
        console.error('[shopier-client] No redirectUrl in response:', data);
        throw new Error('Ödeme bağlantısı alınamadı.');
    }

    console.log('[shopier-client] Redirecting to:', data.redirectUrl);
    window.location.href = data.redirectUrl;
}
