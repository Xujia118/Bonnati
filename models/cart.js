const dishes = require("./dishes");
const users = require("./users");

function getUserCart(username) {
  const userData = users.getUserData(username);
  if (!userData) {
    return {};
  }
  return userData.cart;
}
 
function getCart(username) {
  const userCart = getUserCart(username);
  const total = calculateTotal(userCart);
  return [userCart, total];
}

// At checkout the cart is cleared
function clearCart(username) {
  users.updateUserData({ username, key: "cart", newData: {} });
}

function calculateTotal(userCart) {
  return Object.keys(userCart)
    .reduce((total, key) => total + userCart[key].subtotal, 0)
    .toFixed(2);
}

function updateCart({ username, dishId, operator }) {
  // Retrieve dish object
  const dish = dishes.getDish(dishId);

  // Get user cart
  const userCart = getUserCart(username);

  // Update cart
  const updatedCart = modifyCart({ userCart, dishId, operator, dish });

  // Update user data
  users.updateUserData({ username, key: "cart", newData: updatedCart });

  return updatedCart;
}

function modifyCart({ userCart, dishId, operator, dish }) {
  const updatedCart = { ...userCart };
  let quantity = 0;

  if (operator === "+") {
    if (!updatedCart[dishId]) {
      quantity = 1;
      updatedCart[dishId] = { ...dish, quantity };
    } else {
      quantity = updatedCart[dishId].quantity + 1;
      updatedCart[dishId].quantity = quantity;
    }
  } else if (updatedCart[dishId] && updatedCart[dishId].quantity > 0) {
    quantity = updatedCart[dishId].quantity - 1;
    updatedCart[dishId].quantity = quantity;
  }

  const dishQuantity = updatedCart[dishId].quantity;
  const dishPrice = parseFloat(dish.price);
  const subtotal = dishQuantity * dishPrice;
  updatedCart[dishId] = { ...dish, quantity, subtotal };

  return updatedCart;
}

module.exports = {
  getCart,
  updateCart,
  clearCart,
};
