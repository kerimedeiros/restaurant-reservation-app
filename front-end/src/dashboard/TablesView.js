import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { finishTable } from "../utils/api";

function TablesView({ tables }) {
  const history = useHistory();

  const [error, setError] = useState(null);
  const [table, setTable] = useState(null);

  useEffect(() => {
    if (table) {
      handleFinish(table);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function handleFinish(table) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (result) {
      try {
        await finishTable(table.table_id, abortController.signal);
        history.go();
      } catch (error) {
        setError(error);
      }
    }

    return () => abortController.abort();
  }

  return (
    <div className="table-responsive">
      {tables[0] ? (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Occupied?</th>
              <th>Finished?</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => {
              const { table_id, table_name, capacity, reservation_id } = table;
              return (
                <tr key={table_id}>
                  <td>
                    <p>{table_name}</p>
                  </td>
                  <td>
                    <p>{capacity}</p>
                  </td>
                  <td>
                    <p data-table-id-status={table.table_id}>
                      {reservation_id ? "Occupied" : "Free"}
                    </p>
                  </td>
                  {reservation_id ? (
                    <td>
                      <button
                        data-table-id-finish={table.table_id}
                        onClick={() => setTable(table)}
                      >
                        Finish
                      </button>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No tables</p>
      )}
      <ErrorAlert error={error} />
    </div>
  );
}

export default TablesView;
