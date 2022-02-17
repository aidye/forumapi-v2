exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    ownerId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'likes', // table name
    'fk_likes_belongs_to_comment', // constraint name
    'FOREIGN KEY("commentId") REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );

  pgm.addConstraint(
    'likes', // table name
    'fk_likes_belongs_to_user', // constraint name
    'FOREIGN KEY("ownerId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes_belongs_to_comment');
  pgm.dropConstraint('likes', 'fk_likes_belongs_to_user');

  pgm.dropTable('likes');
  pgm.dropTable('replies');
  pgm.dropTable('comments');
  pgm.dropTable('threads');
  pgm.dropTable('authentications');
  pgm.dropTable('users');

  //
  pgm.sql('DELETE FROM pgmigrations');
};
