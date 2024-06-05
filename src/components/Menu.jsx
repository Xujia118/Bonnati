import { LOGIN_STATUS, CLIENT, SERVER } from "../constants";

import "./Menu.css";

function Menu({
  loginStatus,
  onUpdateCart,
  setPage,
  filter,
  setFilter,
  handleFilter,
}) {
  const filteredMenu = handleFilter(filter);

  function handleOnclick(e) {
    setFilter(e.target.name);
  }

  function handleAddToCart(dishId, operator) {
    loginStatus === LOGIN_STATUS.IS_LOGGED_IN
      ? onUpdateCart({ dishId, operator })
      : setPage("login");
  }

  return (
    <>
      <div className="sidebar-menu">
        <button
          className="button-sidebar"
          name="brunch"
          onClick={handleOnclick}
        >
          Brunch
        </button>
        <button className="button-sidebar" name="lunch" onClick={handleOnclick}>
          Lunch
        </button>
        <button
          className="button-sidebar"
          name="dinner"
          onClick={handleOnclick}
        >
          Dinner
        </button>
        <button
          className="button-sidebar"
          name="happyHour"
          onClick={handleOnclick}
        >
          Happy Hour
        </button>
      </div>

      <div className="cards">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((dish) => (
            <div key={dish.id} className="card">
              <div className="card-image-container">
                <img className="card-image" src={dish.image} alt={dish.name} />
              </div>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <div className="cart-bottom">
                <span>Price: ${dish.price}</span>
                <button
                  className="button-add-to-cart"
                  onClick={() => handleAddToCart(dish.id, "+")}
                >
                  Add +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No result found</p>
        )}
      </div>
    </>
  );
}

export default Menu;
