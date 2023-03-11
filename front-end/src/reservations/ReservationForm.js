import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({ reservationId = "", reservation = "" }) {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (reservation) {
      setFormData({
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: reservation.people,
        reservation_id: reservation.reservation_id,
      });
    }
  }, [reservation]);

  const handleChange = ({ target }) => {
    let value = null;
    if (target.name === "people" && target.value) {
      value = Number(target.value);
    } else {
      value = target.value;
    }
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    if (reservationId) {
      try {
        await updateReservation(
          reservationId,
          { data: formData },
          abortController.signal
        );
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setError(error);
      }
    } else {
      try {
        await createReservation({ data: formData }, abortController.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setError(error);
      }
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name" className="form-label">
            First Name
            <input
              id="first_name"
              name="first_name"
              type="text"
              className="form-control"
              onChange={handleChange}
              value={formData.first_name}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="last_name" className="form-label">
            Last Name
            <input
              id="last_name"
              name="last_name"
              type="text"
              className="form-control"
              onChange={handleChange}
              value={formData.last_name}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number
            <input
              id="mobile_number"
              name="mobile_number"
              type="text"
              className="form-control"
              onChange={handleChange}
              value={formData.mobile_number}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date" className="form-label">
            Date
            <input
              id="reservation_date"
              name="reservation_date"
              type="date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              className="form-control"
              onChange={handleChange}
              value={formData.reservation_date}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time" className="form-label">
            Time
            <input
              id="reservation_time"
              name="reservation_time"
              type="time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              className="form-control"
              onChange={handleChange}
              value={formData.reservation_time}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="people" className="form-label">
            Number of People
            <input
              id="people"
              name="people"
              type="number"
              className="form-control"
              onChange={handleChange}
              value={formData.people}
            />
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
      <ErrorAlert error={error} />
    </div>
  );
}

export default ReservationForm;
