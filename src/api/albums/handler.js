class AlbumsHandler {
  constructor(service, storageService, uploadValidator, validator) {
    this._service = service;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    // tambahkan getAllAlbums

    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
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
    const { albums } = await this._service.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengambil daftar semua album',
      data: {
        albums,
      },
    });
    response.code(200);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
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
}

module.exports = AlbumsHandler;
