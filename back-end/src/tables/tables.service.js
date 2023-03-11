const knex = require("../db/connection");

/**  Retrieves list of all tables and sorts by table name */
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

/** Inserts a new table and returns the created table */
function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

/** Updates an existing table and returns the updated table */
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

/** Retrieves a table with the specified ID */
function read(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first();
}

module.exports = {
  create,
  list,
  update,
  read,
};
