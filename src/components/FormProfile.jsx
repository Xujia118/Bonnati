import { useState } from "react";

import Error from "./Error";

import "./FormProfile.css";

function FormProfile({ info, setInfo, onCreateInfo, setPage, errorMessage, setErrorMessage }) {

  function handleChange(e) {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    for (const key in info) {
      if (!info[key]) {
        setErrorMessage("Invalid data.")
        return;
      }
    }

    setPage("address");
    onCreateInfo(info);
  }

  return (
    <>
      <div className="main-wrapper">
        <div className="form-register">
          <h2 className="form-header">Add Information</h2>
          <form className="form-profile" onSubmit={handleSubmit}>
            <div className="form-container">
              <label htmlFor="phone" />
              Phone:
              <input
                id="phone"
                type="text"
                name="phoneNumber"
                onChange={handleChange}
              />
            </div>
            <div className="form-container">
              <label htmlFor="address" />
              Address:
              <input
                id="address"
                type="text"
                name="address"
                onChange={handleChange}
              />
            </div>
            <div className="form-container">
              <label htmlFor="email" />
              Email:
              <input
                className="email"
                type="text"
                name="email"
                onChange={handleChange}
              />
            </div>
            <button className="button-update" type="submit">
              Update
            </button>
            <span className="error-message">{errorMessage}</span>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormProfile;
