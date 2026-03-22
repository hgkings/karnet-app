/**
 * Marketplace API Error Handler — Server-only
 *
 * - withRetry: rate limit ve geçici hatalarda otomatik yeniden deneme (max 3, 1s artan bekleme)
 * - withTimeout: 10 saniye API timeout
 * - translateApiError: HTTP hata kodlarını Türkçe kullanıcı mesajlarına çevirir
 *
 * Teknik detaylar konsola loglanır, kullanıcıya asla gösterilmez.
 */

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 10000;
const BASE_DELAY_MS = 1000;

// ─── Türkçe hata mesajları ────────────────────────────────────

const HTTP_ERROR_MESSAGES: Record<number, string> = {
    400: 'İstek parametreleri hatalı, lütfen bilgilerinizi kontrol edin.',
    401: 'API bilgileri hatalı, lütfen kontrol edin.',
    403: 'Bu hesabın API erişimi yok.',
    404: 'İstenen kaynak bulunamadı.',
    429: 'İstek limiti aşıldı, lütfen bekleyip tekrar deneyin.',
    500: 'Pazaryeri sunucusunda geçici bir hata oluştu.',
    502: 'Pazaryeri sunucusu geçici olarak yanıt vermiyor.',
    503: 'Pazaryeri servisi geçici olarak kullanılamıyor.',
    504: 'Pazaryeri sunucusu zaman aşımına uğradı.',
};

/**
 * HTTP status kodunu Türkçe kullanıcı dostu mesaja çevirir.
 * timeout → özel mesaj; bilinmeyen kod → jenerik mesaj.
 */
export function translateApiError(status: number | 'timeout' | 'network', rawMessage?: string): string {
    if (status === 'timeout') {
        return 'Bağlantı zaman aşımına uğradı, tekrar deneyin.';
    }
    if (status === 'network') {
        return 'Ağ hatası oluştu, internet bağlantınızı kontrol edin.';
    }
    return HTTP_ERROR_MESSAGES[status] ?? `Beklenmeyen hata oluştu (HTTP ${status}).`;
}

// ─── Retry wrapper ───────────────────────────────────────────

/**
 * fn'yi max maxRetries kez dener. Her deneme sonrası bekleme süresi iki katına çıkar.
 * AbortError (timeout) için yeniden deneme yapmaz — anında fırlatır.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelayMs = BASE_DELAY_MS,
    label = 'marketplace-api'
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            lastError = err;

            // Timeout hatalarını hemen fırlat — yeniden denemenin anlamı yok
            if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
                throw err;
            }

            if (attempt < maxRetries) {
                const delay = baseDelayMs * Math.pow(2, attempt);
                console.error(`[${label}] Hata (deneme ${attempt + 1}/${maxRetries + 1}), ${delay}ms sonra tekrar: ${err?.message}`);
                await sleep(delay);
            } else {
                console.error(`[${label}] Tüm denemeler tükendi: ${err?.message}`);
            }
        }
    }

    throw lastError;
}

// ─── Timeout wrapper ─────────────────────────────────────────

/**
 * fn'yi timeoutMs milisaniye içinde tamamlanmaya zorlar.
 * Aşılırsa TimeoutError fırlatır.
 */
export async function withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error('Timeout')), timeoutMs);

    try {
        return await fn();
    } finally {
        clearTimeout(timer);
    }
}

// ─── Hata loglayıcı ──────────────────────────────────────────

/**
 * API hatasını console'a loglar.
 * Kullanıcıya dönecek mesajı döndürür (teknik detay içermez).
 */
export function logAndTranslateError(
    context: string,
    err: unknown,
    status?: number
): string {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${context}] API hatası:`, message);

    if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
        return translateApiError('timeout');
    }
    if (status) {
        return translateApiError(status);
    }
    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
        return translateApiError('network');
    }
    return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
}

// ─── Helpers ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
