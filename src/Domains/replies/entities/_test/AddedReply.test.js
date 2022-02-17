const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('Should throw error if not given needed property', () => {
    const payload = {
      id: 'reply-123',
      ownerId: 'user-123',
      // missing content
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.MISSING_NEEDED_PROPERTY');
  });

  it('Should throw error if given invalid data type specification', () => {
    const payload = {
      id: 123, // Not a string
      content: 'Isi balasan',
      ownerId: [], // not a string
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should return valid AddedReply object', () => {
    const payload = {
      id: 'reply-123',
      ownerId: 'user-123',
      content: 'Isi balasan',
    };

    const newAddedReply = new AddedReply(payload);
    expect(newAddedReply.id).toEqual(payload.id);
    expect(newAddedReply.content).toEqual(payload.content);
    expect(newAddedReply.owner).toEqual(payload.ownerId);
  });
});
