const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('Should orcherthating delete comment corectly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadReository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadReository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentDeleteAccess = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.softDeleteComment = jest.fn(() => Promise.resolve(true));

    /* usecase instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadReository,
    });

    // Action
    const okDeleted = await deleteCommentUseCase.execute(commentId, threadId, userId);

    // Assert
    expect(okDeleted).toEqual(true);
    expect(mockThreadReository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentDeleteAccess).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.softDeleteComment).toBeCalledWith(commentId);
  });
});
