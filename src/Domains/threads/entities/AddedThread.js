class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id,
      ownerId,
      title,
    } = payload;

    this.id = id;
    this.title = title;
    this.owner = ownerId;
  }

  _verifyPayload({
    id,
    ownerId,
    title,
  }) {
    if (!id
      || !ownerId
      || !title
    ) {
      throw new Error('ADDED_THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof ownerId !== 'string'
      || typeof title !== 'string'
    ) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (id.length > 50 || ownerId.length > 50) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
