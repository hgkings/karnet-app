
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    Target,
    Landmark,
    Store,
    User,
    Settings,
    FileText,
    Upload,
    MessageSquare,
    Wallet,
    MessageCircleQuestion,
} from 'lucide-react';
import type { PlanFeature } from '@/config/plans';

export interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    requiredFeature?: PlanFeature;
    highlight?: boolean;
    action?: string;
    group?: string;
}

// Kârnet tamamen ücretsiz — tüm menü öğeleri herkese açık, kilit yok.
export const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Yeni Analiz', href: '/analysis/new', icon: PlusCircle },
    { label: 'Ürünler', href: '/products', icon: Package },
    { label: 'Başabaş', href: '/break-even', icon: Target },
    { label: 'Nakit Planı', href: '/cash-plan', icon: Landmark },
    { label: 'Pazaryeri', href: '/marketplace', icon: Store },
];

export const FINANS_NAV_ITEMS: NavItem[] = [
    { label: 'Hakediş', href: '/finance', icon: Wallet },
    { label: 'Sorular', href: '/questions', icon: MessageCircleQuestion },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { label: 'Profil', href: '/account', icon: User },
    { label: 'Destek', href: '/support', icon: MessageSquare },
    { label: 'Ayarlar', href: '/settings', icon: Settings },
];

export const QUICK_ACTIONS: NavItem[] = [
    { label: 'PDF Rapor', href: '/dashboard', icon: FileText, action: 'pdf' },
    { label: 'CSV İçe Aktar', href: '/products', icon: Upload },
];
