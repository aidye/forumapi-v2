const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddNewReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepo = replyRepository;
    this._commentRepo = commentRepository;
    this._threadRepo = threadRepository;
  }

  async execute(payload, userId, threadId, commentId) {
    const addReply = new AddReply(payload);
    await this._threadRepo.verifyThreadExists(threadId);
    await this._commentRepo.verifyCommentExists(commentId);

    const newReply = await this._replyRepo.addReply(addReply, userId, commentId);

    return new AddedReply({
      ...newReply,
      ownerId: newReply.owner,
    });
  }
}

module.exports = AddNewReplyUseCase;
