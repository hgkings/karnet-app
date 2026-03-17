'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Hesabımı nasıl silerim?',
    a: 'Ayarlar > Hesap bölümünden hesabınızı kalıcı olarak silebilirsiniz. Silme işlemi geri alınamaz.',
  },
  {
    q: 'Şifremi unuttum, ne yapmalıyım?',
    a: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize sıfırlama bağlantısı gönderebilirsiniz.',
  },
  {
    q: 'Trendyol API bilgilerimi nereden bulabilirim?',
    a: 'Trendyol Satıcı Paneli → Entegrasyon → API Bilgileri sayfasından API Key, API Secret ve Satıcı ID bilgilerinizi alabilirsiniz.',
  },
  {
    q: 'Ödeme yaptım ama Pro aktif olmadı?',
    a: 'Ödeme onaylanmasının ardından birkaç dakika sürebilir. 5 dakika bekleyip sayfayı yenileyin. Sorun devam ederse bizimle iletişime geçin.',
  },
  {
    q: 'Verilerimi dışa nasıl aktarabilirim?',
    a: 'Pro plan kullanıcıları analizler sayfasından CSV ve PDF olarak dışa aktarabilir.',
  },
  {
    q: 'Ücretsiz planda kaç ürün analizi yapabilirim?',
    a: 'Ücretsiz planda 5 ürüne kadar analiz kaydedebilirsiniz.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 p-4 sm:p-0">

        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-3xl font-bold tracking-tight">Nasıl Yardımcı Olabiliriz?</h1>
          <p className="text-muted-foreground">Sorunuzu bize iletin, en kısa sürede dönelim.</p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5" />
              <span className="font-semibold">E-posta ile ulaşın</span>
            </div>
            <p className="text-lg font-mono font-medium">karnet.destek@gmail.com</p>
            <p className="text-xs text-muted-foreground">Genellikle 24 saat içinde yanıt veririz.</p>
            <a
              href="mailto:karnet.destek@gmail.com"
              className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              E-posta Gönder
            </a>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Phone className="h-5 w-5" />
              <span className="font-semibold">Telefon ile ulaşın</span>
            </div>
            <p className="text-lg font-mono font-medium">+90 543 382 45 21</p>
            <p className="text-xs text-muted-foreground">Hafta içi 09:00–18:00</p>
            <a
              href="tel:+905433824521"
              className="mt-auto inline-flex items-center justify-center rounded-lg border border-border text-sm font-medium px-4 py-2 hover:bg-muted transition-colors"
            >
              Ara
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sık Sorulan Sorular</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
