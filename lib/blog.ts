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
  {
    slug: 'n11-komisyon-oranlari-2026',
    title: 'N11 Komisyon Oranları 2026 — Tam Kategori Listesi',
    description:
      "N11'de hangi kategoride ne kadar komisyon ödüyorsunuz? 2026 güncel N11 komisyon oranlarının tam listesi, örnek hesaplama ve kâra etkisi.",
    date: '2026-06-09',
    readTime: 5,
    content: `
<p>N11, Türkiye'nin köklü pazaryerlerinden biri olarak milyonlarca satıcıya ev sahipliği yapıyor. Ancak pek çok satıcı N11 komisyon oranlarını tam olarak bilmeden fiyatlandırma yapıyor. Bu yazıda 2026 yılı güncel N11 komisyon oranlarını kategori bazında derledik.</p>

<h2>N11 Komisyon Oranları 2026 — Tam Liste</h2>
<table>
  <thead><tr><th>Kategori</th><th>Komisyon Oranı</th></tr></thead>
  <tbody>
    <tr><td>Elektronik</td><td>%8 – %10</td></tr>
    <tr><td>Bilgisayar &amp; Tablet</td><td>%8 – %10</td></tr>
    <tr><td>Telefon &amp; Aksesuar</td><td>%10 – %14</td></tr>
    <tr><td>Beyaz Eşya</td><td>%8 – %10</td></tr>
    <tr><td>Küçük Ev Aletleri</td><td>%10 – %14</td></tr>
    <tr><td>Giyim &amp; Moda</td><td>%16 – %20</td></tr>
    <tr><td>Ayakkabı &amp; Çanta</td><td>%16 – %20</td></tr>
    <tr><td>Spor &amp; Outdoor</td><td>%12 – %16</td></tr>
    <tr><td>Kozmetik &amp; Kişisel Bakım</td><td>%14 – %18</td></tr>
    <tr><td>Anne &amp; Bebek</td><td>%10 – %14</td></tr>
    <tr><td>Oyuncak</td><td>%12 – %16</td></tr>
    <tr><td>Kitap &amp; Kırtasiye</td><td>%10 – %14</td></tr>
    <tr><td>Ev &amp; Yaşam</td><td>%12 – %16</td></tr>
    <tr><td>Mutfak</td><td>%12 – %16</td></tr>
    <tr><td>Bahçe &amp; Yapı Market</td><td>%10 – %14</td></tr>
    <tr><td>Pet Shop</td><td>%12 – %16</td></tr>
    <tr><td>Otomotiv</td><td>%10 – %12</td></tr>
    <tr><td>Sağlık &amp; Wellness</td><td>%14 – %18</td></tr>
  </tbody>
</table>
<p><strong>Not:</strong> N11 komisyon oranları dönemsel güncellenebilir. Kategorinize özel oranı N11 satıcı panelinizden kontrol edin.</p>

<h2>N11 Kâr Hesaplama Örneği</h2>
<p>Giyim kategorisinde 250 TL'ye satılan bir ürün için örnek hesaplama:</p>
<table>
  <thead><tr><th>Kalem</th><th>Tutar</th></tr></thead>
  <tbody>
    <tr><td>Satış Fiyatı</td><td>250 TL</td></tr>
    <tr><td>N11 Komisyonu (%18)</td><td>-45 TL</td></tr>
    <tr><td>Kargo</td><td>-22 TL</td></tr>
    <tr><td>Ürün Maliyeti</td><td>-100 TL</td></tr>
    <tr><td>Paketleme</td><td>-7 TL</td></tr>
    <tr><td>İade Payı (%12)</td><td>-5,52 TL</td></tr>
    <tr><td><strong>Net Kâr</strong></td><td><strong>70,48 TL</strong></td></tr>
    <tr><td><strong>Kâr Marjı</strong></td><td><strong>%28,2</strong></td></tr>
  </tbody>
</table>

<h2>N11 ile Diğer Pazaryerlerinin Komisyon Karşılaştırması</h2>
<table>
  <thead><tr><th>Pazaryeri</th><th>Giyim Komisyonu</th><th>Elektronik Komisyonu</th></tr></thead>
  <tbody>
    <tr><td>Trendyol</td><td>%18 – %22</td><td>%8 – %10</td></tr>
    <tr><td>Hepsiburada</td><td>%18 – %22</td><td>%8 – %12</td></tr>
    <tr><td>N11</td><td>%16 – %20</td><td>%8 – %10</td></tr>
    <tr><td>Amazon TR</td><td>%8 – %15</td><td>%8 – %10</td></tr>
  </tbody>
</table>
<p>N11, özellikle giyim kategorisinde Trendyol ve Hepsiburada'ya kıyasla biraz daha düşük komisyon oranı sunuyor. Ancak komisyon tek kriter değil — pazaryerinin trafik hacmi, müşteri kitlesi ve reklam maliyetleri de hesaba katılmalı.</p>

<h2>N11'de Kârlılığı Artırmak İçin İpuçları</h2>
<ul>
  <li><strong>Kategori seçimine dikkat edin:</strong> Aynı ürün farklı alt kategorilerde farklı komisyona tabi olabilir.</li>
  <li><strong>Kargo optimizasyonu yapın:</strong> Desi bazlı kargo hesabı yaparak paket boyutunu küçültün.</li>
  <li><strong>İade oranını takip edin:</strong> Özellikle giyimde iade oranı yüksek olabilir, bunu fiyata yansıtın.</li>
  <li><strong>Çoklu pazaryeri karşılaştırması yapın:</strong> Aynı ürünü hangi platformda satmanın daha kârlı olduğunu hesaplayın.</li>
</ul>

<h2>Kârnet ile N11 Kâr Hesaplama</h2>
<p>N11 komisyon oranlarını tek tek aramak ve manuel hesaplama yapmak yerine Kârnet'i kullanabilirsiniz. Kategoriyi seçtiğinizde komisyon otomatik gelir, tüm maliyet kalemleri dahil net kârınızı saniyeler içinde görürsünüz.</p>
<p>Ücretsiz hesap oluşturun, N11 ürünlerinizi analiz edin.</p>
    `.trim(),
  },
  {
    slug: 'amazon-tr-komisyon-oranlari-2026',
    title: 'Amazon TR Komisyon Oranları 2026 — Satıcı Rehberi',
    description:
      "Amazon Türkiye'de satış yapmayı düşünüyor musunuz? 2026 güncel Amazon TR komisyon oranları, referral fee hesaplama ve net kâr analizi.",
    date: '2026-06-09',
    readTime: 6,
    content: `
<p>Amazon Türkiye (amazon.com.tr), 2021'de açılışından bu yana Türk e-ticaret pazarında hızla büyüyen bir platform. Trendyol ve Hepsiburada'ya alışkın satıcılar için Amazon'un komisyon yapısı biraz farklı. Bu yazıda 2026 yılı güncel Amazon TR komisyon oranlarını ve satıcı maliyetlerini açıklıyoruz.</p>

<h2>Amazon TR Komisyon Oranları (Referral Fee) 2026</h2>
<table>
  <thead><tr><th>Kategori</th><th>Komisyon Oranı</th><th>Minimum Komisyon</th></tr></thead>
  <tbody>
    <tr><td>Elektronik</td><td>%8</td><td>2 TL</td></tr>
    <tr><td>Bilgisayar &amp; Aksesuar</td><td>%8</td><td>2 TL</td></tr>
    <tr><td>Telefon &amp; Aksesuar</td><td>%8 – %10</td><td>2 TL</td></tr>
    <tr><td>Beyaz Eşya</td><td>%8</td><td>2 TL</td></tr>
    <tr><td>Giyim &amp; Moda</td><td>%10 – %15</td><td>2 TL</td></tr>
    <tr><td>Ayakkabı &amp; Çanta</td><td>%10 – %15</td><td>2 TL</td></tr>
    <tr><td>Kozmetik &amp; Kişisel Bakım</td><td>%8 – %12</td><td>2 TL</td></tr>
    <tr><td>Kitap</td><td>%8 – %12</td><td>2 TL</td></tr>
    <tr><td>Ev &amp; Yaşam</td><td>%10 – %14</td><td>2 TL</td></tr>
    <tr><td>Oyuncak</td><td>%10 – %14</td><td>2 TL</td></tr>
    <tr><td>Spor &amp; Outdoor</td><td>%10 – %14</td><td>2 TL</td></tr>
    <tr><td>Otomotiv</td><td>%8 – %12</td><td>2 TL</td></tr>
    <tr><td>Anne &amp; Bebek</td><td>%8 – %12</td><td>2 TL</td></tr>
    <tr><td>Pet Shop</td><td>%10 – %14</td><td>2 TL</td></tr>
  </tbody>
</table>
<p><strong>Not:</strong> Amazon komisyon oranları kategori ve ürün fiyatına göre değişebilir. Kesin oranlar için Amazon Satıcı Merkezi'ni kontrol edin.</p>

<h2>Amazon TR'nin Diğer Maliyetleri</h2>
<p>Komisyon dışında Amazon'da satıcının karşılaştığı başlıca maliyet kalemleri:</p>
<ul>
  <li><strong>Satış planı ücreti:</strong> Bireysel planda satış başına sabit ücret, profesyonel planda aylık abonelik.</li>
  <li><strong>FBA (Fulfillment by Amazon) ücreti:</strong> Depolama + gönderim hizmeti kullanıyorsanız ek maliyet.</li>
  <li><strong>Kargo maliyeti:</strong> Kendi lojistiğinizi kullanıyorsanız (FBM) kargo bedeli sizden.</li>
  <tr><td>Reklam harcaması:</td> Amazon Sponsored Products reklamları kâr marjını doğrudan etkiler.</li>
</ul>

<h2>Amazon TR Kâr Hesaplama Örneği</h2>
<p>Elektronik kategorisinde 500 TL'ye satılan bir ürün (FBM — kendi kargonuzla):</p>
<table>
  <thead><tr><th>Kalem</th><th>Tutar</th></tr></thead>
  <tbody>
    <tr><td>Satış Fiyatı</td><td>500 TL</td></tr>
    <tr><td>Amazon Komisyonu (%8)</td><td>-40 TL</td></tr>
    <tr><td>Kargo</td><td>-28 TL</td></tr>
    <tr><td>Ürün Maliyeti</td><td>-250 TL</td></tr>
    <tr><td>Paketleme</td><td>-8 TL</td></tr>
    <tr><td>İade Payı (%8)</td><td>-5,6 TL</td></tr>
    <tr><td>Reklam</td><td>-20 TL</td></tr>
    <tr><td><strong>Net Kâr</strong></td><td><strong>148,4 TL</strong></td></tr>
    <tr><td><strong>Kâr Marjı</strong></td><td><strong>%29,7</strong></td></tr>
  </tbody>
</table>

<h2>Amazon TR'de Satış Kârlı mı?</h2>
<p>Amazon TR, özellikle elektronik ve ev &amp; yaşam kategorilerinde Trendyol ve Hepsiburada'dan düşük komisyon sunuyor. Ancak platform, Türkiye'de rakiplerine kıyasla daha düşük trafiğe sahip. Bu şu anlama geliyor:</p>
<ul>
  <li>Komisyon avantajı var, trafik dezavantajı var.</li>
  <li>Reklam harcaması yapmazsanız ürününüz görünmeyebilir.</li>
  <li>Çoklu platform stratejisi (Trendyol + Amazon) en iyi sonucu verir.</li>
</ul>

<h2>Kârnet ile Amazon TR Kâr Analizi</h2>
<p>Kârnet'te Amazon TR desteği yakında geliyor. Şimdiden Trendyol ve Hepsiburada için kâr analizini yapabilir, aynı ürünü hangi platformda satmanın daha avantajlı olduğunu görebilirsiniz.</p>
<p>Ücretsiz deneyin, satış stratejinizi veriye dayalı kurun.</p>
    `.trim(),
  },
  {
    slug: 'trendyol-basbas-noktasi-hesaplama',
    title: "Trendyol'da Başabaş Noktası Nasıl Hesaplanır?",
    description:
      "Başabaş noktası, zarar etmeden satış yapabileceğiniz minimum fiyattır. Trendyol satıcıları için adım adım başabaş noktası hesaplama rehberi ve formülü.",
    date: '2026-06-09',
    readTime: 5,
    content: `
<p>Başabaş noktası, bir ürünü ne kadar düşük fiyata satabileceğinizin sınırını gösterir. Bu noktanın altında her satış zarar ettirir. Trendyol'da fiyat rekabetine girişmeden önce başabaş noktanızı bilmek şarttır.</p>

<h2>Başabaş Noktası Nedir?</h2>
<p>Başabaş noktası (break-even point), toplam gelirin toplam maliyete eşit olduğu satış fiyatıdır. Bu fiyatın altında sattığınızda kâr sıfırlanır ve zarar başlar.</p>
<p>Trendyol'da başabaş noktası hesaplaması diğer kanallardan farklıdır çünkü Trendyol'a özgü maliyetler (komisyon, zorunlu kargo, iade kesintisi) hesaba katılmalıdır.</p>

<h2>Trendyol Başabaş Noktası Formülü</h2>
<pre><code>Başabaş Fiyatı = (Ürün Maliyeti + Kargo + Paketleme + İade Payı + Sabit Gider Payı)
                 ÷ (1 − Komisyon Oranı)</code></pre>
<p>Komisyon oranı yüzde olarak değil ondalık olarak kullanılır. Örneğin %20 komisyon için 0,20.</p>

<h2>Adım Adım Örnek Hesaplama</h2>
<p>Giyim kategorisinde bir ürün için:</p>
<table>
  <thead><tr><th>Maliyet Kalemi</th><th>Tutar</th></tr></thead>
  <tbody>
    <tr><td>Ürün Maliyeti</td><td>120 TL</td></tr>
    <tr><td>Kargo</td><td>25 TL</td></tr>
    <tr><td>Paketleme</td><td>8 TL</td></tr>
    <tr><td>İade Payı (%15 iade oranı)</td><td>~7 TL</td></tr>
    <tr><td>Sabit Gider Payı</td><td>10 TL</td></tr>
    <tr><td><strong>Toplam Maliyet</strong></td><td><strong>170 TL</strong></td></tr>
  </tbody>
</table>
<p>Trendyol giyim komisyonu: %20</p>
<pre><code>Başabaş Fiyatı = 170 ÷ (1 − 0,20)
               = 170 ÷ 0,80
               = 212,50 TL</code></pre>
<p>Bu üründe <strong>212,50 TL</strong>'nin altında satış yapmak zarar demektir. 300 TL'ye satarsanız net kârınız yaklaşık 27,5 TL olur.</p>

<h2>Kampanya Dönemlerinde Başabaş Noktası</h2>
<p>Trendyol kampanyalarında (11.11, Süper Fırsatlar, Efsane Cuma) fiyat indirimi yapıyorsanız başabaş noktanızı bilmeniz kritik önem taşır.</p>
<table>
  <thead><tr><th>Senaryo</th><th>Başabaş Fiyatı</th><th>Kampanya İndirimi</th><th>Sonuç</th></tr></thead>
  <tbody>
    <tr><td>Normal</td><td>212,50 TL</td><td>—</td><td>300 TL'de +87,5 TL kâr</td></tr>
    <tr><td>%10 indirim</td><td>212,50 TL</td><td>270 TL</td><td>+57,5 TL kâr</td></tr>
    <tr><td>%20 indirim</td><td>212,50 TL</td><td>240 TL</td><td>+27,5 TL kâr</td></tr>
    <tr><td>%30 indirim</td><td>212,50 TL</td><td>210 TL</td><td>⚠️ Zarar!</td></tr>
  </tbody>
</table>
<p>%30 indirim ile 210 TL'ye sattığınızda başabaş noktanızın (212,50 TL) altına düşüyorsunuz. Bu fark küçük görünse de yüzlerce satışta ciddi zarar anlamına gelir.</p>

<h2>İade Oranı Başabaş Noktasını Nasıl Etkiler?</h2>
<p>İade oranı arttıkça başabaş noktanız da yükselir. %10 iade oranı yerine %25 iade oranında çalışıyorsanız, başabaş fiyatınız yaklaşık 15–20 TL daha yüksek olacaktır.</p>

<h2>Kârnet ile Otomatik Başabaş Hesabı</h2>
<p>Bu hesaplamaları her ürün için tek tek yapmak yerine Kârnet'i kullanabilirsiniz. Maliyet kalemlerini girdiğinizde başabaş noktası otomatik hesaplanır ve 3 farklı senaryo (normal, kampanya, yüksek iade) için gösterilir.</p>
<p>Ücretsiz deneyin — kampanyaya girmeden önce başabaş noktanızı bilin.</p>
    `.trim(),
  },
  {
    slug: 'e-ticarette-iade-orani-kar-etkisi',
    title: "E-Ticarette İade Oranı Kârı Nasıl Etkiler? Hesaplama Rehberi",
    description:
      "Trendyol ve Hepsiburada'da iade oranı kâr marjınızı doğrudan etkiler. İade maliyetini nasıl hesaplayacağınızı ve kâr analizinize nasıl yansıtacağınızı öğrenin.",
    date: '2026-06-09',
    readTime: 6,
    content: `
<p>E-ticarette iade oranı, birçok satıcının kâr hesabında gözden kaçırdığı kritik bir maliyet kalemidir. Özellikle giyim, ayakkabı ve elektronik gibi kategorilerde iade oranları %20-30'a ulaşabilir. Bu durum, görünürde kârlı olan bir ürünün gerçekte zarar ettirmesine neden olabilir.</p>

<h2>Türkiye'de Kategoriye Göre Ortalama İade Oranları</h2>
<table>
  <thead><tr><th>Kategori</th><th>Ortalama İade Oranı</th></tr></thead>
  <tbody>
    <tr><td>Giyim &amp; Moda</td><td>%20 – %35</td></tr>
    <tr><td>Ayakkabı</td><td>%25 – %40</td></tr>
    <tr><td>Elektronik</td><td>%5 – %15</td></tr>
    <tr><td>Kozmetik</td><td>%5 – %10</td></tr>
    <tr><td>Ev &amp; Yaşam</td><td>%8 – %15</td></tr>
    <tr><td>Oyuncak</td><td>%10 – %18</td></tr>
    <tr><td>Kitap &amp; Kırtasiye</td><td>%3 – %8</td></tr>
    <tr><td>Spor &amp; Outdoor</td><td>%10 – %20</td></tr>
    <tr><td>Anne &amp; Bebek</td><td>%8 – %15</td></tr>
  </tbody>
</table>

<h2>İade Maliyeti Hesaplama Formülü</h2>
<p>Bir iade işleminin gerçek maliyeti sadece kargo bedeli değildir:</p>
<pre><code>İade Maliyeti = Gidiş Kargo + Dönüş Kargo + Ürün Hasar Riski + İşlem Zamanı</code></pre>
<p>Ürün iade edildiğinde:</p>
<ul>
  <li>Gidiş kargo bedeli zaten ödenmiştir (geri alınmaz).</li>
  <li>Dönüş kargo ücreti genellikle satıcıya yansır (15–30 TL).</li>
  <li>Ürün %10–20 ihtimalle hasarlı veya kullanılmış döner, yeniden satılamaz.</li>
  <li>Müşteri hizmetleri zamanı ve işlem maliyeti.</li>
</ul>

<h2>İade Oranının Kâra Etkisi — Somut Örnek</h2>
<p>Giyim kategorisinde 300 TL'ye ürün satan bir satıcı, %15 iade oranıyla çalışıyor:</p>
<table>
  <thead><tr><th>Kalem</th><th>İadesiz (100 satış)</th><th>%15 İadeyle (100 satış)</th></tr></thead>
  <tbody>
    <tr><td>Fiili Satış Adedi</td><td>100</td><td>85</td></tr>
    <tr><td>Brüt Gelir</td><td>30.000 TL</td><td>25.500 TL</td></tr>
    <tr><td>Gidiş Kargo (100 adet)</td><td>-2.500 TL</td><td>-2.500 TL</td></tr>
    <tr><td>Dönüş Kargo (15 iade)</td><td>0 TL</td><td>-375 TL</td></tr>
    <tr><td>Komisyon (%20, 85 satış)</td><td>-6.000 TL</td><td>-5.100 TL</td></tr>
    <tr><td>Ürün Maliyeti (100 adet)</td><td>-12.000 TL</td><td>-12.000 TL</td></tr>
    <tr><td><strong>Net Kâr</strong></td><td><strong>9.500 TL</strong></td><td><strong>5.525 TL</strong></td></tr>
  </tbody>
</table>
<p>%15 iade oranı, net kârı <strong>%42 azaltıyor</strong>. İadesiz senaryoda 9.500 TL kazanırken, gerçekte 5.525 TL kazanıyorsunuz.</p>

<h2>İade Oranını Kâr Hesabınıza Nasıl Yansıtırsınız?</h2>
<p>Ürün başına düşen iade maliyeti şöyle hesaplanır:</p>
<pre><code>İade Payı = (İade Oranı × Dönüş Kargo Ücreti) + (İade Oranı × Hasar Riski × Ürün Maliyeti)</code></pre>
<p>Örnek: %15 iade, 25 TL dönüş kargo, %10 hasar riski, 120 TL ürün maliyeti:</p>
<pre><code>İade Payı = (0,15 × 25) + (0,15 × 0,10 × 120)
           = 3,75 + 1,80
           = 5,55 TL (ürün başına)</code></pre>
<p>Bu 5,55 TL'yi her ürünün maliyet hesabına eklemeniz gerekir.</p>

<h2>İade Oranını Düşürmek İçin İpuçları</h2>
<ul>
  <li><strong>Ürün fotoğrafları gerçekçi olsun:</strong> Renk ve boyut hatası en sık iade nedenidir.</li>
  <li><strong>Beden tablosu ekleyin:</strong> Giyimde beden kılavuzu iadenin önüne geçer.</li>
  <li><strong>Ürün açıklaması eksiksiz olsun:</strong> Müşterinin beklentisini doğru yönetin.</li>
  <li><strong>Kaliteli paketleme kullanın:</strong> Hasarlı ürün iade riskini azaltır.</li>
</ul>

<h2>Kârnet ile İade Etkisini Otomatik Hesaplayın</h2>
<p>İade oranınızı Kârnet'e girdiğinizde, her satış için iade maliyeti otomatik olarak kâr hesabına yansır. "İadesiz kâr" ile "gerçek kâr" arasındaki farkı anında görün.</p>
<p>Ücretsiz deneyin — iade oranınız kârınızı ne kadar eritiyor, hesaplayın.</p>
    `.trim(),
  },
  {
    slug: 'trendyol-vs-hepsiburada-karsilastirma',
    title: "Trendyol mu Hepsiburada mı? Satıcı için Kârlılık Karşılaştırması 2026",
    description:
      "Trendyol ve Hepsiburada komisyon oranları, kargo maliyetleri ve satıcı avantajları karşılaştırması. Aynı ürünü hangi platformda satmak daha kârlı?",
    date: '2026-06-09',
    readTime: 7,
    content: `
<p>Türkiye'deki e-ticaret satıcılarının sıkça sorduğu soru: Trendyol mu Hepsiburada mı? Her iki platform da güçlü kullanıcı tabanına sahip, ancak komisyon yapıları, kargo sistemleri ve satıcı destekleri arasında önemli farklar var. Bu yazıda aynı ürünü her iki platformda sattığınızda hangisinin daha kârlı olduğunu rakamlarla karşılaştırıyoruz.</p>

<h2>Genel Platform Karşılaştırması</h2>
<table>
  <thead><tr><th>Özellik</th><th>Trendyol</th><th>Hepsiburada</th></tr></thead>
  <tbody>
    <tr><td>Aylık Aktif Kullanıcı</td><td>~30 milyon+</td><td>~12 milyon+</td></tr>
    <tr><td>Pazar Payı (Türkiye)</td><td>~%60</td><td>~%20</td></tr>
    <tr><td>Satıcı Sayısı</td><td>~350.000+</td><td>~60.000+</td></tr>
    <tr><td>Komisyon Aralığı</td><td>%8 – %22</td><td>%8 – %25</td></tr>
    <tr><td>Müşteri Profili</td><td>Geniş kitle, her yaş</td><td>Orta-üst gelir, elektronik odaklı</td></tr>
  </tbody>
</table>

<h2>Komisyon Oranı Karşılaştırması</h2>
<table>
  <thead><tr><th>Kategori</th><th>Trendyol</th><th>Hepsiburada</th><th>Avantajlı Platform</th></tr></thead>
  <tbody>
    <tr><td>Elektronik</td><td>%8 – %10</td><td>%8 – %12</td><td>Trendyol</td></tr>
    <tr><td>Giyim &amp; Moda</td><td>%18 – %22</td><td>%18 – %22</td><td>Eşit</td></tr>
    <tr><td>Kozmetik</td><td>%15 – %20</td><td>%15 – %20</td><td>Eşit</td></tr>
    <tr><td>Ev &amp; Yaşam</td><td>%14 – %18</td><td>%12 – %18</td><td>Hepsiburada</td></tr>
    <tr><td>Spor &amp; Outdoor</td><td>%14 – %18</td><td>%14 – %18</td><td>Eşit</td></tr>
    <tr><td>Anne &amp; Bebek</td><td>%12 – %16</td><td>%10 – %15</td><td>Hepsiburada</td></tr>
    <tr><td>Küçük Ev Aletleri</td><td>%10 – %14</td><td>%10 – %14</td><td>Eşit</td></tr>
  </tbody>
</table>

<h2>Aynı Ürün İçin Kâr Karşılaştırması</h2>
<p>Kozmetik kategorisinde 200 TL satış fiyatlı, 70 TL maliyetli bir ürün:</p>
<table>
  <thead><tr><th>Kalem</th><th>Trendyol</th><th>Hepsiburada</th></tr></thead>
  <tbody>
    <tr><td>Satış Fiyatı</td><td>200 TL</td><td>200 TL</td></tr>
    <tr><td>Komisyon (%17 / %17)</td><td>-34 TL</td><td>-34 TL</td></tr>
    <tr><td>Kargo</td><td>-22 TL</td><td>-24 TL</td></tr>
    <tr><td>Ürün Maliyeti</td><td>-70 TL</td><td>-70 TL</td></tr>
    <tr><td>Paketleme</td><td>-6 TL</td><td>-6 TL</td></tr>
    <tr><td>İade Payı (%8)</td><td>-5,44 TL</td><td>-5,44 TL</td></tr>
    <tr><td><strong>Net Kâr</strong></td><td><strong>62,56 TL</strong></td><td><strong>60,56 TL</strong></td></tr>
    <tr><td><strong>Kâr Marjı</strong></td><td><strong>%31,3</strong></td><td><strong>%30,3</strong></td></tr>
  </tbody>
</table>
<p>Kozmetik örnekte Trendyol kargo avantajıyla biraz öne çıkıyor. Fark küçük görünse de yüksek hacimli satışlarda ciddi rakamlara dönüşür.</p>

<h2>Trendyol'un Avantajları</h2>
<ul>
  <li><strong>Çok daha yüksek trafik:</strong> Trendyol Türkiye'nin en çok ziyaret edilen e-ticaret sitesi.</li>
  <li><strong>Hızlı büyüme imkânı:</strong> Yeni satıcılar için keşfedilebilirlik daha yüksek.</li>
  <li><strong>Trendyol Go entegrasyonu:</strong> Anlık teslimat avantajı bazı kategorilerde öne çıkarıyor.</li>
  <li><strong>Geniş reklam araçları:</strong> Sponsorlu ürün, vitrin, koleksiyon reklamları.</li>
</ul>

<h2>Hepsiburada'nın Avantajları</h2>
<ul>
  <li><strong>Daha az rekabet:</strong> Satıcı sayısı Trendyol'dan az, öne çıkmak daha kolay.</li>
  <li><strong>Hepsiburada Premium alıcıları:</strong> Ortalama sipariş değeri daha yüksek olabilir.</li>
  <li><strong>Bazı kategorilerde düşük komisyon:</strong> Ev &amp; yaşam ve anne &amp; bebek kategorilerinde avantaj.</li>
  <li><strong>Satıcı destek kalitesi:</strong> Daha az satıcıya daha fazla ilgi gösterilebilir.</li>
</ul>

<h2>Hangi Platformu Seçmeli?</h2>
<p><strong>Sadece bir platform seçecekseniz:</strong> Trendyol ile başlayın. Trafiği çok daha yüksek, öğrenme eğrisi daha hızlı.</p>
<p><strong>İkinci platformu da açmayı düşünüyorsanız:</strong> Trendyol'da istikrar yakaladıktan sonra Hepsiburada'yı ekleyin. Aynı stok, iki farklı müşteri kitlesi.</p>
<p><strong>Elektronik satıyorsanız:</strong> Hepsiburada'nın elektronik odaklı müşteri kitlesi avantaj sağlayabilir.</p>

<h2>Kârnet ile İki Platformu Karşılaştırın</h2>
<p>Kârnet'te Trendyol ve Hepsiburada kâr karşılaştırması özelliği ücretsiz olarak mevcut. Aynı ürünü her iki platformda sattığınızda hangisinde daha fazla kazanacağınızı saniyeler içinde görürsünüz.</p>
<p>Ücretsiz deneyin — doğru platform kararını veriye dayalı alın.</p>
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
