'use client';

import { Check, X, Minus } from 'lucide-react';

const rows = [
  { label: 'Gerçek net kâr',       karnet: 'yes',     excel: 'no',  rakip: 'partial' },
  { label: 'KDV ayrıştırma',       karnet: 'pro',     excel: 'no',  rakip: 'no'      },
  { label: 'İade maliyet analizi', karnet: 'yes',     excel: 'no',  rakip: 'no'      },
  { label: '4 pazaryeri desteği',  karnet: 'yes',     excel: 'no',  rakip: 'partial' },
  { label: 'API entegrasyonu',     karnet: 'pro',     excel: 'no',  rakip: 'no'      },
  { label: 'Risk puanı',           karnet: 'yes',     excel: 'no',  rakip: 'no'      },
  { label: 'Nakit akışı tahmini',  karnet: 'pro',     excel: 'no',  rakip: 'no'      },
  { label: 'PDF rapor',            karnet: 'yes',     excel: 'no',  rakip: 'no'      },
  { label: 'Kurulum gerektirmez',  karnet: 'yes',     excel: 'no',  rakip: 'partial' },
  { label: 'Ücretsiz plan',        karnet: 'yes',     excel: 'yes', rakip: 'no'      },
];

function Cell({ value }: { value: string }) {
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center justify-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" strokeWidth={2.5} />
        </span>
      </span>
    );
  }
  if (value === 'pro') {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" strokeWidth={2.5} />
        </span>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none">PRO</span>
      </span>
    );
  }
  if (value === 'no') {
    return (
      <span className="inline-flex items-center justify-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center">
      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
        Kısmi
      </span>
    </span>
  );
}

export function ComparisonTable() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Karşılaştırma
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rakiplerle Karşılaştırma
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kârnet neden öne çıkıyor?
          </p>
        </div>

        {/* Tablo — yatay scroll mobilde */}
        <div className="overflow-x-auto rounded-2xl border border-white/8 shadow-sm bg-[hsl(222,47%,7%)]">
          <table className="w-full min-w-[560px]">
            {/* Başlık satırı */}
            <thead>
              <tr>
                <th className="text-left px-6 py-5 text-sm font-semibold text-white/50 bg-white/[0.03] w-1/2 rounded-tl-2xl">
                  Özellik
                </th>
                {/* Kârnet sütunu — highlighted */}
                <th className="px-6 py-5 bg-primary/8 border-x border-primary/20 w-[18%] relative">
                  <div className="absolute -top-px left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full leading-none">
                      En İyi Seçim
                    </span>
                    <span className="text-sm font-bold text-primary">Kârnet</span>
                  </div>
                </th>
                <th className="px-6 py-5 bg-white/[0.03] text-sm font-semibold text-white/50 text-center w-[16%]">
                  Excel 📊
                </th>
                <th className="px-6 py-5 bg-white/[0.03] text-sm font-semibold text-white/50 text-center w-[16%] rounded-tr-2xl">
                  Rakip Araçlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className="hover:bg-white/[0.03] transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white/80">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-center bg-primary/5 border-x border-primary/10">
                    <Cell value={row.karnet} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Cell value={row.excel} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Cell value={row.rakip} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
