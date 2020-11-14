import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class ProductList extends Component {
  state = {};

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  render() {
    const { products } = this.props;
    return (
      <>
        {products.map((product) => (
          <Link
            to={`/products/${product.id}`}
            className="product"
            key={product.id}>
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="w-100"
            />
            <div className="details mt-3 mt-md-0 px-4">
              <h2 className="title">{product.name}</h2>
              <p className="desc">{product.desc}</p>
              <div className="price-stock">
                <p className="price">₦{this.numberWithCommas(product.price)}</p>
                <p className="stock">{product.stock} left</p>
              </div>
            </div>
          </Link>
        ))}
      </>
    );
  }
}

export default withRouter(ProductList);
