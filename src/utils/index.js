/* eslint-disable camelcase */

const mapSongDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,

});

const mapAlbumDBToModel = ({
  id, name, year, cover_url,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

const mapUserDBToModel = ({
  id, username, password, fullname,
}) => ({
  id,
  username,
  password,
  fullname,
});

const mapGetPlaylistDBToModel = ({ id, name, username }) => ({
  id, name, username,
});

const mapGetPlaylistActivitiesDBToModel = ({
  username, title, action, time,
}) => ({
  username, title, action, time,
});

const mapUserAlbumLikesDBToModel = ({ id, user_id, album_id }) => ({
  id, userId: user_id, albumId: album_id,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, mapUserDBToModel, mapGetPlaylistDBToModel, mapGetPlaylistActivitiesDBToModel, mapUserAlbumLikesDBToModel,
};
