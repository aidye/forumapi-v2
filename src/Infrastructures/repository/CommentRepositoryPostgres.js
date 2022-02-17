const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload, ownerId, threadId) {
    const { content } = payload;
    const commentId = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id',
      values: [commentId, threadId, ownerId, content],
    };

    const result = await this._pool.query(query);
    return new AddedComment({
      id: result.rows[0].id,
      ownerId,
      content,
    });
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND "deletedAt" IS NULL LIMIT 1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ada');
    }

    return true;
  }

  async verifyCommentDeleteAccess(commentId, userId) {
    const query = {
      text: `SELECT 
        id
        FROM comments
        WHERE id = $1 
          AND "ownerId" = $2 
          AND "deletedAt" IS NULL 
        LIMIT 1`,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Tidak memiliki akses untuk menghapus komentar ini');
    }

    return true;
  }

  async softDeleteComment(commentId) {
    const now = (new Date()).toDateString();
    const query = {
      text: `UPDATE
        comments
        SET "deletedAt" = $1
        WHERE id = $2
        RETURNING id`,
      values: [now, commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          c.id comment_id,
          c."threadId" "comment_threadId",
          c."ownerId" comment_owner_id,
          c.content comment_content,
          c."createdAt" "comment_createdAt",
          c."deletedAt" "comment_deletedAt",
          u.id comment_user_id,
          u.username comment_user_username,
          u.fullname comment_user_fullname,
          t.id comment_thread_id,
          t.title comment_thread_title,
          t.body comment_thread_body,
          t."createdAt" "comment_thread_createdAt"
        FROM comments c
        INNER JOIN threads t ON c."threadId" = t.id
        LEFT JOIN users u ON c."ownerId" = u.id
        LEFT JOIN users tu ON t."ownerId" = tu.id
        WHERE c."threadId" = $1
        ORDER BY c."createdAt" ASC
      `,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
