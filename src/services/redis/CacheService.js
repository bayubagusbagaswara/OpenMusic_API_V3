const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  // SET
  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  // GET
  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  // DELETE
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
