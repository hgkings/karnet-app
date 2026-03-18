'use client';

const marketplaces = [
  {
    emoji: '🟠',
    name: 'Trendyol',
    desc: "Türkiye'nin en büyük pazaryeri. Komisyon, servis bedeli ve KDV dahil tam analiz.",
    badge: 'En Popüler',
    topBorder: 'border-t-orange-400',
    badgeCls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    emoji: '🔵',
    name: 'Hepsiburada',
    desc: 'İşlem bedeli ve hizmet bedeli dahil gerçek kârlılık analizi.',
    badge: null,
    topBorder: 'border-t-blue-400',
    badgeCls: '',
  },
  {
    emoji: '🟣',
    name: 'n11',
    desc: 'Pazarlama ve pazaryeri hizmet bedelleri dahil net kâr hesaplama.',
    badge: null,
    topBorder: 'border-t-purple-400',
    badgeCls: '',
  },
  {
    emoji: '🟡',
    name: 'Amazon TR',
    desc: 'Referral fee ve fiyat dilimi bazlı komisyon hesaplama.',
    badge: null,
    topBorder: 'border-t-yellow-400',
    badgeCls: '',
  },
];

export function MarketplaceCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Entegrasyonlar
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Desteklenen Pazaryerleri
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tüm büyük pazaryerlerinde kârlılığınızı hesaplayın
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {marketplaces.map((mp) => (
            <div
              key={mp.name}
              className={`
                group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6
                border-t-2 ${mp.topBorder}
                hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg hover:shadow-black/30
                transition-all duration-300 cursor-default
              `}
            >
              {/* Badge */}
              {mp.badge && (
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${mp.badgeCls}`}>
                  {mp.badge}
                </span>
              )}

              {/* Emoji logo */}
              <div className="text-4xl mb-4">{mp.emoji}</div>

              <h3 className="font-bold text-white mb-2">{mp.name}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{mp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
