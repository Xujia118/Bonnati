import { useEffect } from "react";

import "./Orders.css";

function Orders({ orders, onFetchOrders, info }) {
  function getOrdersArray(orders) {
    if (!orders) {
      return {};
    }

    return Object.values(orders).sort(
      (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
    );
  }

  const ordersArray = getOrdersArray(orders);

  useEffect(() => {
    onFetchOrders();
  }, []);

  return (
    <>
      <div className="main-wrapper">
        {ordersArray.length > 0 ? (
          <ul className="orders">
            {ordersArray.map((item) => (
              <li key={item.id} className="card-order">
                <div className="order-header-info">
                  <span className="order-date">
                    {item.orderTime.slice(0, 10)}
                  </span>
                  <span className="order-id">Order # {item.id}</span>
                  <span className="order-amount">${item.amount}</span>
                  <span className="order-username">{item.username}</span>
                  <span className="order-type">{item.orderType}</span>
                  {item.orderType === 'online' && <span className="order-info">{info.address}</span>}
                </div>
                <ul className="item-details">
                  {Object.values(item.orderItems).map((dish) => (
                    <li key={dish.id} className="card-item-detail">
                      <div className="item-image-container">
                        <img className="item-image" src={dish.image} alt="" />
                      </div>
                      <div className="item-text">
                        <span className="item-name">{dish.name}</span>
                        <span className="item-description">
                          {dish.description}
                        </span>
                      </div>
                      <span className="item-price">{dish.price}</span>
                      <span className="item-quantity">{dish.quantity}</span>
                      <span className="item-subtotal">{dish.subtotal}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <h2>No orders</h2>
        )}
      </div>
    </>
  );
}

export default Orders;
