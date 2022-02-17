const RegisteredUser = require('../../users/entities/RegisteredUser');

class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      owner,
      content,
      createdAt,
      deletedAt,
      replies,
      likeCount,
    } = payload;
    this.id = id;
    this.username = owner.username;
    this.date = createdAt;
    this.content = deletedAt === null ? content : '**komentar telah dihapus**';
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id,
    owner,
    content,
    createdAt,
    deletedAt,
    replies,
    likeCount,
  }) {
    if (!id
      || typeof owner === 'undefined'
      || !content
      || !createdAt
      || typeof deletedAt === 'undefined'
    ) {
      throw new Error('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || !(owner instanceof RegisteredUser)
      || typeof content !== 'string'
      || Number.isNaN((new Date(Date.parse(createdAt))).getTime())
      || (typeof replies !== 'undefined' && !Array.isArray(replies))
      || (typeof likeCount !== 'undefined' && (!Number.isInteger(likeCount) || likeCount < 0))
    ) {
      throw new Error('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
