// Abstraction to avoid repeat and error, and for future scalability
function chainPromise(promise) {
  return promise
    .catch((err) => Promise.reject({ error: "network-error" }))
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    });
}

// Session
export function fetchSession() {
  const fetched = fetch("/api/v1/session");
  return chainPromise(fetched);
}

// Login
export function fetchLogin(username) {
  const fetched = fetch("/api/v1/session", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  return chainPromise(fetched);
}

export function fetchLogout() {
  const fetched = fetch("/api/v1/session", {
    method: "DELETE",
  });
  return chainPromise(fetched);
}

//Menu
export function fetchMenu() {
  const fetched = fetch("/api/v1/menu");
  return chainPromise(fetched);
}

// Cart
export function fetchCart() {
  const fetched = fetch("/api/v1/cart");
  return chainPromise(fetched);
}

export function fetchUpdateCart({ dishId, operator }) {
  const fetched = fetch("/api/v1/cart", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ dishId, operator }),
  });
  return chainPromise(fetched);
}

export function fetchClearCart() {
  const fetched = fetch("/api/v1/cart", {
    method: "DELETE",
  });
  return chainPromise(fetched);
}

// Orders
export function fetchOrders() {
  const fetched = fetch("/api/v1/orders");
  return chainPromise(fetched);
}

export function fetchPlaceOrder({ orderItems, orderType }) {
  const fetched = fetch("/api/v1/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ orderItems, orderType }),
  });
  return chainPromise(fetched);
}

// Info
export function fetchInfo() {
  const fetched = fetch("/api/v1/info");
  return chainPromise(fetched);
}

export function fetchUpdateInfo(clientInfo) {
  const fetched = fetch("/api/v1/info", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(clientInfo),
  });
  return chainPromise(fetched);
}
