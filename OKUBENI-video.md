# Ana sayfa videoları

Bu depoya (index.html ile aynı yere) `klip1.mp4` ve `klip2.mp4` dosyalarını koyun.
Site açıldığında dosyaları otomatik bulur ve sırayla döndürür.
Dosya yoksa yedek görsel gösterilir — site hiçbir şekilde bozulmaz.

Daha fazla klip eklemek isterseniz `app.js` içindeki
`KLIPLER` listesine dosya adını ekleyin.

## Videoları hazırlama

ffmpeg gerekiyor (ücretsiz): https://ffmpeg.org/download.html

İlk 15 saniyeyi alıp 3 kat hızlandırır, sesi kaldırır, 5 saniyelik klip üretir:

```
ffmpeg -i ham-video1.mp4 -ss 0 -t 15 -an -vf "setpts=PTS/3,scale=1280:-2,fps=30" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart klip1.mp4
```

```
ffmpeg -i ham-video2.mp4 -ss 0 -t 15 -an -vf "setpts=PTS/3,scale=1280:-2,fps=30" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart klip2.mp4
```

Parametreler:

- `-ss 0 -t 15` : videonun 0. saniyesinden itibaren 15 saniye alır.
  Başka bir yerden kesmek için `-ss 12 -t 15` gibi değiştirin.
- `setpts=PTS/3` : 3 kat hızlandırır (15 sn → 5 sn).
- `-an` : sesi kaldırır. Ana sayfada otomatik oynayan video sessiz olmalıdır.
- `-crf 26` : dosya boyutu / kalite dengesi. Sayı büyürse dosya küçülür.
- `scale=1280:-2` : genişliği 1280 piksele düşürür.

## Önemli

Her klibi **2 MB altında** tutmaya çalışın. Ana sayfada otomatik oynayan
videolar mobil veri üzerinden de iniyor; büyük dosya sayfayı yavaşlatır.

Boyutu kontrol edin; 2 MB'ı aşıyorsa `-crf` değerini 28-30'a çıkarın.
