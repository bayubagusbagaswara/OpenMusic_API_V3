# API Specification

# Kriteria 1 : Registrasi dan Autentikasi Pengguna

## Create User
- Method : `POST`
- Endpoint : `/users`
#### Request Body:

```json
{
  "username": "string",
  "password": "string",
  "fullname": "string"
}
```
#### Response
- Status Code : `201`
- Body :

```json
{
  "status": "success",
  "data": {
    "userId": "user_id"
  }
}
```

## Create Authentication
- Method : `POST`
- Endpoint : `/authentications`

#### Request Body

```json
{
  "username": "string",
  "password": "string"
}
```
#### Response
- Status Code : `201`
- Body :

```json
{
  "status": "success",
  "data": {
    "accessToken": "token",
    "refreshToken": "token"
  }
}
```

## Edit Authentication
- Method : `PUT`
- Endpoint : `/authentications`
#### Request Body

```json
{
  "refreshToken": "string"
}
```

#### Response
- Status Code : `200`
- Body :

```json
{
  "status": "success",
  "data": {
    "accessToken": "token"
  }
}
```

## Delete Authentication
- Method : `DELETE`
- Endpoint: `/authentications`
#### Request Body

```json
{
  "refreshToken": "string"
}
```

#### Response
- Status Code : `200`
- Body : 

```json
{
  "status": "success",
  "message": "any"
}
```

## Ketentuan:

- `Username` harus unik.
- Authentication menggunakan JWT token.
- JWT token harus mengandung payload berisi userId yang merupakan id dari user autentik.
- Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variable `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY`.
- Refresh token memiliki signature yang benar serta terdaftar di database.

# Kriteria 2 : Pengelolaan Data Playlist 

## Create Playlist
- Method : `POST`
- Endpoint : `/playlists`

#### Request Body

```json
{
  "name": "string"
}
```

#### Response
- Status Code : `201`
- Body :

```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist_id"
  }
}
```

## Get All Playlists
- Method : `GET`
- Endpoint : `/playlists`

#### Response
- Status Code : `200`
- Body :

```json
{
  "status": "success",
  "data": [
    {
      "playlistId": "string"
    },
    {
      "playlistId": "string"
    }
  ]
}
```

## Delete Playlist By ID
- Method : `DELETE`
- Endpoint : `/playlists/{id}`
#### Response Body 
- Status Code : `200`
- Body :

```json
{
  "status": "success",
  "message": "any" 
}
```

## Add Song To Playlist
- Method : `POST`
- Endpoint: `/playlists/{id}/songs`
#### Request Body

```json
{
  "songId": "string"
}
```
#### Response
- Status Code : `200`
- Body : 

```json
{
  "status": "success",
  "message": "any"
}
```

## Get Songs From Playlist
- Method : `GET`
- Endpoint : `/playlists/{id}/songs`
#### Response
- Status Code : `200`
- Body :

```json
{
  "status": "success",
  "data" : {
    "playlistId": "string",
    "songs":[
      {
        "songId": "string"
      },
      {
        "songId": "string"
      }
    ]
  }
}
```

## Delete Song From Playlist
- Method : `DELETE`
- Endpoint : `/playlists/{id}/songs`

#### Request Body 

```json
{
  "songId": "string"
}
```
#### Response
- Status Code : `200`
- Body :

```json
{
  "status": "success",
  "message": "any"
}
```
## Ketentuan:

- Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
- Playlist yang muncul pada `GET /playlists` hanya yang ia miliki saja.
- Hanya `owner playlist (atau kolabolator)` yang dapat menambahkan, melihat, dan menghapus lagu ke atau dari playlist.
- `songId` dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.

#### Response endpoint GET /playlist
```json
{
    "status": "success",
    "data": {
        "playlists": [
            {
                "id": "playlist-Qbax5Oy7L8WKf74l",
                "name": "Lagu Indie Hits Indonesia",
                "username": "dicoding"
            },
            {
                "id": "playlist-lmA4PkM3LseKlkmn",
                "name": "Lagu Untuk Membaca",
                "username": "dicoding"
            }
        ]
    }
}
```
#### Response endpoint GET /playlists/{id}/songs:
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-Mk8AnmCp210PwT6B",
      "name": "My Favorite Coldplay",
      "username": "dicoding",
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
}
```
#### Data Playlist
- Objek playlists yang disimpan pada server harus memiliki struktur seperti contoh di bawah ini:
```json
{
    "id": "playlist-Qbax5Oy7L8WKf74l",
    "name": "Lagu Indie Hits Indonesia",
    "owner": "user-Qbax5Oy7L8WKf74l",
}
```

## Keterangan:

- Properti `owner` merupakan `user_id` dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

# Kriteria 3 : Menerapkan Foreign Key

## Database wajib menerapkan Foreign Key
Contohnya relasi:
- Tabel songs terhadap albums;
- Tabel playlists terhadap users;
- Dan relasi tabel lainnya.

# Kriteria 4 : Menerapkan Data Validation
- Wajib menerapkan proses Data Validation pada Request Payload sesuai spesifikasi berikut:

## POST /users:
- username : string, required.
- password : string, required.
- fullname : string, required.
## POST /authentications:
- username : string, required.
- password : string, required.
## PUT /authentications:
- refreshToken : string, required.
## DELETE /authentications:
- refreshToken : string, required.
## POST /playlists:
- name : string, required.
# POST /playlists/{playlistId}/songs
- songId : string, required.

# Kriteria 5 : Penanganan Eror (Error Handling)

1. Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:

    - Status Code : `400 (Bad Request)`
    - Response Body :

    ```json
    {
      "status": "fail",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

2. Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:

    - Status Code: `404 (Not Found)`
    - Response body:

    ```json
    {
      "status": "fail",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

3. Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:

    - Status Code: `401 (Unauthorized)`
    - Response Body:

    ```json
    {
      "status": "fail",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

4. Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:

    - Status Code: `400 (Bad Request)`
    - Response Body:

    ```json
    {
      "status": "fail",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

5. Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:

    - Status Code: `403 (Forbidden)`
    - Response Body:

    ```json
    {
      "status": "fail",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

6. Ketika terjadi server eror, server harus mengembalikan response:

    - Status Code: `500 (Internal Server Error)`
    - Response Body:
    ```json
    {
      "status": "error",
      "message": "<apa pun selama tidak kosong>"
    }
    ```

# Kriteria 6 : Pertahankan Fitur OpenMusic API versi 1 

Pastikan fitur dan kriteria OpenMusic API versi 1 tetap dipertahankan seperti:

- Pengelolaan data album.
- Pengelolaan data song.
- Menerapkan data validations resource album dan song.


# (OPSIONAL) Kriteria 1 : Memiliki fitur kolaborator playlist
Hak akses kolaborator
Ketika user ditambahkan sebagai kolaborator playlist oleh pemilik playlist. Maka hak akses user tersebut terhadap playlist adalah:

- Playlist tampil pada permintaan `GET /playlists`.
- Dapat menambahkan lagu ke dalam playlist.
- Dapat menghapus lagu dari playlist.
- Dapat melihat daftar lagu yang ada di playlist.
- Dapat melihat aktifitas playlist (jika menerapkan kriteria opsional ke-2).

# (OPSIONAL) Kriteria 2 : Memiliki Fitur Playlist Activities
API yang dibuat harus memiliki fitur aktivitas playlist. Fitur ini digunakan untuk mencatat riwayat menambah atau menghapus lagu dari playlist oleh pengguna atau kolaborator.

Riwayat aktivitas playlist dapat diakses melalui endpoint:

- Method : `GET`
- URL : `/playlists/{id}/activities`

Server harus mengembalikan respons dengan:
- Status code : 200
- Response Body
```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-Mk8AnmCp210PwT6B",
    "activities": [
      {
        "username": "dicoding",
        "title": "Life in Technicolor",
        "action": "add",
        "time": "2021-09-13T08:06:20.600Z"
      },
      {
        "username": "dicoding",
        "title": "Centimeteries of London",
        "action": "add",
        "time": "2021-09-13T08:06:39.852Z"
      },
      {
        "username": "dimasmds",
        "title": "Life in Technicolor",
        "action": "delete",
        "time": "2021-09-13T08:07:01.483Z"
      }
    ]
  }
}
```
