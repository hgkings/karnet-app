import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/layout/legal-page-layout';

export const metadata: Metadata = {
  title: 'Cerez Politikasi | Karnet',
  description: 'Karnet cerez (cookie) politikasi. Hangi cerezleri kullandigimizi ve nasil yonetebileceginizi ogrenin.',
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPageLayout title="Cerez Politikasi">
      <p>
        Bu sayfa, Karnet web sitesinde kullanilan cerezler (cookies) hakkinda bilgi vermektedir.
      </p>

      <h2>Cerez Nedir?</h2>
      <p>
        Cerezler, web siteleri tarafindan tarayiciniza yerlestirilen kucuk metin dosyalaridir.
        Oturum yonetimi, tercih hatirlama ve site performansini olcme amaciyla kullanilir.
      </p>

      <h2>Kullandigimiz Cerezler</h2>

      <h3>Zorunlu Cerezler</h3>
      <p>Bu cerezler sitenin calismasi icin gereklidir ve devre disi birakilamaz.</p>
      <ul>
        <li>
          <strong>sb-*-auth-token</strong> — Supabase oturum yonetimi.
          Sure: Oturum boyunca. Amac: Guvenli giris ve kimlik dogrulama.
        </li>
        <li>
          <strong>__vercel_*</strong> — Vercel altyapi cerezleri.
          Sure: Oturum boyunca. Amac: Yuk dengeleme ve guvenlik.
        </li>
      </ul>

      <h3>Analitik Cerezler</h3>
      <p>Site kullanimini anlamamiza yardimci olur. Onayinizla aktif edilir.</p>
      <ul>
        <li>
          <strong>va-*</strong> — Vercel Analytics.
          Sure: 1 yil. Amac: Anonim sayfa goruntulenme istatistikleri.
        </li>
      </ul>

      <h2>Cerez Tercihleri</h2>
      <p>
        Sitemizi ilk ziyaretinizde cerez tercih bildirimi gosterilir.
        Zorunlu olmayan cerezleri kabul veya reddetebilirsiniz.
        Tercihinizi istediginiz zaman bu sayfa uzerinden guncelleyebilirsiniz.
      </p>
      <p>
        Ayrica tarayici ayarlarinizdan tum cerezleri engelleyebilirsiniz, ancak bu durumda
        bazi site ozellikleri duygundigi calismayabilir.
      </p>

      <h2>Ucuncu Taraf Cerezleri</h2>
      <p>
        Karnet, ucuncu taraf reklam cerezleri kullanmaz. Odeme islemi sirasinda
        PayTR kendi guvenlik cerezlerini kullanabilir.
      </p>

      <h2>Iletisim</h2>
      <p>
        Cerez politikamiz hakkinda sorulariniz icin:{' '}
        <a href="mailto:karnet.destek@gmail.com">karnet.destek@gmail.com</a>
      </p>

      <p>
        <strong>Son guncelleme:</strong> Nisan 2026
      </p>
    </LegalPageLayout>
  );
}
