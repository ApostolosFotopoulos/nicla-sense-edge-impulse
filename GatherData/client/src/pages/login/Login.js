import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Redux selectors
import { selectCheckedAuth } from "app/appSlice";

// Redux reducers
import { enableIsAuthenticated, disableIsAuthenticated } from "app/appSlice";

// Queries
import { useLogInDoctorMutation } from "api/apiSlice";

export default function Login() {
  // Refs
  const userRef = useRef();
  const errRef = useRef();

  // Local state
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Redux state
  const checkedAuth = useSelector(selectCheckedAuth);
  const dispatch = useDispatch();

  // Queries
  const [logInDoctor] = useLogInDoctorMutation();

  useEffect(() => {
    if (checkedAuth) {
      userRef.current.focus();
    }
  }, [checkedAuth]);

  useEffect(() => {
    setErrMsg("");
  }, [user, password]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = {
        doctorUserName: user,
        doctorPassword: password,
      };

      let res = await logInDoctor(body).unwrap();

      if (res.jwtToken) {
        localStorage.setItem("accessToken", res.jwtToken);
        dispatch(enableIsAuthenticated());
      } else {
        dispatch(disableIsAuthenticated());
      }

      setUser("");
      setPassword("");
    } catch (err) {
      if (err?.data) {
        setErrMsg(err.data.errMsg);
      } else {
        setErrMsg("No server response");
      }

      errRef.current.focus();
    }
  }

  return (
    <div className="main-container">
      {checkedAuth && (
        <section className="col-container login">
          <p ref={errRef} className={errMsg ? "login-signup__errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Log In</h1>
          <form className="login-signup__form" onSubmit={handleSubmit}>
            <label className="main-input-label" htmlFor="username">
              Username:
            </label>
            <input
              className="main-input"
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            <label className="main-input-label" htmlFor="password">
              Password:
            </label>
            <input
              className="main-input"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button className="login-signup__button">Sign In</button>
          </form>
          <p className="login-signup__link">
            Need an Account?
            <br />
            <span className="line">
              <Link to={"/signup"}>Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </div>
  );
}
