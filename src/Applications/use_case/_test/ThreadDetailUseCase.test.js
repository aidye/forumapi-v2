const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadDetailUseCase = require('../ThreadDetailUseCase');
const Thread = require('../../../Domains/threads/entities/Thread');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ThreadDetailUseCase', () => {
  it('Should orchestrating get thread detail correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const fakeThreadData = {
      thread_id: threadId,
      thread_user_id: 'user-123',
      thread_user_username: 'homaidi',
      thread_user_fullname: 'Ahmad Homaidi',
      thread_createdAt: (new Date()).toISOString(),
      thread_title: 'Judul thread',
      thread_body: 'Isi thread',
    };
    const fakeCommentData = {
      comment_id: 'comment-123',
      comment_user_id: 'user-456',
      comment_user_username: 'homai',
      comment_user_fullname: 'HOmaaaaai',
      comment_content: 'Komentar julid',
      comment_createdAt: (new Date()).toISOString(),
      comment_deletedAt: null,
    };
    const fakeDeletedCommentData = {
      comment_id: 'comment-456',
      comment_user_id: 'user-456',
      comment_user_username: 'homai',
      comment_user_fullname: 'HOmaaaaai',
      comment_content: 'Komentar julid',
      comment_createdAt: (new Date()).toISOString(),
      comment_deletedAt: (new Date()).toISOString(),
    };
    const fakeReply = {
      reply_id: 'reply-123',
      reply_comment_id: 'comment-456',
      reply_user_username: 'homai',
      reply_user_fullname: 'Adhmad homaiidiii',
      reply_user_id: 'user-123',
      reply_content: 'Isi balasan',
      reply_createdAt: (new Date()).toISOString(),
      reply_deletedAt: null,
    };
    const fakeDeletedReply = {
      reply_id: 'reply-124',
      reply_comment_id: 'comment-123',
      reply_user_username: 'homai',
      reply_user_fullname: 'Adhmad homaiidiii',
      reply_user_id: 'user-123',
      reply_content: 'Isi balasan',
      reply_createdAt: (new Date()).toISOString(),
      reply_deletedAt: (new Date()).toISOString(),
    };
    const fakeLike = {
      commentId: 'comment-123',
      like_count: '4',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(fakeThreadData));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      fakeCommentData,
      fakeDeletedCommentData,
    ]));

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve([
      fakeReply,
      fakeDeletedReply,
    ]));

    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.getLikeCountByCommentIds = jest.fn(() => Promise.resolve([fakeLike]));

    const threadDetailUseCase = new ThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await threadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([
      fakeCommentData.comment_id,
      fakeDeletedCommentData.comment_id,
    ]);
    expect(mockLikeRepository.getLikeCountByCommentIds).toBeCalledWith([
      fakeCommentData.comment_id,
      fakeDeletedCommentData.comment_id,
    ]);

    // console.log(`###`, thread);
    expect(thread).toEqual(new Thread({
      id: fakeThreadData.thread_id,
      title: fakeThreadData.thread_title,
      body: fakeThreadData.thread_body,
      createdAt: fakeThreadData.thread_createdAt,
      owner: new RegisteredUser({
        id: fakeThreadData.thread_user_id,
        username: fakeThreadData.thread_user_username,
        fullname: fakeThreadData.thread_user_fullname,
      }),
      comments: [
        new Comment({
          id: fakeCommentData.comment_id,
          content: fakeCommentData.comment_content,
          createdAt: fakeCommentData.comment_createdAt,
          deletedAt: fakeCommentData.comment_deletedAt,
          owner: new RegisteredUser({
            id: fakeCommentData.comment_user_id,
            username: fakeCommentData.comment_user_username,
            fullname: fakeCommentData.comment_user_fullname,
          }),
          replies: [
            new Reply({
              id: fakeDeletedReply.reply_id,
              content: fakeDeletedReply.reply_content,
              createdAt: fakeDeletedReply.reply_createdAt,
              deletedAt: fakeDeletedReply.reply_deletedAt,
              owner: new RegisteredUser({
                id: fakeDeletedReply.reply_user_id,
                username: fakeDeletedReply.reply_user_username,
                fullname: fakeDeletedReply.reply_user_fullname,
              }),
            }),
          ],
          likeCount: Number(fakeLike.like_count),
        }),
        new Comment({
          id: fakeDeletedCommentData.comment_id,
          content: fakeDeletedCommentData.comment_content,
          createdAt: fakeDeletedCommentData.comment_createdAt,
          deletedAt: fakeDeletedCommentData.comment_deletedAt,
          owner: new RegisteredUser({
            id: fakeDeletedCommentData.comment_user_id,
            username: fakeDeletedCommentData.comment_user_username,
            fullname: fakeDeletedCommentData.comment_user_fullname,
          }),
          replies: [
            new Reply({
              id: fakeReply.reply_id,
              content: fakeReply.reply_content,
              createdAt: fakeReply.reply_createdAt,
              deletedAt: fakeReply.reply_deletedAt,
              owner: new RegisteredUser({
                id: fakeReply.reply_user_id,
                username: fakeReply.reply_user_username,
                fullname: fakeReply.reply_user_fullname,
              }),
            }),
          ],
          likeCount: 0,
        }),
      ],
    }));
  });
});
