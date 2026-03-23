export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number; // dakika cinsinden
  content: string; // HTML içerik
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'hepsiburadada-gercek-kar-nasil-hesaplanir',
    title: "Hepsiburada'da Gerçek Kârınızı Nasıl Hesaplarsınız?",
    description:
      'Komisyon, kargo, iade ve reklam maliyetlerini hesaba katmadan Hepsiburada\'daki gerçek kârınızı bilemezsiniz. İşte adım adım rehber.',
    date: '2026-03-23',
    readTime: 6,
    content: `
<p>Hepsiburada'da satış yapıyorsunuz, siparişler geliyor, para hesabınıza yatıyor. Ama ay sonunda bakıyorsunuz, düşündüğünüz kadar kazanmamışsınız. Tanıdık bir his mi?</p>
<p>Sorun genellikle şu: Satış fiyatına bakıp kâr hesaplıyorsunuz. Oysa Hepsiburada size satış fiyatının tamamını vermiyor.</p>

<h2>Hepsiburada'da Gerçek Kârı Etkileyen Maliyetler</h2>

<h3>1. Komisyon Oranları</h3>
<p>Hepsiburada, kategoriye göre %8 ile %25 arasında komisyon kesiyor. Aynı ürünü farklı kategorilerde listelediğinizde komisyon oranı değişebilir. Bu yüzden ürününüzün tam olarak hangi kategoride olduğunu ve komisyon oranını bilmeniz şart.</p>
<p>Örnek kategoriler:</p>
<ul>
  <li>Elektronik: %8–%12</li>
  <li>Giyim &amp; Aksesuar: %18–%22</li>
  <li>Kozmetik: %15–%20</li>
  <li>Ev &amp; Yaşam: %12–%18</li>
</ul>

<h3>2. Kargo Maliyeti</h3>
<p>Hepsiburada'da kargo bedava kampanyasına dahilseniz bu ücret sizden kesiliyor. Ürün ağırlığına ve desi hesabına göre değişen kargo maliyeti, özellikle düşük fiyatlı ürünlerde kârınızı ciddi ölçüde eritebilir.</p>

<h3>3. İade Maliyetleri</h3>
<p>E-ticarette iade oranları %10 ile %30 arasında seyredebilir. Müşteri ürünü iade ettiğinde:</p>
<ul>
  <li>Gidiş kargo bedelini zaten ödediniz</li>
  <li>Dönüş kargo bedeli genellikle satıcıya yansır</li>
  <li>Ürün hasarlı gelirse stok kaybı yaşarsınız</li>
</ul>
<p>100 ürün satıp 20'si iade gelirse, aslında sadece 80 ürün sattınız demektir. Kâr hesabınızı buna göre yapmanız gerekiyor.</p>

<h3>4. Reklam Harcamaları</h3>
<p>Hepsiburada'nın Sponsorlu Ürün reklamlarını kullanıyorsanız bu maliyet doğrudan kârınızdan gidiyor. Reklam harcamasını ürün başına düşürerek hesaba katmazsanız kârlı sandığınız ürün aslında zarar ettiriyor olabilir.</p>

<h3>5. Paketleme Maliyeti</h3>
<p>Kutu, balonlu naylon, bant, etiket... Bunların hepsi ürün başına maliyet. Günde 50 sipariş gönderiyorsanız paketleme maliyeti ciddi bir kalem haline gelir.</p>

<h2>Gerçek Kâr Formülü</h2>
<p>Tüm bu kalemleri bir araya getirince gerçek kâr formülü şöyle çıkıyor:</p>
<pre><code>Net Kâr = Satış Fiyatı
        − Hepsiburada Komisyonu
        − Kargo Bedeli
        − Ürün Maliyeti
        − Paketleme Maliyeti
        − İade Payı
        − Reklam Harcaması
        − Genel Gider Payı</code></pre>

<h3>Örnek Hesaplama</h3>
<p>Diyelim ki 300 TL'ye bir ürün satıyorsunuz:</p>
<table>
  <thead><tr><th>Kalem</th><th>Tutar</th></tr></thead>
  <tbody>
    <tr><td>Satış Fiyatı</td><td>300 TL</td></tr>
    <tr><td>Hepsiburada Komisyonu (%15)</td><td>-45 TL</td></tr>
    <tr><td>Kargo</td><td>-25 TL</td></tr>
    <tr><td>Ürün Maliyeti</td><td>-120 TL</td></tr>
    <tr><td>Paketleme</td><td>-8 TL</td></tr>
    <tr><td>İade Payı (%15)</td><td>-7 TL</td></tr>
    <tr><td>Reklam</td><td>-15 TL</td></tr>
    <tr><td><strong>Net Kâr</strong></td><td><strong>80 TL</strong></td></tr>
  </tbody>
</table>
<p>Kâr marjı: <strong>%26,6</strong></p>
<p>Satış fiyatına bakıp "300 TL kazandım" diye düşünmek yerine gerçek kazancınız 80 TL.</p>

<h2>Başabaş Noktasını Hesaplayın</h2>
<p>Başabaş noktası, zarar etmeden satış yapabileceğiniz minimum fiyattır. Bunu bilmeden fiyat indirimine gitmek tehlikeli olabilir.</p>
<p>Yukarıdaki örnekte tüm maliyetler toplamı 220 TL. Yani 220 TL'nin altında sattığınız her ürün için zarar ediyorsunuz.</p>

<h2>Hepsiburada'da Kârlılığı Artırmak İçin İpuçları</h2>
<ul>
  <li><strong>Desi optimizasyonu yapın:</strong> Küçük ve hafif ürünlerde kargo maliyeti düşer, kâr marjı yükselir.</li>
  <li><strong>İade oranını takip edin:</strong> Hangi ürünlerde iade fazlaysa fiyatlandırmayı buna göre ayarlayın.</li>
  <li><strong>Reklam ROAS'ını hesaplayın:</strong> Reklama harcadığınız her lira ne kadar kâr getiriyor?</li>
  <li><strong>Komisyon kategorisini kontrol edin:</strong> Aynı ürün farklı kategorilerde farklı komisyon oranına tabi olabilir.</li>
</ul>

<h2>Kârnet ile Otomatik Hesaplayın</h2>
<p>Tüm bu hesaplamaları her ürün için tek tek yapmak hem zaman alır hem hata riski taşır. Kârnet, Hepsiburada komisyon oranlarını otomatik olarak biliyor ve tüm maliyet kalemlerini sizin yerinize hesaplıyor.</p>
<p>Her ürün için net kâr marjınızı, başabaş noktanızı ve kârlılık skorunu saniyeler içinde görün.</p>
    `.trim(),
  },
  {
    slug: 'trendyol-komisyon-oranlari-2026',
    title: 'Trendyol Komisyon Oranları 2026 — Tam Liste',
    description:
      "Trendyol'da hangi kategoride ne kadar komisyon ödüyorsunuz? 2026 güncel komisyon oranlarının tam listesi ve kâra etkisi.",
    date: '2026-03-23',
    readTime: 5,
    content: `
<p>Trendyol'da satış yapıyorsanız komisyon oranlarını doğru bilmek, kârlı ürün seçiminin temelidir. Yanlış kategoride listelenen ya da komisyon oranı hesaba katılmadan fiyatlanan ürünler farkında olmadan zarar ettirebilir.</p>
<p>Bu yazıda 2026 yılı güncel Trendyol komisyon oranlarını kategori bazında derledik.</p>

<h2>Trendyol Komisyon Oranları 2026</h2>
<table>
  <thead><tr><th>Kategori</th><th>Komisyon Oranı</th></tr></thead>
  <tbody>
    <tr><td>Elektronik</td><td>%8 – %10</td></tr>
    <tr><td>Bilgisayar &amp; Tablet</td><td>%8 – %10</td></tr>
    <tr><td>Telefon &amp; Aksesuar</td><td>%10 – %14</td></tr>
    <tr><td>Beyaz Eşya</td><td>%8 – %10</td></tr>
    <tr><td>Küçük Ev Aletleri</td><td>%10 – %14</td></tr>
    <tr><td>Televizyon</td><td>%8</td></tr>
    <tr><td>Giyim &amp; Moda</td><td>%18 – %22</td></tr>
    <tr><td>Ayakkabı &amp; Çanta</td><td>%18 – %22</td></tr>
    <tr><td>Spor &amp; Outdoor</td><td>%14 – %18</td></tr>
    <tr><td>Kozmetik &amp; Kişisel Bakım</td><td>%15 – %20</td></tr>
    <tr><td>Anne &amp; Bebek</td><td>%12 – %16</td></tr>
    <tr><td>Oyuncak</td><td>%14 – %18</td></tr>
    <tr><td>Kitap &amp; Kırtasiye</td><td>%12 – %15</td></tr>
    <tr><td>Ev &amp; Yaşam</td><td>%14 – %18</td></tr>
    <tr><td>Mutfak</td><td>%14 – %18</td></tr>
    <tr><td>Bahçe &amp; Yapı Market</td><td>%12 – %16</td></tr>
    <tr><td>Pet Shop</td><td>%14 – %18</td></tr>
    <tr><td>Otomotiv</td><td>%10 – %14</td></tr>
  </tbody>
</table>
<p><strong>Not:</strong> Komisyon oranları Trendyol tarafından dönemsel olarak güncellenebilir. Satıcı panelinizden kategorinize özel güncel oranı kontrol etmenizi öneririz.</p>

<h2>Komisyon Oranı Kâra Nasıl Etki Eder?</h2>
<p>Komisyon oranındaki küçük bir fark, yüksek cirolu satıcılar için büyük rakamlara dönüşebilir.</p>
<p>Aylık 100.000 TL ciro yapan bir satıcı için:</p>
<table>
  <thead><tr><th>Komisyon Oranı</th><th>Aylık Komisyon Kesintisi</th></tr></thead>
  <tbody>
    <tr><td>%10</td><td>10.000 TL</td></tr>
    <tr><td>%15</td><td>15.000 TL</td></tr>
    <tr><td>%20</td><td>20.000 TL</td></tr>
  </tbody>
</table>
<p>Yani %10 ile %20 arasındaki fark, aynı ciroda aylık <strong>10.000 TL</strong> daha az kâr demektir.</p>

<h2>Komisyon Dışında Dikkat Edilmesi Gereken Kesintiler</h2>
<p>Komisyon tek maliyet değil. Trendyol'da net kârınızı etkileyen diğer kalemler:</p>
<ul>
  <li><strong>Kargo bedeli:</strong> Ücretsiz kargo kampanyasına dahilseniz bu ücret size yansır</li>
  <li><strong>İade kargo ücreti:</strong> Müşteri iade ettiğinde dönüş kargo bedeli genellikle satıcıdan kesilir</li>
  <li><strong>Trendyol reklam harcaması:</strong> Sponsorlu ürün ve vitrin reklamları</li>
  <li><strong>Hizmet bedeli:</strong> Bazı kampanya ve hizmetler için ek kesinti uygulanabilir</li>
</ul>

<h2>Hangi Kategori Daha Kârlı?</h2>
<p>Komisyon oranı düşük kategoriler her zaman daha kârlı değildir. Rekabet yoğunluğu, iade oranı ve reklam maliyeti de hesaba katılmalıdır.</p>
<p>Genel kural olarak:</p>
<ul>
  <li><strong>Elektronik:</strong> Düşük komisyon ama yüksek rekabet ve iade riski</li>
  <li><strong>Giyim:</strong> Yüksek komisyon ama yüksek ciro potansiyeli</li>
  <li><strong>Kozmetik:</strong> Orta komisyon, düşük iade, iyi kâr marjı</li>
</ul>

<h2>Doğru Fiyatlandırma İçin Ne Yapmalı?</h2>
<ol>
  <li>Ürününüzün kategorisini ve komisyon oranını öğrenin</li>
  <li>Kargo, paketleme ve reklam maliyetlerini ekleyin</li>
  <li>Hedef kâr marjınızı belirleyin</li>
  <li>Buna göre minimum satış fiyatınızı hesaplayın</li>
</ol>
<p>Bu hesaplamayı her ürün için tek tek yapmak zaman alıcı. Kârnet, Trendyol komisyon oranlarını otomatik olarak biliyor — siz sadece ürün maliyetinizi girin, gerisini halleder.</p>

<h2>Kârnet ile Komisyonu Otomatik Hesaplayın</h2>
<p>Kategori seçtiğinizde Kârnet güncel komisyon oranını otomatik uyguluyor. Kargo, reklam ve paketleme maliyetleriyle birlikte gerçek net kârınızı ve başabaş noktanızı saniyeler içinde görüyorsunuz.</p>
    `.trim(),
  },
  {
    slug: 'trendyolda-gercek-kar-nasil-hesaplanir',
    title: "Trendyol'da Gerçek Kârınızı Nasıl Hesaplarsınız?",
    description:
      "Komisyon, kargo, iade ve vergi maliyetlerini hesaba katmadan satış rakamlarınıza bakıyorsanız, aslında ne kadar kazandığınızı bilmiyorsunuz demektir. İşte gerçek kâr hesaplama rehberi.",
    date: '2026-03-20',
    readTime: 7,
    content: `
<p>Trendyol'da satış yapan birçok satıcı, ciro rakamlarına bakarak "iyi gidiyor" diye düşünür. Oysa asıl önemli olan, cepte kalan net kârdır. Bu yazıda, platforma özgü tüm maliyetleri hesaba katarak gerçek kârınızı nasıl hesaplayacağınızı adım adım anlatıyoruz.</p>

<h2>1. Brüt Gelir Yanıltıcı Olabilir</h2>
<p>Diyelim ki bir ürünü 200 TL'ye sattınız. Bu 200 TL'nin tamamı size gelmiyor. Önce şu kesintileri çıkarmanız gerekiyor:</p>
<ul>
  <li><strong>Trendyol komisyonu:</strong> Kategoriye göre %8–%22 arasında değişir.</li>
  <li><strong>Kargo maliyeti:</strong> Kargo bedava kampanyasına dahilseniz bu ücret size yansır.</li>
  <li><strong>İade kargo ücreti:</strong> Müşteri iade ederse kargo bedeli genellikle satıcıdan kesilir.</li>
  <li><strong>Trendyol Ek Hizmet Bedeli (varsa):</strong> Reklam, vitrin gibi ücretli hizmetler.</li>
</ul>

<h2>2. Ürün Maliyetini Doğru Hesaplayın</h2>
<p>Ürün başına maliyet sadece tedarikçiden ödediğiniz fiyat değildir. Şunları da dahil etmelisiniz:</p>
<ul>
  <li>Hammadde veya tedarik maliyeti</li>
  <li>Paketleme (kutu, bant, balonlu naylon vb.)</li>
  <li>Depo/kira payı (ürün başına düşen)</li>
  <li>İşçilik (kendiniz yapıyorsanız bile saatinizin değeri)</li>
</ul>

<h2>3. İade Oranını Hesaba Katın</h2>
<p>E-ticarette iade oranları %10–%30 arasında olabilir. 100 ürün satıp 20'si iade gelirse, o 20 ürün için hem komisyon hem kargo hem de stok kaybı yaşarsınız. Ortalama iade oranınızı biliyorsanız bunu kâr hesaplamanıza yansıtın.</p>
<p><em>Örnek:</em> %15 iade oranında 100 ürün sattıysanız, efektif satışınız 85 üründür. Kâr hesabınızı buna göre yapın.</p>

<h2>4. Vergi ve Fatura Maliyetleri</h2>
<p>Şahıs şirketi veya limited şirketle faaliyet gösteriyorsanız:</p>
<ul>
  <li>KDV: Ürünün KDV oranına göre (%1, %10 veya %20) hesaplayın.</li>
  <li>Gelir/Kurumlar Vergisi: Yıllık kâr üzerinden ödenir.</li>
  <li>Muhasebeci ücreti: Aylık sabit gider olarak ürün bazında paylaştırın.</li>
</ul>

<h2>5. Gerçek Kâr Formülü</h2>
<p>Tüm bu bilgileri bir araya getirdiğinizde gerçek kâr formülü şöyle çıkar:</p>
<pre><code>Net Kâr = Satış Fiyatı
        − Trendyol Komisyonu
        − Kargo Bedeli
        − Ürün Maliyeti
        − Paketleme Maliyeti
        − İade Payı
        − Genel Gider Payı
        − Vergi Payı</code></pre>

<h2>6. Kârnet ile Otomatik Hesaplayın</h2>
<p>Yukarıdaki formülü her ürün için tek tek hesaplamak hem zaman alır hem de hata riski taşır. Kârnet, tüm bu değişkenleri sizin yerinize hesaplayarak her ürün için net kâr marjınızı, başabaş noktanızı ve kârlılık skoru gösterir.</p>
<p>Ücretsiz hesap oluşturun, ürünlerinizi analiz edin ve hangisinin gerçekten para kazandırdığını görün.</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
