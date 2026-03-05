/**
 * Trendyol Seller API Client — Server-only
 * 
 * Base URL: https://api.trendyol.com/sapigw/suppliers/{supplierId}
 * Auth: Basic (apiKey:apiSecret → base64)
 * Rate limit: Exponential backoff on 429/5xx (max 3 retries)
 * 
 * NEVER log credentials, auth headers, or tokens.
 */

const BASE_URL = 'https://api.trendyol.com/sapigw';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

export interface TrendyolCredentials {
    apiKey: string;
    apiSecret: string;
    sellerId: string;
}

function buildHeaders(creds: TrendyolCredentials): Record<string, string> {
    const token = Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64');
    return {
        'Authorization': `Basic ${token}`,
        'User-Agent': `${creds.sellerId} - SelfIntegration`,
        'Content-Type': 'application/json',
    };
}

async function fetchWithRetry(url: string, headers: Record<string, string>): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fetch(url, { headers, method: 'GET' });

            // Success or client error (4xx except 429) → return immediately
            if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
                return res;
            }

            // 429 or 5xx → retry with backoff
            if (res.status === 429 || res.status >= 500) {
                const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                console.log(`[trendyol-api] Status ${res.status}, retry ${attempt + 1}/${MAX_RETRIES} after ${backoff}ms`);
                await sleep(backoff);
                continue;
            }

            return res;
        } catch (err: any) {
            lastError = err;
            if (attempt < MAX_RETRIES) {
                const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                console.log(`[trendyol-api] Network error, retry ${attempt + 1}/${MAX_RETRIES} after ${backoff}ms`);
                await sleep(backoff);
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Test Connection ───
export async function testConnection(creds: TrendyolCredentials): Promise<{ success: boolean; message: string; storeName?: string }> {
    try {
        const url = `${BASE_URL}/suppliers/${creds.sellerId}/products?page=0&size=1`;
        const headers = buildHeaders(creds);
        const res = await fetchWithRetry(url, headers);

        if (res.ok) {
            const data = await res.json();
            return {
                success: true,
                message: `Bağlantı başarılı. Toplam ${data.totalElements ?? '?'} ürün bulundu.`,
                storeName: undefined,
            };
        }

        // Don't log response body (might contain sensitive info)
        return {
            success: false,
            message: `Bağlantı hatası: HTTP ${res.status}`,
        };
    } catch (err: any) {
        return {
            success: false,
            message: `Bağlantı hatası: ${err?.message || 'Bilinmeyen hata'}`,
        };
    }
}

// ─── Fetch Products (paginated) ───
export interface TrendyolProductPage {
    content: any[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export async function fetchProducts(
    creds: TrendyolCredentials,
    page = 0,
    size = 50
): Promise<TrendyolProductPage> {
    const url = `${BASE_URL}/suppliers/${creds.sellerId}/products?page=${page}&size=${size}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) {
        throw new Error(`Trendyol ürün API hatası: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
        content: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        page: data.page || page,
        size: data.size || size,
    };
}

// ─── Fetch Orders (paginated) ───
export interface TrendyolOrderPage {
    content: any[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

export async function fetchOrders(
    creds: TrendyolCredentials,
    startDate: number,  // epoch millis
    endDate: number,    // epoch millis
    page = 0,
    size = 50
): Promise<TrendyolOrderPage> {
    const url = `${BASE_URL}/suppliers/${creds.sellerId}/orders?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
    const headers = buildHeaders(creds);
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) {
        throw new Error(`Trendyol sipariş API hatası: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
        content: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        page: data.page || page,
        size: data.size || size,
    };
}
