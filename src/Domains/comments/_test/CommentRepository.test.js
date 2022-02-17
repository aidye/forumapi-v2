const CommentRepository = require('../CommentRepository');

describe('CommentRepository', () => {
  it('Should thow error when trying to instanciate directly withoud implement/extending it', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({}, null, null)).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling verifyCommentExists directly', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.verifyCommentExists('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling verifyCommentDeleteAccess directly', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.verifyCommentDeleteAccess('comment-123', 'user-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling softDeleteComment directly', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.softDeleteComment('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
  it('Should throw error when calling getCommentsByThreadId directly', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.getCommentsByThreadId('thread-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
