const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('Should persist like data in the DB', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // user-123
      await ThreadsTableTestHelper.addThread({}); // thread-123
      await CommentsTableTestHelper.addComment({}); // comment-123
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepoPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepoPostgres.addLike('comment-123', 'user-123');

      // Assert
      const newLike = await LikesTableTestHelper.getLikeById('like-123');
      expect(newLike).toHaveLength(1);
      expect(newLike[0].id).toEqual('like-123');
      expect(newLike[0].commentId).toEqual('comment-123');
      expect(newLike[0].ownerId).toEqual('user-123');
      expect(newLike[0].createdAt).not.toBeNull();
      expect(newLike[0].comment_id).toEqual('comment-123');
      expect(newLike[0].owner_username).toEqual('dicoding');
    });
  });

  describe('deleteLike function', () => {
    it('Should delete the like successfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // user-123
      await ThreadsTableTestHelper.addThread({}); // thread-123
      await CommentsTableTestHelper.addComment({}); // comment-123
      await LikesTableTestHelper.addLike({}); // like-123
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepoPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepoPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const like = await LikesTableTestHelper.getLikeById('like-123');
      expect(like).toHaveLength(0);
    });
  });

  describe('verifyLikeExists function', () => {
    it('Should return true if like does exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // user-123
      await ThreadsTableTestHelper.addThread({}); // thread-123
      await CommentsTableTestHelper.addComment({}); // comment-123
      await LikesTableTestHelper.addLike({}); // like-123
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepoPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const isExists = await likeRepoPostgres.verifyLikeExists('comment-123', 'user-123');

      // Assert
      const like = await LikesTableTestHelper.getLikeById('like-123');
      expect(like.length > 0).toEqual(true);
      expect(isExists).toEqual(true);
    });

    it('Should return false if like does not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepoPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const isExists = await likeRepoPostgres.verifyLikeExists('comment-123', 'user-123');

      // Assert
      const like = await LikesTableTestHelper.getLikeById('like-123');
      expect(like.length > 0).toEqual(false);
      expect(isExists).toEqual(false);
    });
  });

  describe('getLikeCountByCommentIds function', () => {
    it('Should return right jumber of count', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // user-123
      await ThreadsTableTestHelper.addThread({}); // thread-123
      await CommentsTableTestHelper.addComment({}); // comment-123
      await LikesTableTestHelper.addLike({}); // like-123

      await CommentsTableTestHelper.addComment({ id: 'comment-456' });
      await LikesTableTestHelper.addLike({ id: 'like-444', commentId: 'comment-456' });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepoPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const count = await likeRepoPostgres.getLikeCountByCommentIds(['comment-123', 'comment-456']);

      // Assert
      const likes = await LikesTableTestHelper.getLikeCountByCommentIds(['comment-123', 'comment-456']);
      expect(likes).toHaveLength(2);
      expect(count).toHaveLength(2);
    });
  });
});
