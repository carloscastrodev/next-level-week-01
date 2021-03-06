import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("items_collected_by_point", (table) => {
    table.increments("id").primary();
    table
      .integer("point_id")
      .notNullable()
      .references("id")
      .inTable("collect_points");
    table.integer("item_id").notNullable().references("id").inTable("items");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("items_collected_by_point");
}
