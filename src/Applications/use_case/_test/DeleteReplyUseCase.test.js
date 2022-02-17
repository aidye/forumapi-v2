const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('Should orcherthating delete reply corectly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.verifyReplyExists = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.verifyReplyDeleteAccess = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.softDeleteReply = jest.fn(() => Promise.resolve(true));

    /* usecase instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const okDeleted = await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);

    // Assert
    expect(okDeleted).toEqual(true);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith(replyId);
    expect(mockReplyRepository.verifyReplyDeleteAccess).toBeCalledWith(replyId, userId);
    expect(mockReplyRepository.softDeleteReply).toBeCalledWith(replyId);
  });
});
