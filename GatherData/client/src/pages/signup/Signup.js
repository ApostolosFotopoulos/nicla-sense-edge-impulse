import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isValidUserName, isValidName, isValidPassword } from "utils/validateData";

// Redux selectors
import { selectCheckedAuth } from "app/appSlice";

// Redux reducers
import { enableIsAuthenticated, disableIsAuthenticated } from "app/appSlice";

// Queries
import { useSignUpDoctorMutation } from "api/apiSlice";

export default function Signup() {
  // Refs
  const userRef = useRef();
  const errRef = useRef();

  // Local state
  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  // Redux state
  const checkedAuth = useSelector(selectCheckedAuth);
  const dispatch = useDispatch();

  // Queries
  const [signUpDoctor] = useSignUpDoctorMutation();

  // useEffect(() => {
  //   if (checkedAuth) {
  //     userRef.current.focus();
  //   }
  // }, [checkedAuth]);

  useEffect(() => {
    setValidUser(isValidUserName(user));
  }, [user]);

  useEffect(() => {
    setValidFirstName(isValidName(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(isValidName(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidPassword(isValidPassword(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [user, firstName, lastName, password, matchPassword]);

  function clearForm() {
    setUser("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setMatchPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !isValidUserName(user) ||
      !isValidName(firstName) ||
      !isValidName(lastName) ||
      !isValidPassword(password)
    ) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const body = {
        doctorUserName: user,
        doctorFirstName: firstName,
        doctorLastName: lastName,
        doctorPassword: password,
      };
      let res = await signUpDoctor(body).unwrap();

      if (res.jwtToken) {
        localStorage.setItem("accessToken", res.jwtToken);
        dispatch(enableIsAuthenticated());
      } else {
        dispatch(disableIsAuthenticated());
      }

      clearForm();
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
        <section className="col-container signup">
          <p ref={errRef} className={errMsg ? "login-signup__errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Sign Up</h1>
          <form className="login-signup__form" onSubmit={handleSubmit}>
            <label className="main-input-label" htmlFor="username">
              Username:
              <FontAwesomeIcon icon={faCheck} className={validUser ? "valid-input" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validUser || !user ? "hide" : "invalid-input"} />
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
              aria-invalid={validUser ? "false" : "true"}
              aria-describedby="user-note"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p id="user-note" className={userFocus && !validUser ? "input-instructions" : "offscreen"}>
              <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
              Only latin characters allowed.
              <br />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <label className="main-input-label" htmlFor="first-name">
              First Name:
              <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid-input" : "hide"} />
              <FontAwesomeIcon
                icon={faTimes}
                className={validFirstName || !firstName ? "hide" : "invalid-input"}
              />
            </label>
            <input
              className="main-input"
              type="text"
              id="first-name"
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
              aria-invalid={validFirstName ? "false" : "true"}
              aria-describedby="first-name-note"
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            <p
              id="first-name-note"
              className={firstNameFocus && !validFirstName ? "input-instructions" : "offscreen"}
            >
              <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
              Only latin characters allowed.
              <br />
              No numbers or spaces.
            </p>
            <label className="main-input-label" htmlFor="last-name">
              Last Name:
              <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid-input" : "hide"} />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLastName || !lastName ? "hide" : "invalid-input"}
              />
            </label>
            <input
              className="main-input"
              type="text"
              id="last-name"
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
              aria-invalid={validLastName ? "false" : "true"}
              aria-describedby="last-name-note"
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            <p
              id="last-name-note"
              className={lastNameFocus && !validLastName ? "input-instructions" : "offscreen"}
            >
              <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
              Only latin characters allowed.
              <br />
              No numbers or spaces.
            </p>
            <label className="main-input-label" htmlFor="password">
              Password:
              <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid-input" : "hide"} />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPassword || !password ? "hide" : "invalid-input"}
              />
            </label>
            <input
              className="main-input"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="password-note"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="password-note"
              className={passwordFocus && !validPassword ? "input-instructions" : "offscreen"}
            >
              <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
              Only latin characters allowed.
              <br />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a special character.
              <br />
              Allowed special characters: <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            <label className="main-input-label" htmlFor="confirm-password">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPassword ? "valid-input" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPassword ? "hide" : "invalid-input"}
              />
            </label>
            <input
              className="main-input"
              type="password"
              id="confirm-password"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirm-note"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p id="confirm-note" className={matchFocus && !validMatch ? "input-instructions" : "offscreen"}>
              <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
              Must match the first password.
            </p>
            <button
              className="login-signup__button"
              disabled={!validUser || !validFirstName || !validLastName || !validPassword || !validMatch}
            >
              Sign Up
            </button>
            <p className="login-signup__link">
              Already registered?
              <br />
              <span>
                <Link to={"/login"}>Log In</Link>
              </span>
            </p>
          </form>
        </section>
      )}
    </div>
  );
}
