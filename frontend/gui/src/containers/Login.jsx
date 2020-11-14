import React, { Component } from "react";

class Login extends Component {
  state = {};

  goBack() {
    const token = "12345";
    localStorage.setItem("token", token);
    window.history.back();
  }

  render() {
    return (
      <>
        <button className="btn btn-primary" onClick={(e) => this.goBack(e)}>
          back
        </button>
      </>
    );
  }
}

export default Login;
