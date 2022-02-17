const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload, ownerId, commentId) {
    const { content } = payload;
    const replyId = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id',
      values: [replyId, commentId, ownerId, content],
    };

    const result = await this._pool.query(query);
    return new AddedReply({
      id: result.rows[0].id,
      ownerId,
      content,
    });
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND "deletedAt" IS NULL LIMIT 1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ada');
    }

    return true;
  }

  async verifyReplyDeleteAccess(replyId, userId) {
    const query = {
      text: `SELECT 
        id
        FROM replies
        WHERE id = $1 
          AND "ownerId" = $2 
          AND "deletedAt" IS NULL 
        LIMIT 1`,
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Tidak memiliki akses untuk menghapus balasan ini');
    }

    return true;
  }

  async softDeleteReply(replyId) {
    const now = (new Date()).toDateString();
    const query = {
      text: `UPDATE
        replies
        SET "deletedAt" = $1
        WHERE id = $2
        RETURNING id`,
      values: [now, replyId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `
        SELECT
          r.id reply_id,
          r."commentId" reply_comment_id,
          r."ownerId" reply_owner_id,
          r.content reply_content,
          r."createdAt" "reply_createdAt",
          r."deletedAt" "reply_deletedAt",
          c.id reply_comment_id,
          u.username reply_user_username,
          u.fullname reply_user_fullname,
          u.id reply_user_id  
        FROM replies r
        LEFT JOIN comments c ON r."commentId" = c.id
        LEFT JOIN users u ON r."ownerId" = u.id
        WHERE r."commentId" = ANY ($1)
        ORDER BY r."createdAt" ASC
      `,
      values: [commentIds],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
