const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, userId) {
    const likeId = `like-${this._idGenerator()}`;
    const now = (new Date()).toDateString();
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING *',
      values: [likeId, commentId, userId, now],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE "commentId" = $1 AND "ownerId" = $2 RETURNING id',
      values: [commentId, userId],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async getLikeCountByCommentIds(commentIds) {
    const query = {
      text: `SELECT
          l."commentId" "commentId",
          COUNT(l.id) like_count
        FROM likes l
        WHERE l."commentId" = ANY ($1)
        GROUP BY l."commentId"
        `,
      values: [commentIds],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async verifyLikeExists(commentId, userId) {
    const query = {
      text: 'SELECT id FROM likes WHERE "commentId" = $1 AND "ownerId" = $2 LIMIT 1',
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount > 0;
  }
}

module.exports = LikeRepositoryPostgres;
