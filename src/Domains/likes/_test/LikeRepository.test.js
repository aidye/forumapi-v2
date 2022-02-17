const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('Should throw error when call getLikeCountByCommentIds method wthout extending it', async () => {
    const likeRepo = new LikeRepository();

    await expect(likeRepo.getLikeCountByCommentIds(['comment-123'])).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when call addLike method without extending the repo', async () => {
    const likeRepo = new LikeRepository();

    await expect(likeRepo.addLike('comment-123', 'user-123')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when call deleteLike method without extending the repo', async () => {
    const likeRepo = new LikeRepository();

    await expect(likeRepo.deleteLike('comment-123', 'user-123')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when call verifyLikeExists method without extending the repo', async () => {
    const likeRepo = new LikeRepository();

    await expect(likeRepo.verifyLikeExists('comment-123', 'user-123')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
