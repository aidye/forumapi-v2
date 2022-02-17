/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const RepliesTableHelper = require('../../../../tests/RepliesTableTestHelper');

describe('CommentRepositoryPostgras', () => {
  afterEach(async () => {
    await RepliesTableHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('Should persists comment in Postgres DB', async () => {
      // Arrange
      /* create thread */
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addComment = new AddComment({
        content: 'Komentarnya ini',
      });
      const fakeIdGenerator = () => '123'; // Stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.addComment(addComment, 'user-123', 'thread-123');

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(newComment).toEqual(new AddedComment({
        id: 'comment-123',
        ownerId: 'user-123',
        content: 'Komentarnya ini',
      }));
    });
  });

  describe('verifyCommentExists function', () => {
    it('Should throw 404 error when given comment does not exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-456')).rejects.toThrowError(NotFoundError);
    });

    it('Should NOT throw 404 error when given comment does exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert comment in database */
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.toEqual(true);
    });
  });

  describe('verifyCommentDeleteAccess function', () => {
    it('Should throw 403 error when the comment is not belongs to the user', async () => {
      // Arrange
      const fakeUserId = 'user-124';
      const realUserId = 'user-123';
      await UsersTableTestHelper.addUser({ id: realUserId });
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert comment in database */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        ownerId: realUserId,
        content: 'komentar julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentDeleteAccess('comment-123', fakeUserId)).rejects.toThrowError(AuthorizationError);
    });

    it('Should Not throw 403 error when the comment is belongs to the user and return true', async () => {
      // Arrange
      const realUserId = 'user-123';
      await UsersTableTestHelper.addUser({ id: realUserId });
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert comment in database */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        ownerId: realUserId,
        content: 'komentar julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentDeleteAccess('comment-123', realUserId)).resolves.not.toThrowError(AuthorizationError);
      await expect(commentRepositoryPostgres.verifyCommentDeleteAccess('comment-123', realUserId)).resolves.toEqual(true);
    });
  });

  describe('softDeleteComment function', () => {
    it('Should update comment "deletedAt" comment to current timestamp succesfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert comment in database */
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        ownerId: 'user-123',
        content: 'komentar julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(commentRepositoryPostgres.softDeleteComment('comment-123')).resolves.toEqual(true);
      const deletedComment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(deletedComment[0].deletedAt.length).not.toBeNull();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('Should return array of comments of given threadId', async () => {
      // Arrange
      const now = (new Date()).toISOString();
      await UsersTableTestHelper.addUser({});
      const thread = await ThreadsTableTestHelper.addThread({ createdAt: now });

      const users = [];
      const comments = [];
      for (let i = 1; i <= 3; i++) {
        const user = await UsersTableTestHelper.addUser({
          id: `user-11${i}`,
          username: `homaidi${i}`,
          password: 'secret',
          fullname: `Ahmad Homaidi ${i}`,
        });
        users.push(user);
        const comment = await CommentsTableTestHelper.addComment({
          id: `comment-12${i}`,
          ownerId: `user-11${i}`,
          threadId: 'thread-123',
          content: `Isi content${i}`,
          createdAt: now,
          // deletedAt: (i % 2 == 0 ? null : (new Date()).toISOString()),

        });
        comments.push(comment);
      }
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const threadComments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(threadComments).toHaveLength(3);
      /* must be an array */
      expect(Array.isArray(threadComments)).toBeTruthy();

      /* must return DB rows */
      // eslint-disable-next-line array-callback-return
      comments.map((c, i) => {
        // console.log(c)
        const expected = {
          comment_id: c.id,
          comment_threadId: c.threadId,
          comment_owner_id: c.ownerId,
          comment_content: c.content,
          comment_createdAt: c.createdAt,
          comment_deletedAt: null,
          comment_user_id: c.ownerId,
          comment_user_username: users[i].username,
          comment_user_fullname: users[i].fullname,
          comment_thread_id: c.threadId,
          comment_thread_title: 'Judul thread',
          comment_thread_body: 'Isi thread',
          comment_thread_createdAt: thread.createdAt,
        };

        expect(threadComments[i]).toEqual(expected);
      });
    });
  });
});
