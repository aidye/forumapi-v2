const RegisteredUser = require('../../../users/entities/RegisteredUser');
const Comment = require('../Comment');

describe('Comment entity', () => {
  describe('When given undesired property', () => {
    it('Should throw error when not given needed property', () => {
      // Arrange
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload1 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        // missing deletedAt
      };
      const payload2 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        // missing createdAt
        deletedAt: null,
      };
      const payload3 = {
        id: 'comment-123',
        owner: registeredUser,
        // missing content
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload4 = {
        id: 'comment-123',
        // missing owner
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload5 = {
        // missing id
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };

      // Action & Assert
      expect(() => new Comment(payload1)).toThrowError('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Comment(payload2)).toThrowError('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Comment(payload3)).toThrowError('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Comment(payload4)).toThrowError('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
      expect(() => new Comment(payload5)).toThrowError('COMMENT_ENTITY.NOT_CONTAINS_NEEDED_PROPERTY');
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
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload2 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: 'INVALID DATE', // invalid date
        deletedAt: null,
      };
      const payload3 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 123, // invalid content
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload4 = {
        id: 'comment-123',
        owner: '', // not instance of registeredUser
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      const payload5 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
        replies: {}, // should be array
      };
      const payload6 = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
        replies: [],
        likeCount: 'hahaha', // should be a number
      };

      expect(() => new Comment(payload1)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Comment(payload2)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Comment(payload3)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Comment(payload4)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Comment(payload5)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new Comment(payload6)).toThrowError('COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
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
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };

      const expectedComment = {
        id: payload.id,
        username: payload.owner.username,
        date: payload.createdAt,
        content: payload.content,
      };

      // Action
      const comment = new Comment(payload);

      // assert
      expect(comment).toEqual(expectedComment);
    });

    it('Should replace content with **komentar telah dihapus** when deletedAt have a value', () => {
      // Arrange
      const registeredUser = new RegisteredUser({
        id: 'user-123',
        username: 'homaidi',
        fullname: 'Ahmad Homaidi',
      });
      const payload = {
        id: 'comment-123',
        owner: registeredUser,
        content: 'Isi komentar',
        createdAt: (new Date()).toISOString(),
        deletedAt: (new Date()).toISOString(),
      };

      const expectedComment = {
        id: payload.id,
        username: payload.owner.username,
        date: payload.createdAt,
        content: '**komentar telah dihapus**',
      };

      // Action
      const comment = new Comment(payload);

      // assert
      expect(comment).toEqual(expectedComment);
    });
  });
});
