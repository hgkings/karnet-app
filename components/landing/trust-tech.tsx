'use client';

const cards = [
  {
    emoji: '🔒',
    title: 'Veri Güvenliği',
    desc: 'Verileriniz şifreli sunucularda saklanır, asla üçüncü taraflarla paylaşılmaz.',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBorder: 'border-blue-100 dark:border-blue-800/30',
    accent: 'border-t-blue-400',
  },
  {
    emoji: '⚡',
    title: 'Anlık Hesaplama',
    desc: 'Tüm maliyet kalemleri saniyeler içinde hesaplanır, manuel işlem gerekmez.',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconBorder: 'border-amber-100 dark:border-amber-800/30',
    accent: 'border-t-amber-400',
  },
  {
    emoji: '🎯',
    title: 'Gerçek Veriler',
    desc: 'Komisyon, kargo ve KDV oranları güncel pazaryeri verilerine göre hesaplanır.',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconBorder: 'border-green-100 dark:border-green-800/30',
    accent: 'border-t-green-400',
  },
  {
    emoji: '💳',
    title: 'Kolay Başlangıç',
    desc: 'Kredi kartı gerekmez. 5 dakikada hesap aç, hemen analiz yapmaya başla.',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBorder: 'border-purple-100 dark:border-purple-800/30',
    accent: 'border-t-purple-400',
  },
];

export function TrustTech() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Altyapı
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Güvenli ve Güvenilir Altyapı
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verileriniz güvende, hesaplamalarınız doğru
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`
                group rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6
                border-t-2 ${card.accent}
                hover:border-primary/30 hover:shadow-md hover:shadow-black/20
                transition-all duration-300
              `}
            >
              <div
                className={`
                  inline-flex h-12 w-12 items-center justify-center
                  rounded-xl border text-2xl mb-4
                  ${card.iconBg} ${card.iconBorder}
                `}
              >
                {card.emoji}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
