
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    Target,
    Landmark,
    User,
    Settings,
    Crown,
    FileText,
    Upload,
    CreditCard
} from 'lucide-react';

export const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Yeni Analiz', href: '/analysis/new', icon: PlusCircle },
    { label: 'Ürünler', href: '/products', icon: Package },
    { label: 'Başabaş', href: '/break-even', icon: Target, restricted: true },
    { label: 'Nakit Planı', href: '/cash-plan', icon: Landmark, restricted: true },
];

export const BOTTOM_NAV_ITEMS = [
    { label: 'Premium', href: '/pricing', icon: Crown, highlight: true },
    { label: 'Profil', href: '/account', icon: User },
    { label: 'Ayarlar', href: '/settings', icon: Settings },
];

export const QUICK_ACTIONS = [
    { label: 'PDF Rapor', href: '/dashboard', icon: FileText, action: 'pdf' }, // Special handling needed
    { label: 'CSV İçe Aktar', href: '/products', icon: Upload },
    { label: 'Fiyatlandırma', href: '/pricing', icon: CreditCard },
];
