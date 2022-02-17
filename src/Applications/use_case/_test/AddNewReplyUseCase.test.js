const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddNewReplyUseCase = require('../AddNewReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('AddNewReplyUseCase', () => {
  it('Should orchestrating add new reply correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Isi balasan',
    };
    const expectedReply = new AddedReply({
      id: 'reply-123',
      ownerId: 'user-123',
      content: useCasePayload.content,
    });

    /* Dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* Mocking function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedReply));

    // /* usecase instance */
    const getReplyUseCase = new AddNewReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload, 'user-123', 'thread-123', 'comment-123');

    // Assert
    expect(addedReply).toStrictEqual(expectedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(useCasePayload, 'user-123', 'comment-123');
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
  });
});
