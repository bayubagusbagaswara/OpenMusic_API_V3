class ExportsHandler {
  // kita inject playlistsService untuk mengecek access untuk playlists
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    // Playlist check
    // await this._playlistsService.getPlaylistDetails(playlistId);

    // Verify playlist owner
    // await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

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
