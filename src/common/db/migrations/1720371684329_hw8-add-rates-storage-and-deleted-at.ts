import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('subscriptions', {
    deleted_at: {
      type: 'timestamptz',
      default: null,
    },
  });

  pgm.createTable('rates', {
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    currency: {
      type: 'integer',
      notNull: true,
    },
    value: {
      type: 'decimal(10, 2)',
      notNull: true,
    },
  });
}
