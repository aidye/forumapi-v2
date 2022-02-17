/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgras', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('Should persists reply in Postgres DB', async () => {
      // Arrange
      /* create thread, comment, and user */
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const addReply = new AddReply({
        content: 'Balasannya ini',
      });
      const fakeIdGenerator = () => '123'; // Stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newReply = await replyRepositoryPostgres.addReply(addReply, 'user-123', 'comment-123');

      // Assert
      const reply = await RepliesTableTestHelper.getReplyById('reply-123');
      expect(reply).toHaveLength(1);

      expect(newReply).toEqual(new AddedReply({
        id: `reply-${fakeIdGenerator()}`,
        ownerId: 'user-123',
        content: addReply.content,
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('Should throw 404 error when given reply does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-456')).rejects.toThrowError(NotFoundError);
    });

    it('Should NOT throw 404 error when given reply does exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert reply in database */
      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123')).resolves.not.toThrowError(NotFoundError);
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123')).resolves.toEqual(true);
    });
  });

  describe('verifyReplyDeleteAccess function', () => {
    it('Should throw 403 error when the reply is not belongs to the user', async () => {
      // Arrange
      const fakeUserId = 'user-124';
      const realUserId = 'user-123';

      await UsersTableTestHelper.addUser({ id: realUserId });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert reply in database */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        ownerId: realUserId,
        content: 'balasan julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyDeleteAccess('reply-123', fakeUserId)).rejects.toThrowError(AuthorizationError);
    });

    it('Should Not throw 403 error when the reply is belongs to the user and return true', async () => {
      // Arrange
      const realUserId = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert comment in database */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        ownerId: realUserId,
        content: 'balasan julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyDeleteAccess('reply-123', realUserId)).resolves.not.toThrowError(AuthorizationError);
      await expect(replyRepositoryPostgres.verifyReplyDeleteAccess('reply-123', realUserId)).resolves.toEqual(true);
    });
  });

  describe('softDeleteReply function', () => {
    it('Should update reply "deletedAt" to current timestamp succesfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      /* directly insert reply in database */
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        ownerId: 'user-123',
        content: 'balasan julid...',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      });

      // Action & Assert
      await expect(replyRepositoryPostgres.softDeleteReply('reply-123')).resolves.toEqual(true);
      const deletedReply = await RepliesTableTestHelper.getReplyById('reply-123');
      expect(deletedReply[0].deletedAt.length).not.toBeNull();
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('Should return array of replies of given threadId(s)', async () => {
      // Arrange
      const now = (new Date()).toISOString();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      // create 3 reply for comment1
      const replies = [];
      const users = [];
      for (let i = 1; i <= 3; i++) {
        const user = await UsersTableTestHelper.addUser({ id: `user-11${i}`, username: `homaidi-${i}` });
        users.push(user);

        const reply = await RepliesTableTestHelper.addReply({
          id: `reply-12${i}`,
          ownerId: user.id,
          commentId: 'comment-123',
          content: `Balasan ke- ${i}`,
          createdAt: now,
          // deletedAt: (i % 2 == 0 ? null : (new Date()).toISOString()),
        });

        replies.push(reply);
      }

      await CommentsTableTestHelper.addComment({ id: 'comment-456' });
      // Create 2 replies for comment2
      for (let i = 1; i <= 2; i++) {
        const user = await UsersTableTestHelper.addUser({ id: `user-45${i}`, username: `homaidi-2${i}` });
        users.push(user);

        const reply = await RepliesTableTestHelper.addReply({
          id: `reply-45${i}`,
          ownerId: user.id,
          commentId: 'comment-456',
          content: `Balasan ke- ${i}`,
          createdAt: now,
          // deletedAt: (i % 2 == 0 ? null : (new Date()).toISOString()),
        });

        replies.push(reply);
      }

      // Comment 3 has no reply
      await CommentsTableTestHelper.addComment({ id: 'comment-789' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const commentReplies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123', 'comment-456', 'comment-789']);
      const commentReplies2 = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-789']);
      const commentReplies3 = await replyRepositoryPostgres.getRepliesByCommentIds([]);

      // Assert
      expect(commentReplies).toHaveLength(5);
      expect(commentReplies2).toHaveLength(0);
      expect(commentReplies3).toHaveLength(0);

      commentReplies.map((r) => {
        const reply = replies.filter((rpl) => rpl.id === r.reply_id)[0];
        const user = users.filter((u) => u.id === reply.ownerId)[0];

        expect(r.reply_id).toEqual(reply.id);
        expect(r.reply_comment_id).toEqual(reply.commentId);
        expect(r.reply_owner_id).toEqual(reply.ownerId);
        expect(r.reply_content).toEqual(reply.content);
        expect(r.reply_createdAt).toEqual(reply.createdAt);
        expect(r.reply_deletedAt).toEqual(reply.deletedAt);
        expect(r.reply_user_username).toEqual(user.username);
        expect(r.reply_user_fullname).toEqual(user.fullname);
        expect(r.reply_user_id).toEqual(user.id);
      });
    });
  });
});
