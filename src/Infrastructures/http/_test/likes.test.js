const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const LikesTableHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoints', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('Should response 200 and persisted a like', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });

    it('Should response 200 and delete intended like', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableHelper.addLike({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });

    it('Should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/INVALID_THRED_ID/comments/comment-123/likes', // use invalid thread id
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('Should response 404 if comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/INVALID_COMMENT_ID/likes', // use invalid comment id
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
