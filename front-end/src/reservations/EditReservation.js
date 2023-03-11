import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservation_id) {
      loadReservation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then((reservationFromAPI) => {
        reservationFromAPI.reservation_date =
          reservationFromAPI.reservation_date.slice(0, 10);
        setReservation(reservationFromAPI);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Edit Reservation</h1>
      <ReservationForm
        reservationId={reservation_id}
        reservation={reservation}
      />
      <ErrorAlert error={error} />
    </main>
  );
}

export default EditReservation;
