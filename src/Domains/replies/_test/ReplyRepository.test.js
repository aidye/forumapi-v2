const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('Should thow error when trying to instanciate directly withoud implement/extending it', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReply({}, null, null)).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling verifyReplyExists directly', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.verifyReplyExists('reply-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling verifyReplyDeleteAccess directly', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.verifyReplyDeleteAccess('reply-123', 'user-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling softDeleteReply directly', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.softDeleteReply('reply-123')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('Should throw error when calling getRepliesByCommentIds', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.getRepliesByCommentIds([])).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
