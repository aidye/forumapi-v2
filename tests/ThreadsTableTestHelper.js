/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    ownerId = 'user-123',
    title = 'Judul thread',
    body = 'Isi thread',
    createdAt = (new Date()).toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, ownerId, title, body, createdAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1 LIMIT 1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getThreadByIdWithCommentAndOwner(id) {
    const query = {
      text: `SELECT 
        * 
        FROM threads
        INNER JOIN users ON threads.ownerId = users.id
        INNER JOIN comments ON comments.threadId = thread.id
        INNER JOIN replies ON replies.commentId = comments.id
        LIMIT 1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE likes, replies, comments, threads');
  },
};

module.exports = ThreadsTableTestHelper;
