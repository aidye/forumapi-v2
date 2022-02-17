const RegisteredUser = require('../../users/entities/RegisteredUser');

class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      owner,
      content,
      createdAt,
      deletedAt,
    } = payload;
    this.id = id;
    this.username = owner.username;
    this.date = createdAt;
    this.content = deletedAt === null ? content : '**balasan telah dihapus**';
  }

  _verifyPayload({
    id,
    owner,
    content,
    createdAt,
    deletedAt,
  }) {
    if (!id
      || typeof owner === 'undefined'
      || !content
      || !createdAt
      || typeof deletedAt === 'undefined'
    ) {
      throw new Error('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || !(owner instanceof RegisteredUser)
      || typeof content !== 'string'
      || Number.isNaN((new Date(Date.parse(createdAt))).getTime())
    ) {
      throw new Error('REPLY_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
