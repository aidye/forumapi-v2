const AddComment = require('../AddComment');

describe('AddComment', () => {
  it('Should throw error when not given required peoperty', () => {
    const payload = {
      // missing content
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAINS_NEEDED_PROPERTY');
  });

  it('Should throw error if one of the payload not meet data type specs', () => {
    const payload = {
      content: 123, // Not a string
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should return addcomment correctly', () => {
    const payload = {
      content: 'Isi komentar',
    };

    const { content } = new AddComment(payload);
    expect(content).toEqual(payload.content);
  });
});
