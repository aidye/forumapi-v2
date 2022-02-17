exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    ownerId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deletedAt: {
      type: 'timestamp',
    },
  });

  pgm.addConstraint(
    'comments', // table name
    'fk_comments_belongs_to_thread', // constraint name
    'FOREIGN KEY("threadId") REFERENCES threads(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );

  pgm.addConstraint(
    'comments', // table name
    'fk_comments_belongs_to_user', // constraint name
    'FOREIGN KEY("ownerId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments_belongs_to_thread');
  pgm.dropConstraint('comments', 'fk_comments_belongs_to_user');

  pgm.dropTable('comments');
};
