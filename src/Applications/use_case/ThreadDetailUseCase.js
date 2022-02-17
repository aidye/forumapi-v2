const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');
const Thread = require('../../Domains/threads/entities/Thread');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');

class ThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepo = threadRepository;
    this._commentRepo = commentRepository;
    this._replyRepo = replyRepository;
    this._likeRepo = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepo.getThreadById(threadId);
    const comments = await this._commentRepo.getCommentsByThreadId(threadId);
    const commentIds = comments.map((c) => c.comment_id);
    const replies = await this._replyRepo.getRepliesByCommentIds(commentIds);
    const likes = await this._likeRepo.getLikeCountByCommentIds(commentIds);

    return new Thread({
      id: thread.thread_id,
      owner: new RegisteredUser({
        id: thread.thread_user_id,
        username: thread.thread_user_username,
        fullname: thread.thread_user_fullname,
      }),
      title: thread.thread_title,
      body: thread.thread_body,
      createdAt: thread.thread_createdAt,
      comments: this._getComments(comments, replies, likes),
    });
  }

  _getComments(comments, replies, likes) {
    return comments.map((comment) => new Comment({
      id: comment.comment_id,
      owner: new RegisteredUser({
        id: comment.comment_user_id,
        username: comment.comment_user_username,
        fullname: comment.comment_user_fullname,
      }),
      content: comment.comment_content,
      createdAt: comment.comment_createdAt,
      deletedAt: comment.comment_deletedAt,
      replies: this._getReplies(replies, comment.comment_id),
      likeCount: this._getLikeCount(likes, comment.comment_id),
    }));
  }

  _getReplies(replies, commentId) {
    return replies.filter((reply) => reply.reply_comment_id === commentId)
      .map((r) => (new Reply({
        owner: new RegisteredUser({
          id: r.reply_user_id,
          username: r.reply_user_username,
          fullname: r.reply_user_fullname,
        }),
        id: r.reply_id,
        content: r.reply_content,
        createdAt: r.reply_createdAt,
        deletedAt: r.reply_deletedAt,
      })));
  }

  _getLikeCount(likes, commentId) {
    const match = likes.filter((like) => like.commentId === commentId);
    return match.length > 0 ? Number(match[0].like_count) : 0;
  }
}

module.exports = ThreadDetailUseCase;
