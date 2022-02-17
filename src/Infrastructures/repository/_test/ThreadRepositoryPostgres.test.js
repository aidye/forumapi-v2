const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const RepliesTableHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Should persists thread in PostgreDB', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({});
    const addThread = new AddThread({
      title: 'Judul thread',
      body: 'Isi thread...',
    });
    const fakeThreadIdGenerator = () => '123'; // Stub!!
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeThreadIdGenerator);

    // Action
    const newThread = await threadRepositoryPostgres.addThread(addThread, 'user-123');

    // // Assertq
    const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
    expect(thread).toHaveLength(1);
    expect(Array.isArray(thread)).toEqual(true);

    expect(newThread).toEqual(new AddedThread({
      id: `thread-${fakeThreadIdGenerator()}`,
      ownerId: 'user-123',
      title: addThread.title,
    }));
  });

  describe('verifyThreadExists function', () => {
    it('should not throw InvariantError when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw InvariantError when thread does not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-456')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('Should throw NotFound error when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('Should Not throw NotFound error when thread exists', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
      const newThread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(newThread).toHaveLength(1);
    });

    it('Should return expected thread result correctly', async () => {
      // Arrange
      const now = (new Date()).toISOString();
      const fakeUser = {
        id: 'user-123',
        fullname: 'Ya usser ya user',
        username: 'yauser',
      };
      await UsersTableTestHelper.addUser(fakeUser);

      const fakeThread = {
        id: 'thread-123',
        ownerId: fakeUser.id,
        title: 'Ya judul ya judul',
        body: 'Ya body ya body',
        createdAt: now,
      };
      await ThreadsTableTestHelper.addThread(fakeThread);

      // Action
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(thread.thread_id).toEqual(fakeThread.id);
      expect(thread.thread_owner_id).toEqual(fakeThread.ownerId);
      expect(thread.thread_title).toEqual(fakeThread.title);
      expect(thread.thread_body).toEqual(fakeThread.body);
      expect(thread.thread_createdAt).not.toEqual(null);
      expect(thread.thread_user_id).toEqual(fakeThread.ownerId);
      expect(thread.thread_user_username).toEqual(fakeUser.username);
      expect(thread.thread_user_fullname).toEqual(fakeUser.fullname);
    });
  });
});
