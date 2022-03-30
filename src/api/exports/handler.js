class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    // cek playlist ada atau tidak
    await this._playlistsService.verifyExistingPlaylist(playlistId);

    // lalu cek apakah user memiliki akses terhadap playlist tersebut
    // jika user memiliki akses, maka dia boleh untuke export playlist nya
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = { playlistId, targetEmail };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
