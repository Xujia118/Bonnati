import { useState } from "react";

import { LOGIN_STATUS, CLIENT, SERVER } from "../constants";

import HomeIcon from "../assets/home_FILL0_wght400_GRAD0_opsz24.svg";
import SearchIcon from "../assets/search_FILL0_wght400_GRAD0_opsz24.svg";
import AccountIcon from "../assets/account_circle_FILL0_wght400_GRAD0_opsz24.svg";
import CartIcon from "../assets/shopping_cart_FILL0_wght400_GRAD0_opsz24.svg";

import "./Header.css";

function Header({
  loginStatus,
  onLogout,
  setPage,
  setFilter,
  onFetchCart,
  countCartItems,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");

  function handleClickMenu(e) {
    const action = e.target.getAttribute("name");

    if (action === "logout") {
      onLogout();
      setShowMenu(false);
      return;
    }

    setPage(loginStatus === LOGIN_STATUS.NOT_LOGGED_IN ? "login" : action);
    setShowMenu(false);
  }

  function handleClickCart() {
    if (loginStatus === LOGIN_STATUS.IS_LOGGED_IN) {
      setPage("cart");
    } else {
      setPage("login");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFilter(query);
  }

  const cartItems = countCartItems();

  return (
    <header>
      <div className="logo-container">
        <button className="button-home" onClick={() => setPage("menu")}>
          <img className="home-icon" src={HomeIcon} alt="homepage" />
        </button>
        <button className="button-home" onClick={() => setPage("menu")}>
          <h1 className="logo-title">Bonnati</h1>
        </button>
      </div>
      <div className="search-container">
        <form className="form-search" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-search"
            placeholder="Search a dish..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button-search" type="submit">
            <img className="search-icon" src={SearchIcon} alt="search" />
          </button>
        </form>
      </div>
      <div className="control-container">
        <button className="button-cart" type="button" onClick={handleClickCart}>
          <img className="cart-icon" src={CartIcon} alt="cart" />
          <span className="cart-count">{cartItems}</span>
        </button>
        <nav className="dropmenu" onMouseLeave={() => setShowMenu(false)}>
          <button
            className="button-menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            <img
              className="account-icon"
              src={AccountIcon}
              alt="control-center"
            />
          </button>

          <ul className={`menu-list ${showMenu ? "show" : ""}`}>
            <li className="menu-item" name="menu" onClick={handleClickMenu}>
              Menu
            </li>
            <li className="menu-item" name="orders" onClick={handleClickMenu}>
              Orders
            </li>
            <li className="menu-item" name="address" onClick={handleClickMenu}>
              Address
            </li>
            <li className="menu-item" name="profile" onClick={handleClickMenu}>
              Profile
            </li>
            {loginStatus === LOGIN_STATUS.IS_LOGGED_IN ? (
              <li
                className="menu-item"
                disabled
                name="logout"
                onClick={handleClickMenu}
              >
                Logout
              </li>
            ) : (
              <li className="menu-item" name="login" onClick={handleClickMenu}>
                Login
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
