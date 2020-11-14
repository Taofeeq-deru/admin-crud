import React, { Component } from "react";
import { Product, Fail, Form } from "./index";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class ProductDetail extends Component {
  state = {
    product: "",
    success: "",
    loading: true,
    alert: {
      set: false,
      message: "",
      type: "",
    },
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getData();
  }

  getData() {
    const productID = this.props.match.params.productID;
    axios
      .get(`http://127.0.0.1:8000/products/${productID}/`)
      .then((resp) => {
        this.setState({
          ...this.state,
          success: true,
          loading: false,
          product: resp.data.data,
        });
        localStorage.setItem("product", JSON.stringify(resp.data.data));
      })
      .catch((err) => {
        if (err.response) {
          this.setState({
            ...this.state,
            loading: false,
            success: false,
            alert: {
              set: true,
              message: `Product ${err.response.data.detail}`,
              type: "danger",
            },
          });
          console.log(err.response);
        } else {
          console.log(err);
          this.setState({
            ...this.state,
            loading: false,
            success: false,
            alert: {
              set: true,
              message: err.toString(),
              type: "danger",
            },
          });
        }

        this.removeAlert();
      });
  }

  removeAlert() {
    setTimeout(() => {
      this.setState({
        ...this.state,
        alert: { ...this.state.alert, set: false },
      });
    }, 2000);
  }

  render() {
    const { loading, product, success } = this.state;
    const { set, message, type } = this.state.alert;
    if (loading) {
      return (
        <>
          <div className="loading">
            <div className="beat" style={{ width: "3rem", height: "3rem" }}>
              <div
                className="spinner-border text-primary"
                style={{ width: "100%", height: "100%" }}
                role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      if (success) {
        return (
          <>
            <div className="container">
              <span className="d-flex flex-row mt-3">
                <Link to="/" className="back-home">
                  Products
                </Link>
                {"/"}
                <p className="ml-1 text-capitalize"> {product.name}</p>
              </span>
              <div className="product-detail">
                <Product product={product} />
              </div>
              <h2 className="text-center form-title my-4">Update Product</h2>
              <Form method="put" id={product.id} product={product} />
            </div>
          </>
        );
      } else {
        return <Fail set={set} message={message} type={type} />;
      }
    }
  }
}

export default withRouter(ProductDetail);
