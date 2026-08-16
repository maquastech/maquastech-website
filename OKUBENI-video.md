# Sayfadaki videolar

Sayfada iki video var, ikisi de sessiz ve kendi içinde döngülü:

| Dosya | Yer | İçerik | Süre |
|---|---|---|---|
| klip1.mp4 | Ana sayfa üst bölüm | Kayar otomatta pirinç işleme | 5 sn (15 sn, 3x) |
| klip2.mp4 | Hakkımızda bölümü | CNC tornada metal işleme | 3 sn (9 sn, 3x) |

`video-poster.jpg` ve `klip2-poster.jpg` videolar yüklenene kadar gösterilen
karelerdir. Videoyu değiştirirseniz posteri de yenileyin.

## Yeni video hazırlama

ffmpeg gerekiyor (ücretsiz): https://ffmpeg.org/download.html

```
ffmpeg -i ham-video.mp4 -ss 0 -t 15 -an -vf "setpts=PTS/3,scale=608:1080:flags=lanczos,fps=30" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart klip1.mp4
```

Poster karesi:

```
ffmpeg -ss 0.3 -i klip1.mp4 -frames:v 1 video-poster.jpg
```

Parametreler:

- `-ss 0 -t 15` : 0. saniyeden itibaren 15 saniye alır.
  Başka yerden kesmek için `-ss 12 -t 15` gibi değiştirin.
- `setpts=PTS/3` : 3 kat hızlandırır (15 sn -> 5 sn).
- `-an` : sesi kaldırır. Otomatik oynayan video sessiz olmalıdır.
- `-crf 27` : kalite/boyut dengesi. Sayı büyürse dosya küçülür.
- `scale=608:1080` : dikey video ölçüsü.

## Önemli

Dosyayı **1 MB civarında** tutun. Ana sayfada otomatik oynayan video mobil
veriyle de iniyor; büyük dosya sayfayı yavaşlatır. Boyut aşarsa `-crf`
değerini 29-31'e çıkarın.
