class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      title,
      body,
      createdAt,
    } = payload;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
  }

  _verifyPayload({
    title,
    body,
    createdAt = (new Date()).toISOString(),
  }) {
    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string'
      || typeof body !== 'string'
      || typeof createdAt !== 'string'
      || Number.isNaN((new Date(Date.parse(createdAt))).getTime())
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
