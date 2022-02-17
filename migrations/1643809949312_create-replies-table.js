exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    'replies', // table name
    'fk_replies_belongs_to_comment', // constraint name
    'FOREIGN KEY("commentId") REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );

  pgm.addConstraint(
    'replies', // table name
    'fk_replies_belongs_to_user', // constraint name
    'FOREIGN KEY("ownerId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies_belongs_to_comment');
  pgm.dropConstraint('replies', 'fk_replies_belongs_to_user');

  pgm.dropTable('replies');
};
