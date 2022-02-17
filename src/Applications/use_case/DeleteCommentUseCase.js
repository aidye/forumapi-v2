class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepo = commentRepository;
    this._threadRepo = threadRepository;
  }

  async execute(commentId, threadId, userId) {
    await this._threadRepo.verifyThreadExists(threadId);
    await this._commentRepo.verifyCommentExists(commentId);
    await this._commentRepo.verifyCommentDeleteAccess(commentId, userId);

    return this._commentRepo.softDeleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
