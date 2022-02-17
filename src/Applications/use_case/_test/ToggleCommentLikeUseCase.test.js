const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('ToggleCommentLikeUseCase', () => {
  it('Should orchestrating add new reply correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /* Dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* Mocking function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.verifyLikeExists = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    // /* usecase instance */
    const toggleLikeUseCase = new ToggleCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.addLike).toBeCalledWith(commentId, userId);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
  });

  it('Should orchestrating delete reply correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /* Dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* Mocking function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.verifyLikeExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    // /* usecase instance */
    const toggleLikeUseCase = new ToggleCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(commentId, userId);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
  });
});
