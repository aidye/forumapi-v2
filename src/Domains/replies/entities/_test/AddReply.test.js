const AddReply = require('../AddReply');

describe('AddReply', () => {
  it('Should throw error when not given required peoperty', () => {
    const payload = {
      // missing content
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAINS_NEEDED_PROPERTY');
  });

  it('Should throw error if one of the payload not meet data type specs', () => {
    const payload = {
      content: 123, // Not a string
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should return addcomment correctly', () => {
    const payload = {
      content: 'Isi balasan',
    };

    const { content } = new AddReply(payload);
    expect(content).toEqual(payload.content);
  });
});
