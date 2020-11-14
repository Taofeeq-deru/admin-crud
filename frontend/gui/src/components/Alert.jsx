import React, { Component } from "react";

class Alert extends Component {
  state = {};
  render() {
    const { set, message, type } = this.props;

    if (set) {
      return (
        <>
          <div className="alert-message">
            <div
              className={`alert alert-${type}`}
              role="alert"
              style={{ width: "300px", fontWeight: "700" }}>
              {message}
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
