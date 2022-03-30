class AlbumsHandler {
  constructor(service, validator, storageService, uploadValidator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum(name, year);

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

  async getAlbumsHandler(_request, h) {
    const { albums, isCache = 0 } = await this._service.getAlbums();

    const response = h
      .response({
        status: 'success',
        data: {
          albums,
        },
      });
    response.code(200);

    // Jika menerima dari cache maka custom header
    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { album, isCache = 0 } = await this._service.getAlbumById(albumId);
    const { songs } = await this._service.getSongsByAlbumId(albumId);

    const albumWithSongs = { ...album, songs };

    const response = h
      .response({
        status: 'success',
        data: {
          album: albumWithSongs,
        },
      });
    response.code(200);

    // Jika menerima dari cache maka custom header
    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

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

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const { id: albumId } = request.params;

    const path = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

    await this._service.addAlbumCover(albumId, path);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    // cek dulu album apakah ada di database
    await this._service.getAlbumById(albumId);

    // userId kita dapatkan dari authentication, dan albumId kita dapatkan dari parameter (kita lakukan pengecekan di database dulu)
    await this._service.addAlbumLikes(albumId, userId);

    const response = h
      .response({
        status: 'success',
        message: 'Album berhasil ditambahkan ke daftar suka',
      });
    response.code(201);
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, isCache = 0 } = await this._service.getAllAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    });
    response.code(200);

    // Jika menerima dari cache maka custom header
    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = AlbumsHandler;
