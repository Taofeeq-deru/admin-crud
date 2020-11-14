import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class Nav extends Component {
  state = { loading: false };

  async logOut() {
    this.setState({ loading: true });
    const url = "http://127.0.0.1:8000/accounts/logout/";
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Token ${token}` } };
    await axios({ method: "post", url, config })
      .then((resp) => {
        this.setState({ loading: false });
        localStorage.removeItem("token");
        this.props.history.push("/login");
      })
      .catch((err) => {
        this.setState({ loading: false });
        localStorage.removeItem("token");
        this.props.history.push("/login");
      });
  }

  render() {
    const { location } = this.props;
    const { loading } = this.state;
    const token = localStorage.getItem("token");
    return (
      <>
        <nav className="shadow-sm sticky-top">
          <div className="d-flex">
            <Link
              to=""
              className={`link ${
                location.pathname === "/" ||
                location.pathname.search("products") > 0
                  ? "active"
                  : ""
              }`}>
              Home
            </Link>
            <Link
              to="/addnew"
              className={`link ${
                location.pathname === "/addnew" ? "active" : ""
              }`}>
              Add New Product
            </Link>
            {token === null ? (
              <>
                <Link
                  to="/login"
                  className={`link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}>
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={`link ${
                    location.pathname === "/signup" ? "active" : ""
                  }`}>
                  Sign Up
                </Link>{" "}
              </>
            ) : (
              <>
                <span className="link" onClick={(e) => this.logOut(e)}>
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status">
                      <span className="sr-only">loading...</span>
                    </span>
                  )}
                  Log Out
                </span>
              </>
            )}
          </div>
        </nav>
      </>
    );
  }
}

export default withRouter(Nav);
