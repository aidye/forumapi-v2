const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ThreadDetailUseCase = require('../../../../Applications/use_case/ThreadDetailUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, id);
    // console.log('^^^^^^^^^^', addThreadUseCase, request.payload);

    return h.response({
      status: 'success',
      data: { addedThread },
    }).code(201);
  }

  async getThreadDetailHandler(request) {
    const { threadId } = request.params;
    const threadDetailUseCase = this._container.getInstance(ThreadDetailUseCase.name);
    const thread = await threadDetailUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandler;
