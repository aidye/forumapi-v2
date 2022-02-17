class ToggleCommentLikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepo = likeRepository;
    this._commentRepo = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepo.verifyCommentExists(commentId);
    const likeExists = await this._likeRepo.verifyLikeExists(commentId, userId);

    if (likeExists) {
      return this._likeRepo.deleteLike(commentId, userId);
    }

    return this._likeRepo.addLike(commentId, userId);
  }
}

module.exports = ToggleCommentLikeUseCase;
