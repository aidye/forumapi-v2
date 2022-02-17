/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    ownerId = 'user-123',
    content = 'Comment Reply content...',
    createdAt = (new Date()).toISOString(),
    deletedAt = null,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, commentId, ownerId, content, createdAt, deletedAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getReplyById(id) {
    const query = {
      text: `
        SELECT 
          c.*,
          r.*,
          cu.*,
          ru.*
        FROM replies r
        LEFT JOIN comments c ON r."commentId" = c.id
        LEFT JOIN users cu ON c."ownerId" = cu.id
        LEFT JOIN users ru ON r."ownerId" = ru.id
        WHERE r.id = $1
        LIMIT 1
      `,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteById(id) {
    const now = (new Date()).toISOString();
    const query = {
      text: 'UPDATE replies SET deletedAt = $1 WHERE id = $2 RETURNING id',
      values: [now, id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async hardDeleteById(id) {
    const query = {
      text: 'DELETE replies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async cleanTable() {
    await pool.query('TRUNCATE likes, replies, comments, threads');
  },
};

module.exports = RepliesTableHelper;
