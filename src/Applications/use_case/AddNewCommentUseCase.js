const AddComment = require('../../Domains/comments/entities/AddComment');

class AddNewCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId, threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const payload = new AddComment(useCasePayload);

    return this._commentRepository.addComment(payload, ownerId, threadId);
  }
}

module.exports = AddNewCommentUseCase;
