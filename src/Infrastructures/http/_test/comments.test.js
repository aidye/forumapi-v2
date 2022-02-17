const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');

describe('/threads/{threadId}/comments endpoints', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('Should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Komentar julid',
      };
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments', // use 'thread-123' as param
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(201);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toEqual('user-123');
    });

    it('Should response 400 if given invalid payload', async () => {
      // Arrange
      const requestPayload = {}; // empty
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments', // use 'thread-123' as param
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('Should response 400 if content payload not a string', async () => {
      // Arrange
      const requestPayload = {
        content: 123, // Not a string
      };
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments', // use 'thread-123' as param
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(400);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('Should response 404 if thread not found', async () => {
      // Arrange
      const requestPayload = {}; // empty
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/INVALID_THRED_ID/comments', // use invalid thread id
        payload: requestPayload,
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('Should response 200 and persisted comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      /* inject data directly for testing purpose */
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, ownerId: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, ownerId: userId });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`, // use 'thread-123' and 'comment-123' as param
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: userId, // use default value
          },
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });
  });

  it('Should response 404 not found if given thread or comment are not found', async () => {
    // Arrange
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: '/threads/THREAD_ID_SEMBARANG/comments/COMMENT_ID_SEMBARANG', // invalid params
      auth: {
        strategy: 'forumapi_jwt',
        credentials: {
          id: 'user-123', // use default value
        },
      },
    });

    // Assert
    expect(response.statusCode).toEqual(404);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });

  it('Should response 403 if user is not the owner of the comment', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    /* inject data directly for testing purpose */
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, ownerId: userId });
    await CommentsTableTestHelper.addComment({ id: commentId, threadId, ownerId: userId });

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}`, // use 'thread-123' and 'comment-123' as param
      auth: {
        strategy: 'forumapi_jwt',
        credentials: {
          id: 'user-456', // different userId
        },
      },
    });

    // Assert
    expect(response.statusCode).toEqual(403);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });
});
