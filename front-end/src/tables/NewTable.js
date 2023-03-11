import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    let value = null;
    if (target.name === "capacity") {
      value = Number(target.value);
    } else {
      value = target.value;
    }
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable({ data: formData }, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1>Create New Table</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name" className="form-label">
            Table Name
            <input
              id="table_name"
              name="table_name"
              type="text"
              className="form-control"
              onChange={handleChange}
              value={formData.table_name}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="capacity" className="form-label">
            Capacity
            <input
              id="capacity"
              name="capacity"
              type="number"
              className="form-control"
              onChange={handleChange}
              value={formData.capacity}
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
    </main>
  );
}

export default NewTable;
