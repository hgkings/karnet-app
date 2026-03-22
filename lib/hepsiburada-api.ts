/**
 * Hepsiburada Merchant API Client — Server-only
 *
 * Base URL (listing): https://listing-external.hepsiburada.com
 * Base URL (orders/products): https://mpop-sit.hepsiburada.com (sandbox)
 *                             https://mpop.hepsiburada.com     (production)
 * Auth: Basic Base64(username:password) — internally stored as apiKey:apiSecret
 * Rate limit: Exponential backoff on 429/5xx (max 3 retries), 10s timeout
 *
 * Mock mode: apiKey === "HB_TEST" — gerçek API çağrısı yapılmaz.
 *
 * Status mapping:
 *   "Created"   → "beklemede"
 *   "Shipped"   → "kargoda"
 *   "Delivered" → "tamamlandı"
 *   "Cancelled" → "iptal"
 *
 * NEVER log credentials, auth headers, or tokens.
 */

const BASE_URL = 'https://mpop.hepsiburada.com';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;
const TIMEOUT_MS = 10000;

export const HB_TEST_KEY = 'HB_TEST';

/**
 * HepsiburadaCredentials
 * apiKey    = Hepsiburada merchant username
 * apiSecret = Hepsiburada merchant password
 * merchantId = Hepsiburada merchant ID (used in API query params)
 */
export interface HepsiburadaCredentials {
    apiKey: string;
    apiSecret: string;
    merchantId: string;
}

export const HB_STATUS_MAP: Record<string, string> = {
    Created: 'beklemede',
    Shipped: 'kargoda',
    Delivered: 'tamamlandı',
    Cancelled: 'iptal',
};

// ─── Mock Data ───────────────────────────────────────────────

const MOCK_PRODUCTS = [
    { id: 'HB-001', sku: 'SONY-WH1000XM5', name: 'Sony WH-1000XM5 Kablosuz Kulaklık', price: 8499, originalPrice: 9999, availableStock: 34, categoryName: 'Elektronik > Kulaklık' },
    { id: 'HB-002', sku: 'ADIDAS-UB22-42', name: 'Adidas Ultraboost 22 Spor Ayakkabı', price: 2199, originalPrice: 2799, availableStock: 56, categoryName: 'Spor > Koşu Ayakkabısı' },
    { id: 'HB-003', sku: 'TEFAL-CP6000', name: 'Tefal Comfort Pressure Cooker 6L', price: 1299, originalPrice: 1599, availableStock: 18, categoryName: 'Ev & Yaşam > Mutfak Aletleri' },
    { id: 'HB-004', sku: 'MAVI-101-32', name: 'Mavi Jeans 101 Slim Fit Pantolon', price: 699, originalPrice: 899, availableStock: 89, categoryName: 'Giyim > Erkek > Kot Pantolon' },
    { id: 'HB-005', sku: 'DYSON-V11', name: 'Dyson V11 Kablosuz Süpürge', price: 14999, originalPrice: 16999, availableStock: 7, categoryName: 'Ev & Yaşam > Süpürge' },
];

const MOCK_ORDERS = [
    { orderId: 'HB-ORD-001', orderDate: '2026-03-01T10:00:00Z', status: 'Delivered', totalPrice: 8499, commission: 765, shippingAmount: 0, netEarning: 7734 },
    { orderId: 'HB-ORD-002', orderDate: '2026-03-02T14:30:00Z', status: 'Delivered', totalPrice: 2199, commission: 242, shippingAmount: 29.9, netEarning: 1927.1 },
    { orderId: 'HB-ORD-003', orderDate: '2026-03-04T09:15:00Z', status: 'Shipped', totalPrice: 1299, commission: 143, shippingAmount: 0, netEarning: 1156 },
    { orderId: 'HB-ORD-004', orderDate: '2026-03-06T16:45:00Z', status: 'Shipped', totalPrice: 699, commission: 91, shippingAmount: 29.9, netEarning: 578.1 },
    { orderId: 'HB-ORD-005', orderDate: '2026-03-08T11:20:00Z', status: 'Created', totalPrice: 14999, commission: 1350, shippingAmount: 0, netEarning: 13649 },
    { orderId: 'HB-ORD-006', orderDate: '2026-03-09T13:00:00Z', status: 'Cancelled', totalPrice: 2199, commission: 0, shippingAmount: 0, netEarning: 0 },
    { orderId: 'HB-ORD-007', orderDate: '2026-03-11T08:30:00Z', status: 'Delivered', totalPrice: 8499, commission: 765, shippingAmount: 0, netEarning: 7734 },
    { orderId: 'HB-ORD-008', orderDate: '2026-03-13T17:00:00Z', status: 'Delivered', totalPrice: 1299, commission: 143, shippingAmount: 29.9, netEarning: 1126.1 },
    { orderId: 'HB-ORD-009', orderDate: '2026-03-15T12:10:00Z', status: 'Shipped', totalPrice: 14999, commission: 1350, shippingAmount: 0, netEarning: 13649 },
    { orderId: 'HB-ORD-010', orderDate: '2026-03-17T09:45:00Z', status: 'Created', totalPrice: 699, commission: 91, shippingAmount: 29.9, netEarning: 578.1 },
];

const MOCK_COMMISSION_RATES: HBCommissionRate[] = [
    { categoryId: 1, categoryName: 'Elektronik', commissionRate: 9 },
    { categoryId: 2, categoryName: 'Spor', commissionRate: 11 },
    { categoryId: 3, categoryName: 'Ev & Yaşam', commissionRate: 13 },
    { categoryId: 4, categoryName: 'Giyim', commissionRate: 16 },
];

// ─── Helpers ─────────────────────────────────────────────────

function isMockMode(creds: HepsiburadaCredentials): boolean {
    return creds.apiKey === HB_TEST_KEY;
}

function buildHeaders(creds: HepsiburadaCredentials): Record<string, string> {
    // apiKey = username, apiSecret = password (Hepsiburada Basic Auth)
    const token = Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64');
    return {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

async function fetchWithRetry(url: string, headers: Record<string, string>): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fetch(url, {
                headers,
                method: 'GET',
                signal: AbortSignal.timeout(TIMEOUT_MS),
            });

            if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
                return res;
            }

            if (res.status === 429 || res.status >= 500) {
                const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                console.log(`[hepsiburada-api] Status ${res.status}, retry ${attempt + 1}/${MAX_RETRIES} after ${backoff}ms`);
                await sleep(backoff);
                continue;
            }

            return res;
        } catch (err: any) {
            lastError = err;
            if (attempt < MAX_RETRIES) {
                const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                console.log(`[hepsiburada-api] Network error, retry ${attempt + 1}/${MAX_RETRIES} after ${backoff}ms`);
                await sleep(backoff);
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Test Connection ──────────────────────────────────────────

export async function testConnection(
    creds: HepsiburadaCredentials
): Promise<{ success: boolean; message: string; storeName?: string }> {
    if (isMockMode(creds)) {
        return {
            success: true,
            message: 'Bağlantı başarılı. Toplam 5 ürün bulundu. (Test Modu)',
            storeName: 'Hepsiburada Test Mağazası',
        };
    }

    try {
        const url = `${BASE_URL}/product/api/products/get-all-products?merchantId=${creds.merchantId}&offset=0&limit=1`;
        const headers = buildHeaders(creds);
        const res = await fetchWithRetry(url, headers);

        if (res.ok) {
            const data = await res.json();
            const total = data?.totalCount ?? data?.totalElements ?? '?';
            return {
                success: true,
                message: `Bağlantı başarılı. Toplam ${total} ürün bulundu.`,
            };
        }

        return { success: false, message: `Bağlantı hatası: HTTP ${res.status}` };
    } catch (err: any) {
        return { success: false, message: `Bağlantı hatası: ${err?.message || 'Bilinmeyen hata'}` };
    }
}

// ─── Products ────────────────────────────────────────────────

export interface HepsiburadaProductPage {
    content: any[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export async function fetchProducts(
    creds: HepsiburadaCredentials,
    page = 0,
    size = 50
): Promise<HepsiburadaProductPage> {
    if (isMockMode(creds)) {
        return {
            content: MOCK_PRODUCTS,
            totalElements: MOCK_PRODUCTS.length,
            totalPages: 1,
            page: 0,
            size,
        };
    }

    const offset = page * size;
    const url = `${BASE_URL}/product/api/products/get-all-products?merchantId=${creds.merchantId}&offset=${offset}&limit=${size}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) throw new Error(`Hepsiburada ürün API hatası: HTTP ${res.status}`);

    const data = await res.json();
    const products = data?.products || data?.content || [];
    const total = data?.totalCount || data?.totalElements || 0;
    return {
        content: products,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        page,
        size,
    };
}

export async function getProductBySku(
    creds: HepsiburadaCredentials,
    sku: string
): Promise<any | null> {
    if (isMockMode(creds)) {
        return MOCK_PRODUCTS.find(p => p.sku === sku) ?? null;
    }

    const url = `${BASE_URL}/product/api/products/get-all-products?merchantId=${creds.merchantId}&sku=${encodeURIComponent(sku)}&offset=0&limit=1`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) throw new Error(`Hepsiburada SKU sorgulama hatası: HTTP ${res.status}`);

    const data = await res.json();
    return (data?.products || data?.content)?.[0] ?? null;
}

// ─── Orders ──────────────────────────────────────────────────

export interface HepsiburadaOrderPage {
    content: any[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export async function fetchOrders(
    creds: HepsiburadaCredentials,
    startDate: number,   // epoch millis
    endDate: number,     // epoch millis
    page = 0,
    size = 50
): Promise<HepsiburadaOrderPage> {
    if (isMockMode(creds)) {
        return {
            content: MOCK_ORDERS,
            totalElements: MOCK_ORDERS.length,
            totalPages: 1,
            page: 0,
            size,
        };
    }

    const offset = page * size;
    const startISO = new Date(startDate).toISOString();
    const endISO = new Date(endDate).toISOString();
    const url = `${BASE_URL}/order/api/orders?merchantId=${creds.merchantId}&offset=${offset}&limit=${size}&beginDate=${startISO}&endDate=${endISO}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) throw new Error(`Hepsiburada sipariş API hatası: HTTP ${res.status}`);

    const data = await res.json();
    const orders = data?.orders || data?.content || [];
    const total = data?.totalCount || data?.totalElements || 0;
    return {
        content: orders,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        page,
        size,
    };
}

export async function getOrderDetail(
    creds: HepsiburadaCredentials,
    orderId: string
): Promise<any | null> {
    if (isMockMode(creds)) {
        return MOCK_ORDERS.find(o => o.orderId === orderId) ?? null;
    }

    const url = `${BASE_URL}/order/api/orders/${orderId}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) throw new Error(`Hepsiburada sipariş detay hatası: HTTP ${res.status}`);
    return res.json();
}

// ─── Commission Rates ────────────────────────────────────────

export interface HBCommissionRate {
    categoryId: number;
    categoryName: string;
    commissionRate: number;
}

export async function getCommissionRates(
    creds: HepsiburadaCredentials,
    categoryId?: number
): Promise<HBCommissionRate[]> {
    if (isMockMode(creds)) {
        return categoryId
            ? MOCK_COMMISSION_RATES.filter(c => c.categoryId === categoryId)
            : MOCK_COMMISSION_RATES;
    }

    const url = `${BASE_URL}/product/api/categories/get-all-categories${categoryId ? `?categoryId=${categoryId}` : ''}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) throw new Error(`Hepsiburada komisyon oranları hatası: HTTP ${res.status}`);

    const data = await res.json();
    return data.commissions || data || [];
}
