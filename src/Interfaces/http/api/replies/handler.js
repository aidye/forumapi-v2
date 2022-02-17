const AddNewReplyUseCase = require('../../../../Applications/use_case/AddNewReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(contaier) {
    this._container = contaier;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addNewReplyUseCase = this._container.getInstance(AddNewReplyUseCase.name);
    const addedReply = await addNewReplyUseCase.execute(request.payload, id, threadId, commentId);

    return h.response({
      status: 'success',
      data: { addedReply },
    }).code(201);
  }

  async deleteReplyHandler(request) {
    const { id } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute(replyId, commentId, threadId, id);

    return { status: 'success' };
  }
}

module.exports = ReplyHandler;
