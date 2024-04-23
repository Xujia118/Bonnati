import Error from "./Error";

import "./FormLogin.css";

function FormLogin({
  onLogin,
  username,
  setUsername,
  errorMessage,
  setErrorMessage,
}) {
  function handleChange(e) {
    setErrorMessage("");
    setUsername(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(username);
  }

  return (
    <>
      <div className="main-wrapper">
        <form className="form-login" onSubmit={handleSubmit}>
          <h1 className="login-header">Login</h1>
          <div className="form-container">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username..."
              onChange={handleChange}
            />
          </div>
          <button className="button-login" type="submit">
            Log in
          </button>
          <Error errorMessage={errorMessage} />
        </form>
      </div>
    </>
  );
}

export default FormLogin;
