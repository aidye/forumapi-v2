const RegisteredUser = require('../../users/entities/RegisteredUser');

class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      owner,
      title,
      body,
      createdAt,
      comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = createdAt;
    this.username = owner.username;
    this.comments = comments;
  }

  _verifyPayload({
    id,
    owner,
    title,
    body,
    createdAt,
    comments,
  }) {
    if (!id
      || !owner
      || !title
      || !body
      || !createdAt
    ) {
      throw new Error('THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
    }

    if (!(owner instanceof RegisteredUser)
      || typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || (!Array.isArray(comments) && typeof comments !== 'undefined')
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
