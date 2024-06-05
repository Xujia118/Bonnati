import { useState, useEffect } from "react";

import { LOGIN_STATUS, CLIENT, SERVER } from "./constants";

import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchMenu,
  fetchCart,
  fetchUpdateCart,
  fetchClearCart,
  fetchOrders,
  fetchPlaceOrder,  
  fetchInfo,
  fetchUpdateInfo,
} from "./services";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import FormLogin from "./components/FormLogin";
import FormProfile from "./components/FormProfile";
import Address from "./components/Address";
import Processing from "./components/Processing";
import Orders from "./components/Orders";

import "./App.css";

function App() {
  // Data states
  const [username, setUsername] = useState("");
  const [menu, setMenu] = useState({});
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState({});
  const [total, setTotal] = useState(0);
  const [info, setInfo] = useState({
    phoneNumber: "",
    email: "",
    address: "",
  });

  // UI states
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [page, setPage] = useState("menu");
  const [filter, setFilter] = useState("");

  // See our menu as a guest
  function onLoadMenu() {
    setLoading(LOGIN_STATUS.PENDING);
    fetchMenu()
      .then((data) => {
        setLoading(LOGIN_STATUS.NOT_LOGGED_IN);
        setMenu(data.menu);
      })
      .catch((err) => {
        setLoading(LOGIN_STATUS.NOT_LOGGED_IN);
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function onLogin(username) {
    fetchLogin(username)
      .then((data) => {
        setLoading(false);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setUsername(data.username);
        setPage("menu");
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function onLogout() {
    setErrorMessage("");
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    setUsername("");
    setCart({});
    setPage("menu");
    fetchLogout().catch((err) => {
      setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
      setErrorMessage(err?.error || "ERROR");
    });
  }

  function onCheckSession() {
    fetchSession()
      .then((data) => {
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setUsername(data.username);
        return onFetchCart();
      })
      .catch((err) => {
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION });
        }
        return Promise.reject(err);
      });
  }

  function onFetchCart() {
    fetchCart()
      .then((data) => {
        setCart(data.userCart);
        setTotal(data.total);
        countCartItems();
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function countCartItems() {
    return Object.keys(cart).reduce(
      (acc, item) => acc + cart[item].quantity,
      0
    );
  }

  function onUpdateCart({ dishId, operator }) {
    fetchUpdateCart({ dishId, operator })
      .then((data) => {
        setCart(data.userCart);
        setTotal(data.total);
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function onFetchOrders() {
    fetchOrders()
      .then((data) => {
        setOrders(data.clientOrders);
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function onPlaceOrder({ orderItems, orderType }) {
    fetchPlaceOrder({ orderItems, orderType })
      .then((data) => {
        return fetchClearCart();
      })
      .then((data) => {
        setCart({});
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function onFetchInfo() {
    fetchInfo()
      .then((data) => {
        setInfo(Object.values(data.clientInfo)[0]);
      })
      .catch((err) => {
        if (err.error === "auth-missing") {
          setPage("page");
        }
      });
  }

  function onCreateInfo(userInfo) {
    fetchUpdateInfo(userInfo)
      .then((data) => {
        setInfo(data.newInfo);
      })
      .catch((err) => {
        setErrorMessage(err?.error || "ERROR");
      });
  }

  function handleFilter(filter) {
    let filteredMenu;
    const type = ["brunch", "lunch", "dinner", "happyHour"];

    if (!filter) {
      filteredMenu = [...Object.values(menu)];
    } else if (type.includes(filter)) {
      filteredMenu = Object.values(menu).filter((item) => item.type[filter]);
    } else {
      filteredMenu = Object.values(menu).filter(
        (item) =>
          item.name.toLowerCase().includes(filter) ||
          item.description.toLowerCase().includes(filter)
      );
    }

    return filteredMenu;
  }

  useEffect(() => {
    onCheckSession();
  }, [loginStatus]);

  useEffect(() => {
    onLoadMenu();
  }, []);

  return (
    <>
      <Header
        loginStatus={loginStatus}
        page={page}
        setPage={setPage}
        setFilter={setFilter}
        onLogout={onLogout}
        onFetchCart={onFetchCart}
        countCartItems={countCartItems}
      />
      {loginStatus === LOGIN_STATUS.PENDING && <div>Loading...</div>}
      <main>
        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && page === "login" && (
          <FormLogin
            onLogin={onLogin}
            username={username}
            setUsername={setUsername}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
        {page === "menu" && (
          <Menu
            onLogin={onLogin}
            loginStatus={loginStatus}
            setPage={setPage}
            onUpdateCart={onUpdateCart}
            filter={filter}
            setFilter={setFilter}
            handleFilter={handleFilter}
          />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && page === "cart" && (
          <Cart
            setPage={setPage}
            cart={cart}
            total={total}
            onUpdateCart={onUpdateCart}
            onPlaceOrder={onPlaceOrder}
            info={info}
            setErrorMessage={setErrorMessage}
          />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && page === "orders" && (
          <Orders orders={orders} onFetchOrders={onFetchOrders} info={info} />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && page === "processing" && (
          <Processing setPage={setPage} />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && page === "address" && (
          <Address setPage={setPage} info={info} onFetchInfo={onFetchInfo} />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && page === "profile" && (
          <FormProfile
            info={info}
            setInfo={setInfo}
            onCreateInfo={onCreateInfo}
            setPage={setPage}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </main>
    </>
  );
}

export default App;
