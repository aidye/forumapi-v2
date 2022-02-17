class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, ownerId, content } = payload;
    this.id = id;
    this.owner = ownerId;
    this.content = content;
  }

  _verifyPayload({ id, ownerId, content }) {
    if (!id || !ownerId || !content) {
      throw new Error('ADDED_REPLY.MISSING_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof ownerId !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
