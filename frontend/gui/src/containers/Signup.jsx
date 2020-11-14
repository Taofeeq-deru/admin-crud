import React, { Component } from "react";
import { validateFields } from "../validation";
import { withRouter } from "react-router-dom";
import axios from "axios";

const initialState = {
  username: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  email: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  password1: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  password2: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  submitCalled: false,
  loading: false,
  error: false,
};
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleBlur(validationFunc, e) {
    const field = e.target.name;

    if (
      this.state[field]["validateOnChange"] === false &&
      this.state.submitCalled === false
    ) {
      this.setState((state) => ({
        [field]: {
          ...state[field],
          validateOnChange: true,
          error: validationFunc(state[field].value),
        },
      }));
    }

    return;
  }

  handlePasswordBlur(validationFunc, e) {
    const field = e.target.name;

    if (
      this.state[field]["validateOnChange"] === false &&
      this.state.submitCalled === false
    ) {
      this.setState((state) => ({
        [field]: {
          ...state[field],
          validateOnChange: true,
          error: validationFunc(state.password1.value, state[field].value),
        },
        password1: {
          ...state.password1,
          error: validationFunc(state.password1.value, state[field].value),
        },
      }));
    }

    return;
  }

  handleChange(validationFunc, e) {
    const field = e.target.name;
    const fieldVal = e.target.value;

    this.setState((state) => ({
      [field]: {
        ...state[field],
        value: fieldVal,
        error: state[field]["validateOnChange"] ? validationFunc(fieldVal) : "",
      },
    }));
  }

  handlePasswordChange(validationFunc, e) {
    const field = e.target.name;
    const fieldVal = e.target.value;

    this.setState((state) => ({
      [field]: {
        ...state[field],
        value: fieldVal,
        error: state[field]["validateOnChange"]
          ? validationFunc(state.password1.value, fieldVal)
          : "",
      },
      password1: {
        ...state.password1,
        error: state[field]["validateOnChange"]
          ? validationFunc(state.password1.value, fieldVal)
          : "",
      },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const url = "http://127.0.0.1:8000/accounts/signup/";

    const { username, email, password1, password2 } = this.state;

    const usernameVal = username.value;
    const emailVal = email.value;
    const password1Val = password1.value;
    const password2Val = password2.value;

    const usernameError = validateFields.validateUsername(username.value);
    const emailError = validateFields.validateEmail(email.value);
    const password1Error = validateFields.validatePassword(password1.value);
    const password2Error = validateFields.validateConfirmPassword(
      password1.value,
      password2.value
    );

    if (
      [usernameError, emailError, password1Error, password2Error].every(
        (e) => e === false
      )
    ) {
      this.setState({ ...this.state, loading: true });

      await axios
        .post(url, {
          username: usernameVal,
          email: emailVal,
          password1: password1Val,
          password2: password2Val,
        })
        .then((resp) => {
          const token = resp.data.data.key;
          localStorage.setItem("token", token);
          this.setState({ ...initialState });
          this.props.history.push("/");
        })
        .catch((err) => {
          if (err.response) {
            this.setState((state) => ({
              username: {
                ...state.username,
                validateOnChange: true,
                error:
                  err.response.data.message.username &&
                  err.response.data.message.username[0],
              },
              email: {
                ...state.email,
                validateOnChange: true,
                error:
                  err.response.data.message.email &&
                  err.response.data.message.email[0],
              },
              password1: {
                ...state.password1,
                validateOnChange: true,
                error:
                  err.response.data.message.password1 &&
                  err.response.data.message.password1[0],
              },
              password2: {
                ...state.password2,
                validateOnChange: true,
                error:
                  err.response.data.message.password1 &&
                  err.response.data.message.password1[0],
              },
              loading: false,
              error: "Invalid data",
            }));
          } else {
            this.setState((state) => ({
              ...state,
              loading: false,
              error: err.toString(),
            }));
          }
        });
    } else {
      this.setState((state) => ({
        username: {
          ...state.username,
          validateOnChange: true,
          error: usernameError,
        },
        email: {
          ...state.email,
          validateOnChange: true,
          error: emailError,
        },
        password1: {
          ...state.password1,
          validateOnChange: true,
          error: password1Error,
        },
        password2: {
          ...state.password2,
          validateOnChange: true,
          error: password2Error,
        },
      }));
    }
  }

  render() {
    const {
      username,
      email,
      password1,
      password2,
      loading,
      error,
    } = this.state;
    return (
      <>
        <div className="container signup">
          <div className="signup-form">
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <h1 className="form-title text-left my-5">Hello, Sign up</h1>
              {error && (
                <div className="error bg-danger rounded mb-3 p-4">
                  <p className="text-center text-white mb-0">{error}</p>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username.value}
                  placeholder="Enter Userame"
                  className={`form-control ${
                    username.error === false
                      ? "is-valid"
                      : username.error
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(e) =>
                    this.handleChange(validateFields.validateUsername, e)
                  }
                  onBlur={(e) =>
                    this.handleBlur(validateFields.validateUsername, e)
                  }
                />
                <div className="invalid-feedback">{username.error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email.value}
                  placeholder="Enter Email"
                  className={`form-control ${
                    email.error === false
                      ? "is-valid"
                      : email.error
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(e) =>
                    this.handleChange(validateFields.validateEmail, e)
                  }
                  onBlur={(e) =>
                    this.handleBlur(validateFields.validateEmail, e)
                  }
                />
                <div className="invalid-feedback">{email.error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="password1" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  name="password1"
                  id="password1"
                  value={password1.value}
                  placeholder="Enter Password"
                  className={`form-control ${
                    password1.error === false
                      ? "is-valid"
                      : password1.error
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(e) =>
                    this.handleChange(validateFields.validatePassword, e)
                  }
                  onBlur={(e) =>
                    this.handleBlur(validateFields.validatePassword, e)
                  }
                />
                <div className="invalid-feedback">{password1.error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="password2" className="sr-only">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  value={password2.value}
                  placeholder="Confirm Password"
                  className={`form-control ${
                    password2.error === false
                      ? "is-valid"
                      : password2.error
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(e) =>
                    this.handlePasswordChange(
                      validateFields.validateConfirmPassword,
                      e
                    )
                  }
                  onBlur={(e) =>
                    this.handlePasswordBlur(
                      validateFields.validateConfirmPassword,
                      e
                    )
                  }
                />
                <div className="invalid-feedback">{password2.error}</div>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary form-control"
                  onMouseDown={() => this.setState({ submitCalled: true })}>
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status">
                      <span className="sr-only">loading...</span>
                    </span>
                  )}
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signup);
