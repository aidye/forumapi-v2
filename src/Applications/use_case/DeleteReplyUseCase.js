class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepo = replyRepository;
    this._commentRepo = commentRepository;
    this._threadRepo = threadRepository;
  }

  async execute(replyId, commentId, threadId, userId) {
    await this._threadRepo.verifyThreadExists(threadId);
    await this._commentRepo.verifyCommentExists(commentId);
    await this._replyRepo.verifyReplyExists(replyId);
    await this._replyRepo.verifyReplyDeleteAccess(replyId, userId);

    return this._replyRepo.softDeleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
