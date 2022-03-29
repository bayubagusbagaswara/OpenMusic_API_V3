# API Specification

# Kriteria 1 : Ekspor Lagu Pada Playlist
API yang Anda buat harus tersedia fitur ekspor lagu pada playlist melalui route:

Method : `POST`
URL : `/export/playlists/{playlistId}`


#### Body Request:

```json
{
  "targetEmail": "string"
}
```

Ketentuan:

- Wajib menggunakan message broker dengan menggunakan RabbitMQ.
- Nilai host server RabbitMQ wajib menggunakan environment variable RABBITMQ_SERVER
- Hanya pemilik Playlist yang boleh mengekspor lagu.
- Wajib mengirimkan program consumer.
- Hasil ekspor berupa data json.
- Dikirimkan melalui email menggunakan nodemailer.
- Kredensial alamat dan password email pengirim wajib menggunakan environment variable `MAIL_ADDRESS` dan `MAIL_PASSWORD`.
- Serta, nilai host dan port dari server SMTP juga wajib menggunakan environment variable `MAIL_HOST` dan `MAIL_PORT`.

#### Response yang harus dikembalikan:

- Status Code: 201
- Response Body:

```json
{
  "status": "success",
  "message": "Permintaan Anda sedang kami proses",
}
```
Struktur data JSON yang diekspor adalah seperti ini:

```json
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Song",
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      },
      {
        "id": "song-poax5Oy7L8WKllqw",
        "title": "Centimeteries of London",
        "performer": "Coldplay"
      },
      {
        "id": "song-Qalokam7L8WKf74l",
        "title": "Lost!",
        "performer": "Coldplay"
      }
    ]
  }
}
```

# Kriteria 2 : Mengunggah Sampul Album
API yang Anda buat harus dapat mengunggah sampul album melalui route:

- Method : `POST`
- URL : `/albums/{id}/covers`
- Body Request (Form data)

```json
{
  "cover": "file"
}
```

Ketentuan:

- Tipe konten yang diunggah harus merupakan MIME types dari images.
- Ukuran file cover maksimal 512000 Bytes.
- Anda bisa menggunakan `File System (lokal)` atau `S3 Bucket` dalam menampung object.
- Bila menggunakan S3 Bucket, nama bucket wajib menggunakan variable environment AWS_BUCKET_NAME.

#### Response yang harus dikembalikan:

- Status Code: 201
- Response Body:

```json
{
    "status": "success",
    "message": "Sampul berhasil diunggah"
}
```

Respons dari endpoint `GET /albums/{id}` harus menampilkan properti coverUrl. Itu berarti, alamat atau nama sampul album harus disimpan di dalam database. Berikut respons yang harus dikembalikan oleh endpoint GET /albums/{id}:

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "coverUrl": "http://...."
    }
  }
}
```

Ketentuan:

- URL gambar harus dapat diakses dengan baik.
- Bila album belum memiliki sampul, maka coverUrl bernilai null.
- Bila menambahkan sampul pada album yang sudah memiliki sampul, maka sampul lama akan tergantikan.

# Kriteria 3 : Menyukai Album
API harus memiliki fitur menyukai, batal menyukai, serta melihat jumlah yang menyukai album. Berikut spesifikasinya:

Keterangan:

- Menyukai atau batal menyukai album merupakan resource strict sehingga dibutuhkan autentikasi untuk mengaksesnya. Hal ini bertujuan untuk mengetahui apakah pengguna sudah menyukai album.
Jika pengguna belum menyukai album, maka aksi POST /albums/{id}/likes adalah menyukai album. Jika pengguna sudah menyukai album, maka aksinya batal menyukai.

# Kriteria 4 : Menerapkan Server-Side Cache
Menerapkan server-side cache pada jumlah yang menyukai sebuah album (GET /albums/{id}/likes).
Cache harus bertahan selama 30 menit.
Respons yang dihasilkan dari cache harus memiliki custom header properti X-Data-Source bernilai “cache”.
Cache harus dihapus setiap kali ada perubahan jumlah like pada album dengan id tertentu.
Memory caching engine wajib menggunakan Redis atau Memurai (Windows).
Nilai host server Redis wajib menggunakan environment variable REDIS_SERVER

# Kriteria 5 : Pertahankan Fitur OpenMusic API versi 2 dan 1

Pastikan fitur dan kriteria OpenMusic API versi 2 dan 1 tetap dipertahankan seperti:

- Pengelolaan Data Album
- Pengelolaan Data Song
- Fitur Registrasi dan Autentikasi Pengguna
- Pengelolaan Data Playlist 
- Menerapkan Foreign Key
- Menerapkan Data Validation
- Penanganan Eror (Error Handling)

# Testing
- Kemudian pada variabel `exportEmail` berikan nilai dengan email Anda. Tujuannya, agar pengujian ekspor lagu di playlist akan terkirim ke email Anda. Sehingga Anda bisa memvalidasi program consumer Anda dapat mengirimkan email dengan baik.

- Kemudian buka request `Uploads -> Add Cover Album with Valid File`. Di sini Anda perlu menetapkan berkas yang akan digunakan dalam mengunggah gambar. Silakan unduh gambar berikut.

- Kemudian buka tabs Body dan gunakan gambar tersebut pada key data.

- Khusus untuk permintaan pada folder Uploads, jangan ikut sertakan untuk dijalankan menggunakan collections. Karena pengujian akan selalu gagal. Jadi pastikan ketika hendak menjalankan seluruh permintaan pada collection, pengujian pada folder Uploads tidak dicentang.


- truncate albums, songs, users, authentications, playlists, playlist_songs, playlist_song_activities, collaborations, user_album_likes;