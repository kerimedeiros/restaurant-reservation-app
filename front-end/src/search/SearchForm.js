import React, { useState } from "react";
import { searchNumber } from "../utils/api";
import ReservationsView from "../dashboard/ReservationsView";
import ErrorAlert from "../layout/ErrorAlert";

function SearchForm() {
  const [error, setError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const reservationsFromAPI = await searchNumber(
        mobileNumber,
        abortController.signal
      );
      setReservations(reservationsFromAPI);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1>Search for Existing Reservation</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number" className="form-label">
          Search by Mobile Number
          <input
            id="mobile_number"
            name="mobile_number"
            placeholder="Enter a customer's phone number."
            type="text"
            className="form-control"
            style={{ width: 275, marginRight: 10 }}
            onChange={handleChange}
            value={mobileNumber}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      {mobileNumber ? <ReservationsView reservations={reservations} /> : null}
      <ErrorAlert error={error} />
    </main>
  );
}

export default SearchForm;
