/**
 * Client-side helper to initiate Shopier checkout.
 * 
 * Calls the create-order API which returns an auto-submitting 
 * HTML form → the browser gets redirected to Shopier.
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

    // The response is an HTML page that auto-submits to Shopier
    const html = await res.text();

    // Replace current page with the auto-submitting form
    document.open();
    document.write(html);
    document.close();
}
