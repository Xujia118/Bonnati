import { useState } from "react";

import "./Cart.css";

function Cart({ setPage, cart, total, onUpdateCart, onPlaceOrder, info, errorMessage, setErrorMessage }) {
  const [option, setOption] = useState("table");

  function handleClick(dishId, operator) {
    onUpdateCart({ dishId, operator }); // Here we setCart already. So cart is not empty
  }

  function handleOptionChange(e) {
    setOption(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const orderData = {
      orderItems: cart,
      orderType: option,
    };

    if (option === 'online' && info.address.length === 0) {
      setErrorMessage("Please provide a valid address.")
      console.log(errorMessage)
      setPage("profile");
      return;
    }
    
    onPlaceOrder(orderData);
    setPage("processing");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ul className="cart-list">
          {Object.keys(cart).map((dishId) => (
            <li className="cart-dish" key={dishId}>
              <div className="dish-image-container">
                <img className="dish-image" src={cart[dishId].image} alt="" />
              </div>
              <div className="text-container">
                <h3 className="dish-name">{cart[dishId].name}</h3>
                <p className="dish-description">{cart[dishId].description}</p>
              </div>

              <span className="dish-price">{cart[dishId].price}</span>

              <div className="quantity-control">
                <button
                  className="button-decrease"
                  type="button"
                  disabled={cart[dishId].quantity === 1}
                  onClick={() => {
                    handleClick(dishId, "-");
                  }}
                >
                  -
                </button>
                <span className="dish-quantity">{cart[dishId].quantity}</span>
                <button
                  className="button-increase"
                  type="button"
                  onClick={() => {
                    handleClick(dishId, "+");
                  }}
                >
                  +
                </button>
              </div>
              <span className="dish-subtotal">{cart[dishId].subtotal}</span>
            </li>
          ))}

          {Object.keys(cart).length !== 0 ? (
            <>
              <hr />
              <div className="checkout-control">
                <div className="cart-total">Total: {total}</div>
                <select
                  name="select-mode"
                  id="mode"
                  onChange={handleOptionChange}
                >
                  <option value="table">In store</option>
                  <option value="online">Online</option>
                </select>
                <button className="button-checkout" type="submit">
                  Check out
                </button>
              </div>
            </>
          ) : (
            <h2>Cart is empty</h2>
          )}
        </ul>
      </form>
    </>
  );
}

export default Cart;
