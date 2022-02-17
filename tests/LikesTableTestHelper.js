/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableHelper = {
  async addLike({
    id = 'like-123',
    commentId = 'comment-123',
    ownerId = 'user-123',
    createdAt = (new Date()).toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, commentId, ownerId, createdAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getLikeById(id) {
    const query = {
      text: `SELECT
          l.id id,
          l."commentId" "commentId",
          l."ownerId" "ownerId",
          l."createdAt" "createdAt",
          c."id" "comment_id",
          u.username "owner_username"
        FROM likes l
        INNER JOIN comments c ON l."commentId" = c.id
        INNER JOIN users u ON l."ownerId" = u.id
        WHERE l.id = $1
        `,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async deleteLikeById(id) {
    const query = {
      text: 'DELETE likes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async getLikeCountByCommentIds(commentIds) {
    const query = {
      text: `SELECT
          l."commentId",
          COUNT(l.id) like_count
        FROM likes l
        WHERE l."commentId" = ANY ($1)
        GROUP BY l."commentId"
        `,
      values: [commentIds],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE likes, replies, comments, threads, users');
  },
};

module.exports = LikesTableHelper;
