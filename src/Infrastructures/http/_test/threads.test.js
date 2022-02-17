const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('Should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Judul thread',
        body: 'Isi thread',
      };
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('Should response 400 if thre given payload not meet requirement', async () => {
      // Arrange
      const payload = {}; // empty payload
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('Should response 200 if thread found and correct response', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('Should return correct response payload', async () => {
      // Arrange
      const now = (new Date()).toISOString();
      const fakeUserPayload = {
        id: 'user-123',
        username: 'homadidi',
        password: 'secret',
        fullname: 'Ahmad Homaidi',
      };
      await UsersTableTestHelper.addUser(fakeUserPayload);

      const fakeThreadPayload = {
        id: 'thread-123',
        ownerId: fakeUserPayload.id,
        title: 'Judul thread',
        body: 'Isi thread',
        createdAt: now,
      };
      await ThreadsTableTestHelper.addThread(fakeThreadPayload);

      const fakeCommentPayload = {
        id: 'comment-123',
        threadId: fakeThreadPayload.id,
        ownerId: fakeUserPayload.id,
        content: 'Komentar baguss',
        createdAt: now,
        deletedAt: null,
      };
      await CommentsTableTestHelper.addComment(fakeCommentPayload);

      const fakeDeletedCommentPayload = {
        id: 'comment-124',
        threadId: fakeThreadPayload.id,
        ownerId: fakeUserPayload.id,
        content: 'Komentar julid, dihapus aja',
        createdAt: now,
        deletedAt: now,
      };
      await CommentsTableTestHelper.addComment(fakeDeletedCommentPayload);

      const fakeReply = {
        id: 'reply-123',
        commentId: 'comment-123',
        ownerId: 'user-123',
        content: 'Balasan bagus',
        createdAt: (new Date()).toISOString(),
        deletedAt: null,
      };
      await RepliesTableTestHelper.addReply(fakeReply);

      const fakeDeletedReply = {
        id: 'reply-124',
        commentId: 'comment-123',
        ownerId: 'user-123',
        content: 'Balasan julid',
        createdAt: (new Date()).toISOString(),
        deletedAt: (new Date()).toISOString(),
      };
      await RepliesTableTestHelper.addReply(fakeDeletedReply);

      const server = await createServer(container);
      const expectedThreadResponse = {
        id: fakeThreadPayload.id,
        title: fakeThreadPayload.title,
        body: fakeThreadPayload.body,
        date: fakeThreadPayload.createdAt,
        username: fakeUserPayload.username,
        comments: [
          {
            id: fakeCommentPayload.id,
            username: fakeUserPayload.username,
            date: fakeCommentPayload.createdAt,
            content: fakeCommentPayload.content,
            replies: [
              {
                id: fakeReply.id,
                content: fakeReply.content,
                date: fakeReply.createdAt,
                username: fakeUserPayload.username,
              },
              {
                id: fakeReply.id,
                content: '**balasan telah dihapus**',
                date: fakeReply.createdAt,
                username: fakeUserPayload.username,
              },
            ],
          },
          {
            id: fakeDeletedCommentPayload.id,
            username: fakeUserPayload.username,
            date: fakeDeletedCommentPayload.createdAt,
            content: '**komentar telah dihapus**',
          },
        ],
      };

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();

      const { thread } = responseJson.data;
      expect(thread).toEqual({
        ...expectedThreadResponse,
        date: new Date(thread.date).toJSON(), // convert thre date to JSON to compare it without TZ
        comments: thread.comments.map((c) => ({
          ...c,
          date: new Date(c.date).toJSON(),
          // replies:
        })),
      });
    });

    it('Should throw 404 error not found if thread does not existes', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/INVALID_THREAD_ID',
      });

      // // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
