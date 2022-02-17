const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, ownerId) {
    const {
      title,
      body,
    } = addThread;
    const threadId = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id',
      values: [threadId, ownerId, title, body],
    };

    const result = await this._pool.query(query);
    return new AddedThread({
      id: result.rows[0].id,
      ownerId,
      title,
    });
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ada');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT 
        t.id thread_id,
        t."ownerId" thread_owner_id,
        t.title thread_title,
        t.body thread_body,
        t."createdAt" "thread_createdAt",
        u.id thread_user_id,
        u.username thread_user_username,
        u.fullname thread_user_fullname
        from threads t
        LEFT JOIN users u ON t."ownerId" = u.id
        WHERE t.id = $1
        LIMIT 1
      `,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
