const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('Should orchestrating add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Judul',
      body: 'Isi',
    };
    const expectedThread = new AddedThread({
      id: 'thread-123',
      ownerId: 'user-123',
      title: useCasePayload.title,
    });

    /* Dependency */
    const mockThreadRepository = new ThreadRepository();

    /* Mocking function */
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedThread));

    // /* usecase instance */
    const getThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload, 'user-123');

    // Assert
    expect(addedThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload), 'user-123');
  });
});
