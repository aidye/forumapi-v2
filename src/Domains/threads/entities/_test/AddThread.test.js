const AddThread = require('../AddThread');

describe('AddThread', () => {
  it('Should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Judul thread',
      // missing `body` property
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
  });

  it('Should throw error when the payload did not meet data type specification', () => {
    const payload = {
      title: [], // Not a string
      body: 'Isi thread',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should create thread object correctly', () => {
    const date = (new Date()).toISOString();
    const payload = {
      title: 'Judul thread',
      body: 'Isi thread',
      createdAt: date,
    };

    const { title, body, createdAt } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(createdAt).toEqual(date);
  });
});
