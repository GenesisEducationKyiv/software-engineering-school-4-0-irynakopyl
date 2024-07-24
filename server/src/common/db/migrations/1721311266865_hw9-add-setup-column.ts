import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('subscriptions', {
    is_setup_done: {
      type: 'boolean',
      default: false,
    },
  });
}
