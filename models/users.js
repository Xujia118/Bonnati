const uuid = require("uuid").v4;

const users = {};

function isValid(username) {
  let isValid = true;
  isValid = !!username && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

// Get all user data: car, orders and info
function getUserData(username) {
  return users[username];
}

function addUser(username) {
  users[username] = {
    cart: {},

  }
}
 
function updateUserData({ username, key, newData }) {
  const id = uuid();

  // Initialize keys 
  if (!users[username]) {
    users[username] = {};
  }
  if (!users[username][key]) {
    users[username][key] = {};
  }

  // Cart is a single object, as it is cleared whenver an order is placed
  if (key === "cart") {
    // Clear cart when newData is null
    if (Object.keys(newData).length === 0) {
      users[username][key] = {};
      // When newData is not null, user is still updating cart
    } else {
      users[username][key] = newData;
    }
  } else {
    // Renders and info are nested objects, hence the id
    users[username][key][id] = newData;
  }
}

// updateUserData({ username: "Alice", key: "cart", newData: { dishId1: 1, dishId2: 2 } });
// updateUserData({ username: "Alice", key: "orders", newData: { orderId1: {}, orderID2: {} } });
// updateUserData({ username: "Alice", key: "orders", newData: { orderId3: {}, orderId4: {} } });
// updateUserData({ username: "Alice", key: "info", newData: { a: 1, b: 2 } });
// // updateUserData({ username: "Alice", key: "cart", newData: {} }); // This will clear cart
// const testUserData = getUserData("Alice");
// console.log("Got userData:", testUserData);
// console.log('users:', users)

module.exports = {
  isValid,
  getUserData,
  updateUserData,
};
