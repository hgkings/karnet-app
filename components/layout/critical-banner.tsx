'use client';

import { useMemo, useState } from 'react';
import { useAlerts } from '@/contexts/alert-context';
import { PremiumAlert } from '@/components/ui/premium-alert';
import { useNotificationNavigation } from '@/hooks/use-notification-navigation';

export function CriticalBanner() {
    const { notifications, markAsRead } = useAlerts();
    const { navigate } = useNotificationNavigation();
    const [closed, setClosed] = useState(false);

    // Find the most recent unread danger notification
    const criticalAlert = useMemo(() => {
        return notifications.find(n => !n.is_read && n.type === 'danger');
    }, [notifications]);

    if (!criticalAlert || closed) return null;

    return (
        <div className="flex justify-center w-full px-4 py-3">
            <PremiumAlert
                variant="critical"
                title={criticalAlert.title}
                description={criticalAlert.message}
                actionLabel="Görüntüle"
                onAction={() => navigate(criticalAlert)}
                onClose={() => markAsRead(criticalAlert.id)}
            />
        </div>
    );
}
