import React, { Component } from "react";
import { Alert } from "./index";

class Fail extends Component {
  state = {};
  render() {
    const { set, message, type } = this.props;
    return (
      <>
        <Alert set={set} message={message} type={type} />
        <div className="home">
          <div className="container py-2">
            <h1 className="text-center my-4">{message}</h1>
          </div>
        </div>
      </>
    );
  }
}

export default Fail;
