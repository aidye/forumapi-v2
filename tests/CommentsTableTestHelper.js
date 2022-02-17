/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    ownerId = 'user-123',
    content = 'Comment content...',
    createdAt = (new Date()).toISOString(),
    deletedAt = null,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, threadId, ownerId, content, createdAt, deletedAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 LIMIT 1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteById(id) {
    const now = (new Date()).toISOString();
    const query = {
      text: 'UPDATE comments SET deletedAt = $1 WHERE id = $2 RETURNING id',
      values: [now, id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async hardDeleteById(id) {
    const query = {
      text: 'DELETE comments WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async getCommentCountById(id) {
    const query = {
      text: `
        SELECT COUNT(*) AS like_count
        FROM likes
        WHERE "commentId" = $1
      `,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE likes, replies, comments, threads');
  },
};

module.exports = CommentsTableTestHelper;
