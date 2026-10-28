
# fliqClock - Modern Web Flip Clock 🕰️

Dünyaca ünlü yaprak saat (flip clock) ekran koruyucusu tasarımının modern web teknolojileri (HTML5, CSS 3D Transforms, Vanilla JS) ile geliştirilmiş; telefon, tablet ve masaüstü uyumlu, PWA destekli sürümü.

🔗 **Canlı Proje Linki:** [https://atqb2.github.io/fliqClock/](https://atqb2.github.io/fliqClock/)

---

## 🌟 Özellikler

- 🕒 **3 Farklı Çalışma Modu**:
  - **Saat (Clock)**: 12s / 24s formatı, AM/PM rozeti, Türkçe tarih gösterimi
  - **Kronometre (Stopwatch)**: Saat, dakika, saniye ileri sayım; Başlat/Durdur/Sıfırla ve Tur (Lap) kaydetme listesi
  - **Zamanlayıcı (Timer)**: Saat, dakika, saniye geri sayım; 1dk - 60dk hızlı hazır süreler (Pomodoro dahil), özel süre kurma modalı ve süre dolduğunda Web Audio polifonik sesli alarm + görsel uyarı
- 📱 **Telefon & Tablet Tam Uyumluluğu (Responsive & Dock Modu)**:
  - **Yatay Masa / Komodin Saati**: Telefonu veya tableti şarja takıp yatay koyduğunuzda kartlar ekran yüksekliğine göre otomatik orantılanır.
  - **Dikey Görünüm**: 2 kart veya 3 kart (saniye açıkken) ekrandan asla taşmaz (`nowrap`), alt satıra kaymaz.
  - **Çentik ve Dinamik Ada Uyumu**: iPhone ve modern tabletlerde `safe-area-inset` ile kontroller çentiğin altında kalmaz.
  - **Çift Dokunuş Tam Ekran**: Ekrana çift dokunarak anında tam ekran moduna geçiş.
- 💡 **Ekranı Açık Tutma (Screen Wake Lock API)**:
  - Telefon veya tabletiniz masa saati olarak açıkken ekranın kendi kendine kapanmasını/kilitlenmesini engeller. Tek tıkla (veya `W` tuşuyla) açılıp kapatılabilir.
- 📲 **PWA Desteği (Ana Ekrana Ekle - Uygulama Gibi Kullan)**:
  - `manifest.json` ve özel simgesiyle Safari / Chrome üzerinden "Ana Ekrana Ekle" diyerek tam ekran bağımsız bir uygulama gibi çalıştırabilirsiniz.
- ⏱️ **3D Mekanik Flip Animasyonu**: Gerçekçi kart dönüşü, ışık ve gölge geçişleri, menteşe ve orta kesim çizgisi detayları.
- ⚡ **Saniye Kartı (Opsiyonel / Mod Duyarlı)**: Saat modunda açılıp kapatılabilir; kronometre ve zamanlayıcıda tam hassasiyetle aktif.
- 🎨 **5 Farklı Tema**:
  - **Fliqlo Siyah** (Orijinal derin siyah)
  - **Minimal Beyaz** (Modern aydınlık tema)
  - **Retro Amber** (Sıcak turuncu/kehribar vintage görünüm)
  - **Matrix Neon** (Siber yeşil fosforlu)
  - **Nord Kutup** (Zarif soğuk kutup mavisi)
- 🔤 **8 Farklı Yazı Tipi (Font)**:
  - **Inter**: Orijinal Fliqlo tarzı, net ve minimalist
  - **Bebas Neue**: Klasik havalimanı split-flap tabelası
  - **Oswald**: Güçlü ve kondanse endüstriyel
  - **JetBrains Mono**: Yazılımcı / Monospace tarzı
  - **Orbitron**: Siber / Dijital fütüristik
  - **Playfair Display**: Lüks ve klasik serif
  - **Space Grotesk**: Modern ve geometrik
  - **Syne**: Cesur ve sanatsal
- 🔊 **Mekanik Ses Efekti & Alarm**: Web Audio API ile sıfır harici dosya bağımlılığıyla üretilen gerçekçi yaprak klik sesi ve zamanlayıcı alarm melodisi.
- 🖥️ **Ekran Koruyucu (Screensaver) Deneyimi**: Fare veya dokunma 3 saniye hareketsiz kaldığında kontroller ve imleç otomatik gizlenir.
- 📐 **Boyutlandırma**: %50 ile %160 arasında ölçeklendirme.
- 💾 **Kalıcı Ayarlar**: Seçimleriniz tarayıcı hafızasında (`localStorage`) saklanır.

---

## ⌨️ Klavye Kısayolları

| Tuş | İşlev |
| :--- | :--- |
| `1` | Saat Moduna Geç |
| `2` | Kronometre Moduna Geç |
| `3` | Zamanlayıcı Moduna Geç |
| `Space` | Kronometre / Zamanlayıcı Başlat & Duraklat (Saat modunda Ayarlar) |
| `R` | Sıfırla (Kronometre & Zamanlayıcı) |
| `L` | Tur Ekle (Kronometre) |
| `A` | Süre Belirle Modalı (Zamanlayıcı) |
| `Enter` | Çalan Alarmı Kapat |
| `F` | Tam Ekran (Fullscreen) Aç / Kapat |
| `W` | Ekranı Sürekli Açık Tut (Wake Lock) Aç / Kapat |
| `T` | 12 Saat / 24 Saat Formatı Değiştir |
| `S` | Saniye Kartını Göster / Gizle (Saat modu) |
| `D` | Temayı Değiştir (Temalar arası döngü) |
| `O` | Fontu Değiştir (Fontlar arası döngü) |
| `M` | Mekanik Klik Sesini Aç / Kapat |
| `H` | Ayarlar Menüsünü Aç / Kapat |
| `Esc` | Açık Modalları Kapat |

---

## 🌐 GitHub Pages ile %100 ÜCRETSİZ Yayında

Projeniz GitHub Pages ile barındırılmaktadır ve sonsuza kadar ücretsizdir.

- **Canlı Adres:** [https://atqb2.github.io/fliqClock/](https://atqb2.github.io/fliqClock/)
- **Depo (Repository):** [https://github.com/atqb2/fliqClock](https://github.com/atqb2/fliqClock)

---

## 📱 Telefonda / Tablette "Uygulama" Olarak Kullanma

- **iPhone / iPad (iOS Safari)**:
  - Sitenin linkini Safari'de açın: `https://atqb2.github.io/fliqClock/`
  - Alttaki **Paylaş** (kare içinden çıkan ok) butonuna dokunun.
  - **"Ana Ekrana Ekle"** (Add to Home Screen) seçeneğini seçin.
  - Artık ana ekranınızda fliqClock simgesi yer alır; açtığınızda adres çubuğu olmadan tam ekran bir uygulama gibi çalışır.
- **Android (Chrome / Brave / Edge)**:
  - Linki Chrome'da açın: `https://atqb2.github.io/fliqClock/`
  - Sağ üstteki **üç nokta** menüsüne dokunun.
  - **"Uygulamayı Yükle"** veya **"Ana Ekrana Ekle"** seçeneğine dokunun.
