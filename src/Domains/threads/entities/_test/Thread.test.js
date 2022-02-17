const Thread = require('../Thread');
const RegisteredUser = require('../../../users/entities/RegisteredUser');

describe('Thread entity', () => {
  it('Should throw error when payload did not contains needed property', () => {
    const user = new RegisteredUser({
      id: 'user-123',
      username: 'homaidi',
      fullname: 'Ahmad Homaidi',
    });

    const payload = {
      id: 'thread-123',
      owner: user,
      title: 'Judul thread',
      body: 'Isi Thread',
      // missing createdAt,
      comments: [],
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
  });

  it('Should throw error when given payload does not meet data specification', () => {
    const payload = {
      id: 'thread-123',
      owner: {}, // owner is not instand of RegisteredUser
      title: 'Judul thread',
      body: 'Isi thread',
      createdAt: 'INVALID DATE STRING', // invalut date format,
      comments: [],
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should create thread object correctly', () => {
    const user = new RegisteredUser({
      id: 'user-123',
      username: 'homaidi',
      fullname: 'Ahmad Homaidi',
    });

    const timestamp = (new Date()).toISOString();
    const payload = {
      id: 'thread-123',
      owner: user,
      title: 'Judul Thread',
      body: 'Isi Thread',
      createdAt: timestamp,
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah commen',
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus*',
        },
      ],
    };

    // Action
    const newThread = new Thread(payload);

    expect(newThread.id).toEqual(payload.id);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.date).toEqual(timestamp);
    expect(newThread.username).toEqual(user.username);
    expect(newThread.comments).toEqual(payload.comments);
  });

  it('Comments should allow undefined comments', () => {
    const user = new RegisteredUser({
      id: 'user-123',
      username: 'homaidi',
      fullname: 'Ahmad Homaidi',
    });

    const timestamp = (new Date()).toISOString();
    const payload = {
      id: 'thread-123',
      owner: user,
      title: 'Judul Thread',
      body: 'Isi Thread',
      createdAt: timestamp,
      // Comments not set
    };

    // Action
    const newThread = new Thread(payload);

    expect(newThread.id).toEqual(payload.id);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.date).toEqual(timestamp);
    expect(newThread.username).toEqual(user.username);
    expect(newThread.comments).toBeUndefined();
  });
});
