import React, { Component } from "react";
import { Nav, Detail } from "../components";
import { Home, AddProduct, Login, Signup } from "./index";
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
            <Route path="/signup" exact component={Signup} />
            <Route path="/addnew" exact component={AddProduct} />
            <Route path="/products/:productID" exact component={Detail} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Layout;
