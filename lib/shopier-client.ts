/**
 * Client-side helper to initiate Shopier checkout.
 * 
 * Calls POST /api/shopier/create-order → gets { redirectUrl }
 * Then redirects the browser to the Shopier form page.
 */
export async function startShopierCheckout(plan: 'pro_monthly' | 'pro_yearly'): Promise<void> {
    const res = await fetch('/api/shopier/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ödeme başlatılamadı.');
    }

    const data = await res.json();

    if (!data.redirectUrl) {
        throw new Error('Ödeme bağlantısı alınamadı.');
    }

    // Redirect browser to the Shopier form page
    window.location.href = data.redirectUrl;
}
