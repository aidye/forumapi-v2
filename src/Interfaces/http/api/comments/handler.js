const AddNewCommentUseCase = require('../../../../Applications/use_case/AddNewCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
  constructor(contaier) {
    this._container = contaier;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId } = request.params;
    const addNewCommentUseCase = this._container.getInstance(AddNewCommentUseCase.name);
    const addedComment = await addNewCommentUseCase.execute(request.payload, id, threadId);

    return h.response({
      status: 'success',
      data: { addedComment },
    }).code(201);
  }

  async deleteCommentHandler(request) {
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(commentId, threadId, id);

    return { status: 'success' };
  }
}

module.exports = CommentHandler;
