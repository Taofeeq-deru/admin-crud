import React, { Component } from "react";

class Product extends Component {
  state = {};
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  render() {
    const { product } = this.props;
    return (
      <>
        <div className="product">
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
          />
          <div className="details mt-3 px-4">
            <h2 className="title">{product.name}</h2>
            <p className="desc">{product.desc}</p>
            <div className="price-stock">
              <p className="price">₦{this.numberWithCommas(product.price)}</p>
              <p className="stock">{product.stock} left</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Product;
