const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('Should thow error when trying to instanciate directly withoud implement/extending it', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({}, null)).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyThreadExists('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
