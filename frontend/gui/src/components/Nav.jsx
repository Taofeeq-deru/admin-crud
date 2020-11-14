import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Nav extends Component {
  state = {};
  render() {
    const { location } = this.props;
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
              to=""
              className={`link ${
                location.pathname === "/login" ? "active" : ""
              }`}>
              Log In
            </Link>
            <Link
              to=""
              className={`link ${
                location.pathname === "/signup" ? "active" : ""
              }`}>
              Sign Up
            </Link>
          </div>
        </nav>
      </>
    );
  }
}

export default withRouter(Nav);
