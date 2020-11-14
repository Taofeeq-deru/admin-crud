import React, { Component } from "react";
import { Nav, Detail, AddProduct } from "../components";
import { Home, Login } from "./index";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class Layout extends Component {
  state = {};
  render() {
    return (
      <>
        <Router>
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/addnew" exact component={AddProduct} />
            <Route path="/products/:productID" exact component={Detail} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Layout;
