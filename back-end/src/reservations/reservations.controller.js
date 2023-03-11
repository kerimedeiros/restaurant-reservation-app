const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const { bodyDataHas } = require("../utils/middleware");


/** Retrieves all reservations for a specified date or mobile number */
async function list(req, res) {
  let { date, mobile_number } = req.query;
  if (!date) {
    todayDate = new Date();
    date = `${todayDate.getFullYear()}-${(
      todayDate.getMonth() + 1
    ).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${todayDate
      .getDate()
      .toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
  }
  let data;
  if (mobile_number) {
    data = await service.search(mobile_number);
  } else {
    data = await service.dateList(date);
  }

  res.json({
    data,
  });
}

/** Middleware to validate that the reservation has a valid integer value for people */
function validatePeopleCount(req, res, next) {
  let { data: { people } = {} } = req.body;
  if (people <= 0 || !Number.isInteger(people)) {
    return next({
      status: 400,
      message: `Reservation must have a value for people that is an integer greater than 0`,
    });
  }
  next();
}

/** Middleware to validate that the reservation has a valid phone number format */
function validateMobileNumber(req, res, next) {
  let { data: { mobile_number } = {} } = req.body;
  let regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (!regex.test(mobile_number)) {
    return next({
      status: 400,
      message: `mobile_number must be only numbers (dashes and parantheses allowed where appropriate)`,
    });
  }
  next();
}

/** Middleware to validate reservation booking status upon creating reservation */
function validateBookingStatus(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status === "booked" || !status) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Reservation cannot have a status of ${status} when created.`,
    });
  }
}

/** Middleware to validate that the reservation date is valid and/or in the future */
function validateReservationDate(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const date = new Date(reservation_date + "T" + reservation_time);
  const now = new Date();
  if (!Date.parse(reservation_date)) {
    return next({
      status: 400,
      message: `Reservation must have a valid reservation_date`,
    });
  } else if (date.getDay() === 2 && date < now) {
    return next({
      status: 400,
      message: `Periodic Tables is closed on Tuesdays. Reservations also must be made in the future. Please choose a different date and time.`,
    });
  } else if (date.getDay() === 2) {
    return next({
      status: 400,
      message: `Periodic Tables is closed on Tuesdays. Please choose a different date and time.`,
    });
  } else if (date < now) {
    return next({
      status: 400,
      message: `Reservations must be made in the future. Please choose a different date and time.`,
    });
  } else {
    next();
  }
}

/** Middleware to validate reservation time and timing window */
function validateReservationTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  const time = reservation_time.split(":");
 
  const hour = time[0];
  const minutes = time[1];
  if (
    !hour ||
    !minutes ||
    hour > 24 ||
    hour < 0 ||
    minutes > 59 ||
    minutes < 0
  ) {
    return next({
      status: 400,
      message: `Reservation must have a valid reservation_time`,
    });
  } else if (reservation_time < "10:30") {
    return next({
      status: 400,
      message: `Reservation cannot be before 10:30 AM.`,
    });
  } else if (reservation_time > "21:30") {
    return next({
      status: 400,
      message: `Reservation cannot be after 9:30 PM.`,
    });
  }
  next();
}

/** Handles creation of a new reservation in the database */
async function create(req, res) {
  const body = req.body.data;
  const data = await service.create(body);
  res.status(201).json({ data });
}

/** Middleware to validate that a reservation exists in the database */
async function validateReservationId(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation cannot be found: ${req.params.reservation_id}`,
    });
  }
}

/** Handles retrieval of a reservation from the database */
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

/** Middleware to validate reservation status upon updating a reservation  */
function validateReservationStatus(req, res, next) {
  const statuses = ["booked", "seated", "finished", "cancelled"];
  const currentStatus = res.locals.reservation.status;
  const newStatus = req.body.data.status;

  if (currentStatus === "finished") {
    return next({
      status: 400,
      message: `Cannot update status of already finished reservation.`,
    });
  } else if (!statuses.includes(newStatus)) {
    return next({
      status: 400,
      message: `Status must be booked, seated, or finished. Cannot be ${newStatus}`,
    });
  }
  next();
}

/** Updates a valid reservation in the database */
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const data = await service.update(updatedReservation);
  res.json({ data });
}

/** Updates the status of a reservation in the database */
async function updateReservationStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };

  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    validateBookingStatus,
    validatePeopleCount,
    validateMobileNumber,
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(validateReservationId), read],
  updateReservationStatus: [
    asyncErrorBoundary(validateReservationId),
    validateReservationStatus,
    asyncErrorBoundary(updateReservationStatus),
  ],
  update: [
    asyncErrorBoundary(validateReservationId),
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    validatePeopleCount,
    validateMobileNumber,
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(update),
  ],
};
