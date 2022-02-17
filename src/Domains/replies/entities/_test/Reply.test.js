const RegisteredUser = require('../../../users/entities/RegisteredUser');
const Reply = require('../Reply');

describe('Reply entity', () => {
  describe('When given undesired property', () => {
    it('Should throw error when not given needed property', () => {
      // Arrange
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload1 = {
        id: 'reply-123',
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        // missing deletedAt
      };
      const payload2 = {
        id: 'reply-123',
        owner: registeredUser,
        content: 'Isi balasan',
        // missing createdAt
        deletedAt: null,
      };
      const payload3 = {
        id: 'reply-123',
        owner: registeredUser,
        // missing content
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload4 = {
        id: 'reply-123',
        // missing owner
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload5 = {
        // missing id
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };

      // Action & Assert
      expect(() => new Reply(payload1)).toThrowError('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Reply(payload2)).toThrowError('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Reply(payload3)).toThrowError('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Reply(payload4)).toThrowError('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Reply(payload5)).toThrowError('REPLY_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('Should throw error when given property not match requirement', () => {
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload1 = {
        id: 123, // not a string
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload2 = {
        id: 'reply-123',
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: 'INVALID DATE', // invalid date
        deletedAt: null,
      };
      const payload3 = {
        id: 'reply-123',
        owner: registeredUser,
        content: 123, // invalid content
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload4 = {
        id: 'reply-123',
        owner: '', // not instance of registeredUser
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };

      expect(() => new Reply(payload1)).toThrowError('REPLY_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Reply(payload2)).toThrowError('REPLY_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Reply(payload3)).toThrowError('REPLY_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Reply(payload4)).toThrowError('REPLY_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  describe('When given desired property', () => {
    it('Should keep the content value', () => {
      // Arrange
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload = {
        id: 'reply-123',
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };

      const expectedReply = {
        id: payload.id,
        username: payload.owner.username,
        date: payload.createdAt,
        content: payload.content,
      };

      // Action
      const reply = new Reply(payload);

      // assert
      expect(reply).toEqual(expectedReply);
    });

    it('Should replace content with **balasan telah dihapus** when deletedAt have a value', () => {
      // Arrange
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload = {
        id: 'reply-123',
        owner: registeredUser,
        content: 'Isi balasan',
        createdAt: (new Date()).toISOString(),
        deletedAt: (new Date()).toISOString(),
      };

      const expectedReply = {
        id: payload.id,
        username: payload.owner.username,
        date: payload.createdAt,
        content: '**balasan telah dihapus**',
      };

      // Action
      const reply = new Reply(payload);

      // assert
      expect(reply).toEqual(expectedReply);
    });
  });
});
