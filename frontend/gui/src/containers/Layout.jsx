import React, { Component } from "react";
import { Nav, Detail } from "../components";
import { Home } from "./index";
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
            <Route path="/products/:productID" exact component={Detail} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default Layout;
