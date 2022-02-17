const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddNewCommentUseCase = require('../AddNewCommentUseCase');

describe('AddNewCommentUseCase', () => {
  it('Should orchestrating add new comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Isi komentar',
    };
    const expectedComment = {
      id: 'comment-123',
      owner: 'user-123',
      content: useCasePayload.content,
    };

    /* Dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* Mocking function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedComment));

    // /* usecase instance */
    const addNewCommentUseCase = new AddNewCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addNewCommentUseCase.execute(useCasePayload, 'user-123', 'thread-123');

    // Assert
    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload, 'user-123', 'thread-123');
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
  });
});
