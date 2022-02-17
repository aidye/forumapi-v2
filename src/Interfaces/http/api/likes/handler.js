const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class LikeHandler {
  constructor(contaier) {
    this._container = contaier;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const toggleLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
    await toggleLikeUseCase.execute(threadId, commentId, id);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikeHandler;
