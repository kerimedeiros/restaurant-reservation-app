import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatReservation } from "../utils/api";

function ReservationSeat() {
  const { reservation_id } = useParams();

  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, [reservation_id]);

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const [tableId, setTableId] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await seatReservation(
        tableId,
        { data: { reservation_id } },
        abortController.signal
      );
      history.push(`/dashboard`);
    } catch (error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1>Seat Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id" className="form-label">
            <select
              name="table_id"
              id="table-id"
              className="form-control"
              value={tableId}
              onChange={(event) => setTableId(event.target.value)}
            >
              {tables.map((table) => {
                if (!table.reservation_id) {
                  return (
                    <option key={table.table_id} value={table.table_id}>
                      {table.table_name} - {table.capacity}
                    </option>
                  );
                } else {
                  return null;
                }
              })}
            </select>
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
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default ReservationSeat;
