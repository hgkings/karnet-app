import { User } from '@/types';
import { type PlanFeature } from '@/config/plans';

/**
 * Kârnet artık TAMAMEN ÜCRETSİZ.
 *
 * Tüm özellikler ve sınırsız kullanım her kullanıcıya açıktır.
 * Bu yüzden tüm erişim kontrolleri oturum açmış her kullanıcı için
 * tam erişim (true) döndürür. Plan/abonelik kavramı kaldırılmıştır.
 *
 * Bu fonksiyonlar geriye dönük uyumluluk için korunmuştur — uygulamanın
 * pek çok yerinde çağrıldıkları için imzaları değiştirilmemiştir.
 */

export function isProUser(user: User | null | undefined): boolean {
    return !!user;
}

export function isStarterUser(_user: User | null | undefined): boolean {
    // Plan ayrımı kalktı — herkes tam erişimli.
    return false;
}

export function hasPaidPlan(user: User | null | undefined): boolean {
    return !!user;
}

/**
 * Tüm özellikler ücretsiz olduğu için oturum açmış her kullanıcı
 * her özelliğe erişebilir.
 */
export function hasFeature(user: User | null | undefined, _feature: PlanFeature): boolean {
    return !!user;
}

/**
 * Returns a human-readable plan label in Turkish.
 * Kârnet ücretsiz olduğu için herkes "Ücretsiz" etiketini taşır.
 */
export function getPlanLabel(plan: string | undefined): string {
    if (plan === 'admin') return 'Admin';
    return 'Ücretsiz';
}
