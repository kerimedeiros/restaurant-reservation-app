import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsView({ reservations }) {
  const [reservationId, setReservationId] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (reservationId) {
      handleCancel(reservationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  async function handleCancel(reservationId) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      try {
        await cancelReservation(
          reservationId,
          { data: { status: "cancelled" } },
          abortController.signal
        );
        history.go();
      } catch (error) {
        setError(error);
      }
    }

    return () => abortController.abort();
  }

  return (
    <div className="table-responsive">
      {reservations[0] ? (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Time of Reservation</th>
              <th>Size of Party</th>
              <th>Status</th>
              <th>Seat</th>
              <th>Edit</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => {
              const {
                reservation_id,
                first_name,
                last_name,
                mobile_number,
                reservation_time,
                people,
                status,
              } = reservation;
              if (status !== "finished") {
                return (
                  <tr key={reservation_id}>
                    <td>
                      <p>
                        {first_name} {last_name}
                      </p>
                    </td>
                    <td>
                      <p>{mobile_number}</p>
                    </td>
                    <td>
                      <p>{reservation_time}</p>
                    </td>
                    <td>
                      <p>{people}</p>
                    </td>
                    <td>
                      <p data-reservation-id-status={reservation_id}>
                        {status}
                      </p>
                    </td>
                    {status === "booked" ? (
                      <td>
                        <a href={`/reservations/${reservation_id}/seat`}>
                          Seat
                        </a>
                      </td>
                    ) : (
                      <td></td>
                    )}
                    {status === "booked" ? (
                      <td>
                        <a href={`/reservations/${reservation_id}/edit`}>
                          Edit
                        </a>
                      </td>
                    ) : (
                      <td></td>
                    )}
                    {status === "booked" ? (
                      <td>
                        <button
                          data-reservation-id-cancel={reservation_id}
                          onClick={() => setReservationId(reservation_id)}
                        >
                          Cancel
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}
      <ErrorAlert error={error} />
    </div>
  );
}

export default ReservationsView;
