# Note Project

# Langkah membuat project dan library yang digunakan

- Buat project di github, lalu clone di local komputer

    ```
    git clone <repository_project>
    ```

- Buat project nodejs

    ```
    npm init --y
    ```
- Install Nodemon

    ```
    npm install nodemon --save-dev
    ```

- Install Eslint

    ```
    npm install eslint --save-dev
    ```

- Konfigurasi Eslint

    ```
    npx eslint --init
    ```

- Install Hapi

    ```
    npm install @hapi/hapi
    ```

- Install Nanoid

    ```
    npm install nanoid
    ```

- Install Joi

    ```
    npm install joi
    ```

- Install postgresql

    ```
    npm install pg
    ```

- Install dotenv

    ```
    npm install dotenv
    ```

- Install node-pg-migrate untuk migrasi skema database

    ```
    npm install node-pg-migrate
    ```

- Tambahkan scripts di package.json 

    ```
    "migrate": "node-pg-migrate"
    ```

- Jalankan migrasi skema yang sudah dibuat

    ```
    npm run migrate up
    ```

- Install Bcrypt

    ```   
    npm install bcrypt
    ```

- Install JWT

    ```
    npm install @hapi/jwt
    ```
- Untuk membuat random token, ketikan perintah di terminal REPL

    ```
    require('crypto').randomBytes(64).toString('hex');
    ```

# Create Table
- Table Albums

    ```
    npm run migrate create "create table albums"
    ```

- Table Songs
    ```
    npm run migrate create "create table songs"
    ```

- Table Users

    ```
    npm run migrate create "create table users"
    ```

- Table Authentications

    ```
    npm run migrate create "create table authentications"
    ```

- Table Playlists

    ```
    npm run migrate create "create table playlists"
    ```

- Table Playlist_Songs
    ```
    npm run migrate create "create table playlist songs"
    ```

- Table Collaborations

    ```
    npm run migrate create "create table collaborations"
    ```

- Table Playlist_Song_Activities

    ```
    npm run migrate create "create table playlist song activities"
    ```

- Menghapus semua data table

    ```
    TRUNCATE albums, songs, users, authentications, playlists, playlist_songs, playlist_song_activities, collaborations;
    ```