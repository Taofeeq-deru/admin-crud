import React, { Component } from "react";
import { Form } from "./index";
import { withRouter } from "react-router-dom";

class AddProduct extends Component {
  state = {};
  componentDidMount() {
    document.title = "Add New Product";
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");

    if (token === null) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <>
        <div className="container new">
          <h1 className="text-center form-title my-4">Add New Product</h1>
          <Form method="post" id={null} product={null} />
        </div>
      </>
    );
  }
}

export default withRouter(AddProduct);
