const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

// Import models
const dishes = require("./models/dishes");
const sessions = require("./models/sessions");
const users = require("./models/users");
const cart = require("./models/cart");
const orders = require("./models/orders");
const info = require("./models/info");

// Middleware
// app.use(express.static("./dist"));
app.use(cookieParser());
app.use(express.json());

// APIs
function authenticate(req, res) {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return false;
  }

  return username;
}

// Sessions
app.get("/api/v1/session", (req, res) => {
  const username = authenticate(req, res);
  if (!username) return;
  res.status(200).json({ username });
});

// Login
app.post("/api/v1/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  if (username.length < 3 || username.length > 20) {
    res.status(403).json({ error: "invalid-length" });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie("sid", sid);
  res.status(201).json({ username });
});

// Logout
app.delete("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  if (sid) {
    res.clearCookie("sid");
  }

  if (username) {
    sessions.deleteSession(sid);
  }

  res.json({ loggedOut: true });
});

// Menu
app.get("/api/v1/menu", (req, res) => {
  const menu = dishes.getMenu();
  res.json({ menu });
});

// Cart
app.get("/api/v1/cart", (req, res) => {
  const username = authenticate(req, res);
  if (!username) {
    return;
  }

  const [userCart, total] = cart.getCart(username);
  res.json({ userCart, total });
});
 
// Cart is initialized empty, so only update, no create
app.patch("/api/v1/cart", (req, res) => {
  const username = authenticate(req, res);
  if (!username) {
    return;
  }
  const { dishId, operator } = req.body;

  cart.updateCart({ username, dishId, operator });
  const [userCart, total] = cart.getCart(username);

  res.status(201).json({ userCart, total });
});

app.delete("/api/v1/cart", (req, res) => {
  const username = authenticate(req, res);
  if (!username) {
    return;
  }

  cart.clearCart(username);
  res.json({ message: "cart cleared" });
});

// Orders
app.get("/api/v1/orders", (req, res) => {
  const username = authenticate(req, res);
  if (!username) return;

  const clientOrders = orders.getUserOrder(username);
  res.json({ clientOrders });
});

app.post("/api/v1/orders", (req, res) => {
  const username = authenticate(req, res);
  if (!username) return;

  const { orderItems, orderType } = req.body;

  const clientOrder = {
    username,
    orderItems,
    orderType,
  };

  const newOrder = orders.addOrder(clientOrder);
  res.status(201).json({ newOrder });
});

// Cancel an order as long as accepted status is false

// Clients
app.get("/api/v1/info", (req, res) => {
  const username = authenticate(req, res);
  if (!username) return;

  const clientInfo = info.getUserInfo(username);

  res.json({ clientInfo });
});

app.post("/api/v1/info", (req, res) => {
  const username = authenticate(req, res);
  if (!username) return;

  const clientInfo = req.body;

  for (const field in clientInfo) {
    if (!clientInfo[field]) {
      return res.status(400).json({ error: "invalid-data" }); 
    }
  }

  const newInfo = info.addInfo(username, clientInfo);
  res.status(201).json({ newInfo });
});

// DELETE
// PATCH

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
