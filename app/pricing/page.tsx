'use client';

import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Ucretsiz',
    price: '0₺',
    period: '',
    desc: 'Baslangic icin ideal',
    features: [
      'Maks 5 urun analizi',
      'Temel kar hesaplama',
      'Risk puani',
      'JSON disari aktarma',
    ],
    notIncluded: [
      'Hassasiyet analizi',
      'Pazaryeri karsilastirma',
      'Nakit akisi tahmini',
      'CSV iceri/disari aktarma',
      'Yazdirilabilir rapor',
    ],
    planKey: 'free' as const,
  },
  {
    name: 'Pro',
    price: '199₺',
    period: '/ay',
    yearlyPrice: '1.990₺/yil',
    desc: 'Ciddi saticilar icin',
    features: [
      'Sinirsiz urun analizi',
      'Temel kar hesaplama',
      'Risk puani',
      'Hassasiyet analizi',
      'Pazaryeri karsilastirmasi',
      'Nakit akisi tahmini',
      'CSV iceri aktarma',
      'CSV & JSON disari aktarma',
      'Yazdirilabilir rapor',
    ],
    notIncluded: [],
    planKey: 'pro' as const,
    popular: true,
  },
];

export default function PricingPage() {
  const { user, upgradePlan } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Basit ve Seffaf Fiyatlandirma
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ihtiyaclariniza uygun plani secin. Ucretsiz plan ile hemen baslayin.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = user?.plan === plan.planKey;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Crown className="h-3 w-3" />
                    En Populer
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  {plan.yearlyPrice && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      veya {plan.yearlyPrice} (2 ay bedava)
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  {isCurrentPlan ? (
                    <Button className="w-full" variant="outline" disabled>
                      Mevcut Plan
                    </Button>
                  ) : plan.planKey === 'pro' ? (
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (user) {
                          upgradePlan();
                        }
                      }}
                    >
                      {user ? 'Pro\'ya Yukselt' : 'Giris Yaparak Basla'}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" asChild>
                      <a href={user ? '/dashboard' : '/auth'}>
                        {user ? 'Panele Git' : 'Ucretsiz Basla'}
                      </a>
                    </Button>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 opacity-40">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Check className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Demo: Pro&apos;ya yukseltme tiklayin ve aninda Pro olun. Gercek odeme entegrasyonu yapilandirmasi gereklidir.
        </p>
      </div>
    </div>
  );
}
