import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ReservationsView from "./ReservationsView";
import TablesView from "./TablesView";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  if (query.has("date")) {
    date = query.get("date");
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function previousDay(date) {
    const previousDate = previous(date);
    history.push(`/dashboard?date=${previousDate}`);
  }

  function nextDay(date) {
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
  }

  return (
    <main>
      <h1>Reservation Dashboard</h1>
      <ErrorAlert error={reservationsError || tablesError} />
      <div className="row my-3">
        <button
          className="btn btn-primary col mx-3"
          onClick={() => previousDay(date)}
        >
          Previous Day
        </button>
        <button
          className="btn btn-primary col mx-3"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-primary col mx-3"
          onClick={() => nextDay(date)}
        >
          Next Day
        </button>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ReservationsView reservations={reservations} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <TablesView tables={tables} />
    </main>
  );
}

export default Dashboard;
