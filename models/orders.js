const uuid = require("uuid").v4;

const dishes = require("./dishes");
const users = require("./users");

const ORDER_TYPES = {
  TABLE: "table",
  ONLINE: "online",
  TAKEAWAY: "takeaway",
};

function getUserOrder(username) {
  const userData = users.getUserData(username);
  if (!userData) {
    return {};
  }
  return userData.orders;
}

function addOrder(clientOrder) {
  // Validate
  const errorMessage = validateOrder(clientOrder);
  if (errorMessage) {
    return errorMessage;
  }

  // Assemble
  const newOrder = assembleOrder(clientOrder);

  // Update Client data
  // Add order
  users.updateUserData({
    username: clientOrder.username,
    key: "orders",
    newData: newOrder,
  });

  // Clear cart
  users.updateUserData({
    username: clientOrder.username,
    key: "cart",
    newData: {},
  });

  return newOrder;
}

function validateOrder(clientOrder) {
  if (!clientOrder) {
    return "Order is empty";
  }

  if (!clientOrder.orderItems) {
    return "Order items are missing";
  }

  if (!clientOrder.orderType) {
    return "Order type is missing";
  }

  if (!Object.values(ORDER_TYPES).includes(clientOrder.orderType)) {
    return "Invalid order type";
  }

  Object.keys(clientOrder.orderItems).forEach((key) => {
    const dish = dishes.getDish(key);
    if (!dish) {
      return "Order items not found in the menu";
    }
  });

  return "";
}

function assembleOrder(clientOrder) {
  // Assemble all order information
  const id = uuid();
  const username = clientOrder.username;
  const orderTime = new Date();
  const orderType = clientOrder.orderType;
  const orderItems = clientOrder.orderItems;
  const amount = calculateOrderAmount(orderItems);

  // Build up order and send to database
  const newOrder = {
    id,
    username,
    orderTime,
    orderType,
    orderItems,
    amount,
    accepted: false, // For restaurant side application to handle
    paid: false, // For restaurant side application to handle
  };

  return newOrder;
}

function calculateOrderAmount(orderItems) {
  return Object.keys(orderItems)
    .reduce((total, key) => total + orderItems[key].subtotal, 0)
    .toFixed(2);
}

module.exports = {
  getUserOrder,
  addOrder,
};
