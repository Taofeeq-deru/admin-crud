import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const initialState = {
  username: "",
  password: "",
  error: "",
  loading: false,
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    document.title = "Log In";
    window.scrollTo(0, 0);
  }

  handleChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.setState((state) => ({ ...state, error: "", [field]: value }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;

    this.setState({ ...this.state, loading: true });

    const url = "http://127.0.0.1:8000/accounts/login/";

    await axios
      .post(url, { username, password })
      .then((resp) => {
        const token = resp.data.data.key;
        localStorage.setItem("token", token);
        if (localStorage.getItem("prevUrl") === undefined) {
          this.setState({ ...initialState });
          this.props.history.push("/");
        } else {
          localStorage.removeItem("prevUrl");
          this.setState({ ...initialState });
          window.history.back();
        }
      })
      .catch((err) => {
        if (err.response) {
          this.setState({
            ...this.state,
            error: err.response.data.message.non_field_errors[0],
            loading: false,
          });
        } else {
          console.log(err.toString());
          this.setState({
            ...this.state,
            error: err.toString(),
            loading: false,
          });
        }
      });
  }

  render() {
    const { username, password, error, loading } = this.state;
    return (
      <>
        <div className="container login">
          <div className="login-form">
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <h1 className="text-left form-title my-5">Welcome back,</h1>
              {error.length > 1 ? (
                <>
                  <div className="error bg-danger rounded mb-3 p-4">
                    <p className="text-center text-white mb-0">{error}</p>
                  </div>{" "}
                </>
              ) : (
                <> </>
              )}
              <div className="form-group">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={`form-control ${
                    error.length > 1 ? "is-invalid" : ""
                  }`}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => this.handleChange(e)}
                  required
                />
                <div className="invalid-feedback">{error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`form-control ${
                    error.length > 1 ? "is-invalid" : ""
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => this.handleChange(e)}
                  required
                />
                <div className="invalid-feedback">{error}</div>
              </div>
              <div className="form-group">
                <button className="btn btn-primary form-control">
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status">
                      <span className="sr-only">loading...</span>
                    </span>
                  )}
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Login);
