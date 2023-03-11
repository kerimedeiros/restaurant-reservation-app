const knex = require("../db/connection");

/** Retrieves a list of all reservations */
function list() {
  return knex("reservations").select("*");
}

/** Retrieves a list of reservations for a specified date */
function dateList(date) {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .andWhere({ reservation_date: date })
    .orderBy("reservation_time");
}

/** Finds all reservations matching the given mobile number, sorted by reservation date */
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

/** Inserts a new reservation */
function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0]);
}

/** Retrieves a single reservation by ID */
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

/** Updates a reservation */
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedReservations) => updatedReservations[0]);
}

module.exports = {
  list,
  dateList,
  create,
  read,
  update,
  search,
};
