import React, { Component } from "react";
import { List, Fail } from "../components";
import axios from "axios";

class Home extends Component {
  state = {
    products: "",
    success: "",
    loading: true,
    alert: {
      set: false,
      message: "",
      type: "",
    },
  };

  componentDidMount() {
    document.title = "Products";
    window.scrollTo(0, 0);
    const localData = JSON.parse(localStorage.getItem("products"));
    localStorage.removeItem("prevUrl");

    if (localData === null) {
      this.getData();
    } else {
      setTimeout(() => {
        this.setState({
          ...this.state,
          success: true,
          loading: false,
          products: localData,
        });
      }, 100);
    }
  }

  getData() {
    axios
      .get("http://127.0.0.1:8000/products/")
      .then((resp) => {
        this.setState({
          ...this.state,
          success: true,
          loading: false,
          products: resp.data.data,
        });
        localStorage.setItem("products", JSON.stringify(resp.data.data));
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          loading: false,
          success: false,
          alert: { set: true, message: err.toString(), type: "danger" },
        });
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
    const { products, loading, success } = this.state;
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
            <div className="home">
              <div className="container py-2">
                <h1 className="text-center my-4">Products</h1>
                <div className="product-list">
                  <List products={products} />
                </div>
                {/* <h2 className="text-center form-title my-4">Add New Product</h2>
                <Form method="post" id={null} product={null} /> */}
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <Fail set={set} message={message} type={type} />
          </>
        );
      }
    }
  }
}

export default Home;
