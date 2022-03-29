class AlbumsHandler {
  constructor(service, storageService, uploadValidator, validator) {
    this._service = service;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    this.postAlbumCoverHandler = this.postAlbumCoverHandler(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler(request, h) {
    // pertama saat kirim request kita set cache nya 0, artinya belum ada data yang di caching
    const { albums, isCache = 0 } = await this._service.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil daftar semua album',
      data: {
        albums,
      },
    });
    response.code(200);

    // jika isChace ada nilainya, maka tambahkan response header
    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { album, isCache = 0 } = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);

    const albumContainsSongs = { ...album, songs };

    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil album',
      data: {
        album: albumContainsSongs,
      },
    });
    response.code(200);

    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  // Album Cover Handler
  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const { id } = request.params;

    const path = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

    await this._service.addAlbumCover(id, path);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  // Album Like Handler
  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(id);
    await this._service.addAlbumLike(id, userId);

    const response = h
      .response({
        status: 'success',
        message: 'Album berhasil ditambahkan ke daftar suka',
      })
      .code(201);

    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { likes, isCache = 0 } = await this._service.getLikeAlbum(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    });
    response.code(200);

    // Jika menerima dari cache maka header dicustom
    if (isCache) response.header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumsHandler;
