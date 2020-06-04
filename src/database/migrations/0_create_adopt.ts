import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('adopts' , table => {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('name').notNullable();
    table.string('size').notNullable();
    table.string('photo').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.boolean('adopted').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('adopts');
}