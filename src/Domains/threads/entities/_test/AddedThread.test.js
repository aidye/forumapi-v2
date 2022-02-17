const AddedThread = require('../AddedThread');

describe('AddedThread', () => {
  it('Should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      ownerId: 'user-123',
      // missing title
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
  });

  describe('Payload Validation', () => {
    it('Should throw error when payload is not string', () => {
      const payload = {
        id: 12333123, // integer
        ownerId: 'user-123',
        title: 'Judul Thread',
      };

      expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('Should throw error when id or ownerId is more than 50 chars', () => {
      const payload = {
        id: Array(51).fill('a').join(''), // 51 chars
        ownerId: 'user-123',
        title: 'Judul Thread',
      };

      expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('Should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      ownerId: 'user-123',
      title: 'Judul Thread',
    };

    const newAddedThread = new AddedThread(payload);

    expect(newAddedThread.id).toEqual(payload.id);
    expect(newAddedThread.title).toEqual(payload.title);
    expect(newAddedThread.owner).toEqual(payload.ownerId);
  });
});
