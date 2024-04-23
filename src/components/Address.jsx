import { useEffect } from "react";
import addIcon from "../assets/add_FILL0_wght400_GRAD0_opsz24.svg";

import "./Address.css";

function Address({ setPage, info, onFetchInfo }) {

  useEffect(() => {
    onFetchInfo();
  }, [])
  
  return (
    <>
      <div className="address-main-wrapper">
        <h2>Your addresses</h2>
        <div className="cards-address">
          <div className="card-address add" onClick={() => setPage("profile")}>
            <img className="add-icon" src={addIcon} alt="add address" />
            <span className="add-text">Add Address</span>
          </div>
          <ul className="card-address">
            {info ? (
              Object.entries(info).map(([key, value]) => (
                <li className="card-item" key={key}>
                  <span>{value}</span>
                </li>
              ))
            ) : (
              <p>No address</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Address;
