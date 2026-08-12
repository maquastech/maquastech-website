# MAQUAS TECHNIC — Web Sitesi

Statik site. Derleme (build) adımı yok — dosyalar olduğu gibi yayınlanır.

## Dosya yapısı

```
index.html          Ana sayfa (tüm bölümler)
tesekkurler.html    Form gönderimi sonrası yönlendirilen sayfa
404.html            Sayfa bulunamadı (Netlify otomatik kullanır)
style.css    Tüm stiller
app.js       Mobil menü, aktif menü takibi, hero video döngüsü
       Logo, favicon, sosyal medya görseli
       Ana sayfa videoları (bkz. OKUBENI-video.md)
netlify.toml        Güvenlik başlıkları ve önbellek ayarları
robots.txt          Arama motoru izinleri
```

## Yayına alma

GitHub deposuna push → Netlify otomatik yayınlar. Ortalama 30 saniye.

## Domain alındıktan sonra yapılacaklar

1. `index.html` içindeki `ALANADINIZ.com` geçen 3 satırı gerçek adresle değiştir
2. `robots.txt` içindeki Sitemap satırını aç ve güncelle
3. Netlify panelinden "Domain management" → alan adını bağla

## İletişim formu

Netlify Forms kullanılıyor. Gelen mesajlar Netlify panelinde
**Forms → teklif-talebi** altında görünür. Bildirim e-postası için:
Site settings → Forms → Form notifications.

## Henüz eklenmedi

- [ ] Telefon / e-posta / adres bilgileri
- [ ] KVKK aydınlatma metni ve form onay kutusu
- [ ] Ana sayfa video klipleri (klip1.mp4, klip2.mp4)
- [ ] Gerçek üretim fotoğrafları
- [ ] Logonun tasarımcı/tabelacıdaki orijinal vektör dosyası
