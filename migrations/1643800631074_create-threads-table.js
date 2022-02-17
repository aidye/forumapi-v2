exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    ownerId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'threads', // table name
    'fk_threads_belongs_to_user', // constraint name
    'FOREIGN KEY("ownerId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE', // option
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'fk_threads_belongs_to_user');
  pgm.dropTable('threads');
};
