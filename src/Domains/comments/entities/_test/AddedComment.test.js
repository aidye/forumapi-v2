const AddedComment = require('../AddedComment');

describe('AddedComment', () => {
  it('Should throw error if not given needed property', () => {
    const payload = {
      id: 'comment-123',
      ownerId: 'user-123',
      // missing content
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.MISSING_NEEDED_PROPERTY');
  });

  it('Should throw error if given invalid data type specification', () => {
    const payload = {
      id: 123, // Not a string
      content: 'Isi komentar',
      ownerId: [], // not a string
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should return valid AddedComment object', () => {
    const payload = {
      id: 'comment-123',
      ownerId: 'user-123',
      content: 'Isi komentar',
    };

    const newAddedComment = new AddedComment(payload);
    expect(newAddedComment.id).toEqual(payload.id);
    expect(newAddedComment.content).toEqual(payload.content);
    expect(newAddedComment.owner).toEqual(payload.ownerId);
  });
});
