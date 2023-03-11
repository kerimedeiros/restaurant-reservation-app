const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const {bodyDataHas} = require("../utils/middleware")
const reservationsService = require("../reservations/reservations.service");

/** Retrieves list of all "tables" in the database */
async function list(req, res) {
    const data = await service.list();
    res.json({data});
}

/** Middleware to validate that a "table" exists in the database */
async function validateTableId(req, res, next) {
    const table = await service.read(req.params.table_id);

    if (table) {
        res.locals.table = table
        return next();
    } else {
        return next({
            status: 404,
            message: `Table cannot be found: ${req.params.table_id}`
        })
    }
}

/** Middleware to validate that a reservation exists in the database */
async function validateReservationId(req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: `Must include reservation_id in request body.`
        })
    }
    const {reservation_id} = req.body.data
    if (!reservation_id) {
        return next({
            status: 400,
            message: `Must include reservation_id in request body.`
        })
    }
    const reservation = await reservationsService.read(reservation_id)
    if (reservation) {
        res.locals.reservation = reservation
        return next();
    } else {
        return next({
            status: 404,
            message: `Reservation cannot be found: ${reservation_id}`
        })
    }
}

/** Middleware to validate capacity value is > 0 */
function validateCapacityValue(req, res, next){
    let { data: { capacity }  = {} } = req.body;

    if (capacity <= 0 || !Number.isInteger(capacity)){
        return next({
            status: 400,
            message: `Table must have a value for capacity that is an integer greater than 0.`
        });
    }
    next();
}

/** Middleware to validate the length of the table name */
function validateTableName(req, res, next) {
    let {data: {table_name} = {}} = req.body;

    if (table_name.length < 2) {
        return next({
            status: 400,
            message: `table_name must be at least 2 characters long.`
        });
    }
    next()
}

/** Middleware to validate the capacity of a table based on the number of people in a reservation */
async function validateTableCapacity(req, res, next) {
    const {capacity} = res.locals.table;
    const {people} = res.locals.reservation
    
    if (people > capacity) {
        return next({
            status: 400,
            message: `Reservation has ${people} people which is greater than the table capacity ${capacity}`
        })
    }
    next()
}

/** Middleware to check if a table is already occupied by a reservation */
function validateTableIsOccupied(req, res, next) {
    const {reservation_id} = res.locals.table;

    if (reservation_id) {
        return next({
            status: 400,
            message: `Table already occupied. Choose another.`
        })
    }
    next()
}

/** Middleware to check if a table is NOT occupied before clearing a seated reservation */
function validateTableNotOccupied(req, res, next) {
    const {reservation_id} = res.locals.table;

    if (!reservation_id) {
        return next({
            status: 400,
            message: `Table not occupied. Can't clear seated reservation.`
        })
    }
    next()
}

/** Handles creation of a new table in the database */
async function create(req, res, next) {
    const body = req.body.data; 
    const data = await service.create(body);
    res.status(201).json({data});
}

/** Middleware to check if a reservation can be seated or not */
function validateCanSeatReservation(req, res, next) {
    const {status} = res.locals.reservation
    if (status !== "booked") {
        return next({
            status: 400,
            message: `Can't seat table with status ${status}`
        })
    }
    next()
}

/** Updates the table's reservation in the database */
async function update(req, res) {
    const updatedTable = {
        ...res.locals.table,
        reservation_id: req.body.data.reservation_id
    }
    const updatedReservation = {
        ...res.locals.reservation,
        status: "seated"
    }

    const data = await service.update(updatedTable)
    await reservationsService.update(updatedReservation)
    res.json({data})
}

/**  Handles deleting the seated reservation from a table */
async function deleteSeatedReservation(req, res) {
    const updatedTable = {
        ...res.locals.table,
        reservation_id: null
    }

    const reservation_id = res.locals.table.reservation_id
    const reservation = await reservationsService.read(reservation_id)

    const updatedReservation = {
        ...reservation,
        status: "finished"
    }

    const data = await service.update(updatedTable)
    await reservationsService.update(updatedReservation)
    res.json({data})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        validateCapacityValue,
        validateTableName,
        asyncErrorBoundary(create),
    ],
    update: [
        asyncErrorBoundary(validateTableId),
        asyncErrorBoundary(validateReservationId),
        asyncErrorBoundary(validateTableCapacity),
        validateTableIsOccupied,
        validateCanSeatReservation,
        asyncErrorBoundary(update)
    ],
    deleteSeatedReservation: [
        asyncErrorBoundary(validateTableId),
        validateTableNotOccupied,
        asyncErrorBoundary(deleteSeatedReservation)
    ]
}