import { ProductInput, Marketplace } from '@/types';

// Yeni Türkçe başlıklar
const TURKISH_COLUMNS = [
  'pazaryeri',
  'urun_adi',
  'aylik_satis_adedi',
  'urun_maliyeti',
  'satis_fiyati',
  'komisyon_orani',
  'kargo_ucreti',
  'paketleme_maliyeti',
  'reklam_maliyeti',
  'iade_orani',
  'kdv_orani',
];

// Eski İngilizce başlıklar (geriye dönük uyumluluk)
const ENGLISH_COLUMNS = [
  'marketplace',
  'product_name',
  'monthly_sales_volume',
  'product_cost',
  'sale_price',
  'commission_pct',
  'shipping_cost',
  'packaging_cost',
  'ad_cost',
  'return_rate',
  'vat_pct',
];

// Eski → Yeni başlık eşlemesi (backward compatibility)
const HEADER_ALIASES: Record<string, string> = {
  // İngilizce → Türkçe
  'marketplace': 'pazaryeri',
  'product_name': 'urun_adi',
  'monthly_sales_volume': 'aylik_satis_adedi',
  'product_cost': 'urun_maliyeti',
  'sale_price': 'satis_fiyati',
  'commission_pct': 'komisyon_orani',
  'shipping_cost': 'kargo_ucreti',
  'packaging_cost': 'paketleme_maliyeti',
  'ad_cost': 'reklam_maliyeti',
  'return_rate': 'iade_orani',
  'vat_pct': 'kdv_orani',
  // Türkçe → Türkçe (zaten doğru)
  'pazaryeri': 'pazaryeri',
  'urun_adi': 'urun_adi',
  'aylik_satis_adedi': 'aylik_satis_adedi',
  'urun_maliyeti': 'urun_maliyeti',
  'satis_fiyati': 'satis_fiyati',
  'komisyon_orani': 'komisyon_orani',
  'kargo_ucreti': 'kargo_ucreti',
  'paketleme_maliyeti': 'paketleme_maliyeti',
  'reklam_maliyeti': 'reklam_maliyeti',
  'iade_orani': 'iade_orani',
  'kdv_orani': 'kdv_orani',
};

export const CSV_TEMPLATE = `pazaryeri,urun_adi,aylik_satis_adedi,urun_maliyeti,satis_fiyati,komisyon_orani,kargo_ucreti,paketleme_maliyeti,reklam_maliyeti,iade_orani,kdv_orani
trendyol,Samsung Galaxy A15 Kilif,150,35,129,18,15,4,8,12,20
trendyol,Nike Spor Ayakkabi 42 Numara,45,280,599,20,25,8,15,25,20
hepsiburada,Philips Airfryer Yag Filtresi,80,42,149,20,18,3,10,8,20
n11,Bluetooth Kulaklik TWS,200,65,199,16,12,5,12,10,20
amazon_tr,Organik Hindistan Cevizi Yagi 500ml,120,38,119,17,20,6,7,6,20`;

const MARKETPLACE_MAP: Record<string, Marketplace> = {
  'trendyol': 'trendyol',
  'hepsiburada': 'hepsiburada',
  'n11': 'n11',
  'amazon_tr': 'amazon_tr',
  'amazon tr': 'amazon_tr',
  'amazontr': 'amazon_tr',
  'amazon': 'amazon_tr',
  'custom': 'custom',
  'ozel': 'custom',
  'özel': 'custom',
};

export function parseCSV(text: string): { data: ProductInput[]; errors: string[]; missingColumns: string[] } {
  const errors: string[] = [];
  const missingColumns: string[] = [];
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length < 2) {
    return { data: [], errors: ['CSV dosyası en az bir başlık ve bir veri satırı içermelidir.'], missingColumns: [] };
  }

  // Dosya boyutu ve satir limiti
  const MAX_ROWS = 500;
  const MAX_TEXT_SIZE = 5 * 1024 * 1024;
  if (text.length > MAX_TEXT_SIZE) {
    return { data: [], errors: ['CSV dosyası çok büyük (maks. 5 MB).'], missingColumns: [] };
  }
  if (lines.length - 1 > MAX_ROWS) {
    return { data: [], errors: [`CSV dosyası en fazla ${MAX_ROWS} satır içerebilir (${lines.length - 1} satır bulundu).`], missingColumns: [] };
  }

  // Başlıkları normalize et — hem TR hem EN kabul eder
  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const headers = rawHeaders.map(h => HEADER_ALIASES[h] ?? h);

  // Türkçe başlıkların varlığını kontrol et
  for (const col of TURKISH_COLUMNS) {
    if (!headers.includes(col)) {
      // Eski İngilizce başlık da kabul et
      const englishIdx = ENGLISH_COLUMNS.findIndex(
        eng => HEADER_ALIASES[eng] === col
      );
      const englishName = englishIdx >= 0 ? ENGLISH_COLUMNS[englishIdx] : col;
      if (!rawHeaders.includes(englishName)) {
        missingColumns.push(col);
      }
    }
  }

  if (missingColumns.length > 0) {
    return {
      data: [],
      errors: missingColumns.map(col => `Eksik sütun: ${col}`),
      missingColumns
    };
  }

  const data: ProductInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    if (values.length !== headers.length) {
      errors.push(`Satır ${i + 1}: Sütun sayısı uyuşmuyor (${headers.length} beklenirken ${values.length} bulundu).`);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });

    const rawMp = row.pazaryeri?.toLowerCase().trim() || '';
    const marketplace = MARKETPLACE_MAP[rawMp];

    if (!marketplace) {
      errors.push(`Satır ${i + 1}: Geçersiz pazaryeri "${row.pazaryeri}". Kabul edilenler: trendyol, hepsiburada, n11, amazon_tr, custom`);
      continue;
    }

    const input: ProductInput = {
      marketplace,
      product_name: row.urun_adi || `Ürün ${i}`,
      monthly_sales_volume: parseFloat(row.aylik_satis_adedi) || 0,
      product_cost: parseFloat(row.urun_maliyeti) || 0,
      sale_price: parseFloat(row.satis_fiyati) || 0,
      commission_pct: parseFloat(row.komisyon_orani) || 0,
      shipping_cost: parseFloat(row.kargo_ucreti) || 0,
      packaging_cost: parseFloat(row.paketleme_maliyeti) || 0,
      ad_cost_per_sale: parseFloat(row.reklam_maliyeti) || 0,
      return_rate_pct: parseFloat(row.iade_orani) || 0,
      vat_pct: parseFloat(row.kdv_orani) || 20,
      other_cost: 0,
      payout_delay_days: 14,
    };

    data.push(input);
  }

  return { data, errors, missingColumns };
}

interface AnalysisForExport {
  input: ProductInput;
  result: {
    unit_net_profit: number;
    margin_pct: number;
    monthly_net_profit: number;
    monthly_revenue: number;
    commission_amount: number;
    vat_amount: number;
    expected_return_loss: number;
    unit_total_cost: number;
    unit_variable_cost: number;
    breakeven_price: number;
    sale_price_excl_vat: number;
    service_fee_amount: number;
    monthly_total_cost: number;
  };
  risk: { level: string; score: number };
  createdAt?: string;
}

function num(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseFloat(v) || 0;
  return 0;
}

// Turk Excel formatinda sayi: 1.234,56
function fmtNum(v: number, decimals = 2): string {
  const parts = v.toFixed(decimals).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (decimals === 0) return intPart;
  return `${intPart},${parts[1]}`;
}

function csvSafe(val: string | number): string {
  const s = String(val);
  if (s.includes(';') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const RISK_TR: Record<string, string> = {
  safe: 'Dusuk', moderate: 'Orta', risky: 'Yuksek', dangerous: 'Kritik',
};

export function analysesToCSV(analyses: AnalysisForExport[]): string {
  const headers = [
    'Urun Adi', 'Pazaryeri', 'Tarih',
    'Satis Fiyati (TL)', 'Satis Fiyati KDV Haric (TL)', 'Aylik Satis Adedi',
    'Urun Maliyeti (TL)', 'Kargo (TL)', 'Paketleme (TL)', 'Reklam Birim (TL)', 'Diger Gider (TL)',
    'Komisyon %', 'KDV %', 'Iade %',
    'Komisyon Tutari (TL)', 'KDV Tutari (TL)', 'Iade Kaybi (TL)', 'Servis Bedeli (TL)',
    'Degisken Maliyet (TL)', 'Toplam Birim Maliyet (TL)',
    'Birim Net Kar (TL)', 'Kar Marji %', 'Basabas Fiyati (TL)',
    'Aylik Ciro (TL)', 'Aylik Toplam Maliyet (TL)', 'Aylik Net Kar (TL)', 'Yillik Tahmini Kar (TL)',
    'Risk Skoru', 'Risk Seviyesi', 'Durum',
  ];

  const rows = analyses.map((a) => {
    const inp = a.input;
    const res = a.result;
    const monthlyProfit = num(res.monthly_net_profit);
    const unitProfit = num(res.unit_net_profit);

    return [
      csvSafe(inp.product_name || 'Isimsiz'),
      inp.marketplace || 'trendyol',
      a.createdAt ? new Date(a.createdAt).toLocaleDateString('tr-TR') : '',
      fmtNum(num(inp.sale_price)),
      fmtNum(num(res.sale_price_excl_vat)),
      fmtNum(num(inp.monthly_sales_volume), 0),
      fmtNum(num(inp.product_cost)),
      fmtNum(num(inp.shipping_cost)),
      fmtNum(num(inp.packaging_cost)),
      fmtNum(num(inp.ad_cost_per_sale)),
      fmtNum(num(inp.other_cost)),
      fmtNum(num(inp.commission_pct), 0),
      fmtNum(num(inp.vat_pct), 0),
      fmtNum(num(inp.return_rate_pct), 0),
      fmtNum(num(res.commission_amount)),
      fmtNum(num(res.vat_amount)),
      fmtNum(num(res.expected_return_loss)),
      fmtNum(num(res.service_fee_amount)),
      fmtNum(num(res.unit_variable_cost)),
      fmtNum(num(res.unit_total_cost)),
      fmtNum(unitProfit),
      fmtNum(num(res.margin_pct), 1),
      fmtNum(num(res.breakeven_price)),
      fmtNum(num(res.monthly_revenue)),
      fmtNum(num(res.monthly_total_cost)),
      fmtNum(monthlyProfit),
      fmtNum(monthlyProfit * 12),
      fmtNum(num(a.risk.score), 0),
      RISK_TR[a.risk.level] || a.risk.level,
      unitProfit > 0 ? 'Karli' : unitProfit === 0 ? 'Basabas' : 'Zarar',
    ];
  });

  const bom = '\uFEFF';
  return bom + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}

export function analysesToJSON(analyses: unknown[]): string {
  return JSON.stringify(analyses, null, 2);
}
