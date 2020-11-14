import React, { Component } from "react";
import { Alert } from "./index";
import { withRouter } from "react-router-dom";
import $ from "jquery";
import axios from "axios";

const url = "http://127.0.0.1:8000/products/";
const initialState = {
  name: "",
  desc: "",
  price: "",
  stock: "",
  img_url: "",
  image: "",
  loading: false,
  deleting: false,
  alert: {
    set: false,
    message: "",
    type: "",
  },
};
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { product } = this.props;
    if (product !== null) {
      const { name, desc, price, stock, image } = product;
      setTimeout(() => {
        this.setState({
          ...this.state,
          name,
          desc,
          price,
          stock,
          img_url: `http://127.0.0.1:8000${image}`,
        });
        document.querySelector("#fileImage").style.display = "inline";
        document.querySelector(".imageLabel").querySelector("span").innerHTML =
          "Change Image";
      }, 100);
    }
  }

  handleChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.setState((state) => ({ ...state, [field]: value }));
  }

  showImage(e) {
    this.setState({
      ...this.state,
      img_url: URL.createObjectURL(e.target.files[0]),
      image: e.target.files[0],
    });

    document.querySelector("#fileImage").style.display = "inline";
  }

  showModal(e) {
    $("#deleteModal").modal("show");
  }

  closeModal(e) {
    $("#deleteModal").modal("hide");
  }

  async handleSubmit(e, method, id) {
    e.preventDefault();
    const { name, desc, price, stock, image } = this.state;
    if (method === "delete") {
      this.setState({ ...this.state, deleting: true });
    } else {
      this.setState({ ...this.state, loading: true });
    }
    let dataFormData = new FormData();
    dataFormData.append("name", name);
    dataFormData.append("desc", desc);
    dataFormData.append("price", price);
    dataFormData.append("stock", stock);
    dataFormData.append("image", image);

    const { history } = this.props;

    switch (method) {
      case "post":
        await axios({
          method,
          url,
          data: dataFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((resp) => {
            localStorage.setItem("products", JSON.stringify(resp.data.data));
            document.querySelector("#fileImage").style.display = "none";
            this.setState({ ...initialState });
            history.push("/");
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              console.log(err);
            }
            this.setState({ ...initialState });
            document.querySelector("#fileImage").style.display = "none";
          });
        break;
      case "put":
        await axios({
          method,
          url: `${url}${id}/`,
          data: dataFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((resp) => {
            console.log(resp.data);
            localStorage.setItem("products", JSON.stringify(resp.data.data));
            document.querySelector("#fileImage").style.display = "none";
            this.setState({ ...initialState });
            history.push("/");
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              console.log(err);
            }
            this.setState({ ...initialState });
            document.querySelector("#fileImage").style.display = "none";
          });
        break;
      case "delete":
        await axios({
          method,
          url: `${url}${id}/`,
        })
          .then((resp) => {
            console.log(resp.data);
            localStorage.setItem("products", JSON.stringify(resp.data.data));
            document.querySelector("#fileImage").style.display = "none";
            this.closeModal();
            this.setState({ ...initialState });
            history.push("/");
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              console.log(err);
            }
            this.setState({ ...initialState });
            document.querySelector("#fileImage").style.display = "none";
          });
        break;
      default:
        await axios({
          method: "post",
          url,
          data: dataFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((resp) => {
            console.log(resp.data);
            localStorage.setItem("products", JSON.stringify(resp.data.data));
            document.querySelector("#fileImage").style.display = "none";
            this.setState({
              ...initialState,
              alert: { set: true, message: "Product Added", type: "success" },
            });
            this.removeAlert();
            window.location.reload();
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              console.log(err);
            }
            this.setState({ ...initialState });
            document.querySelector("#fileImage").style.display = "none";
          });
    }
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
    const { name, desc, price, stock, img_url, loading, deleting } = this.state;
    const { set, type, message } = this.state.alert;
    const { method, id } = this.props;
    return (
      <>
        <Alert set={set} type={type} message={message} />
        <div className="form pb-5">
          <form onSubmit={(e) => this.handleSubmit(e, method, id)}>
            <div className="form-group">
              <label htmlFor="name" className="label">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Product Name"
                value={name}
                onChange={(e) => this.handleChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="label">
                Product Description
              </label>
              <input
                type="text"
                id="desc"
                name="desc"
                className="form-control"
                placeholder="Product Description"
                value={desc}
                onChange={(e) => this.handleChange(e)}
              />
            </div>
            <div className="form-row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="price" className="label">
                    Product Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    placeholder="Product Price"
                    value={price}
                    onChange={(e) => this.handleChange(e)}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="stock" className="label">
                    Product Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    className="form-control"
                    placeholder="Product Stock"
                    value={stock}
                    onChange={(e) => this.handleChange(e)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group img-group form-row">
              <div className="col">
                <label htmlFor="image" className="imageLabel text-center">
                  <span>Choose Image</span>
                  <i className="fas fa-camera-retro fa-2x"></i>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  onChange={(e) => this.showImage(e)}
                />
              </div>
              <div className="col">
                <img src={img_url} alt="product" id="fileImage" />
              </div>
            </div>
            <div className="form-row d-flex flex-wrap-reverse w-100">
              {method === "put" ? (
                <div
                  className="btn btn-danger"
                  onClick={(e) => this.showModal(e)}>
                  Delete Product
                </div>
              ) : (
                <></>
              )}
              <button className="btn-primary btn-submit btn">
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status">
                    <span className="sr-only">loading...</span>
                  </span>
                )}
                Submit
              </button>
            </div>
          </form>
        </div>
        <div
          className="modal fade"
          id="deleteModal"
          tabIndex="-1"
          aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="delete-form">
                  <h1 className="form-title text-center">
                    Are you sure you want to delete this product?
                  </h1>
                  <div className="form-row d-flex justify-content-end">
                    <button
                      className="btn btn-secondary mx-3"
                      onClick={(e) => this.closeModal(e)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => this.handleSubmit(e, "delete", id)}>
                      {deleting && (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status">
                          <span className="sr-only">deleting...</span>
                        </span>
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Form);
