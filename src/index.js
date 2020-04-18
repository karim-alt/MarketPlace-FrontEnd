import React from "react";
import ReactDOM from "react-dom";
import setAuthToken from "../src/util/setAuthToken";
const rootEl = document.getElementById("app-site");

// Create a reusable render method that we can call more than once
let render = () => {
  // Dynamically import our main App component, and render it
  const MainApp = require("./MainApp").default;
  ReactDOM.render(<MainApp />, rootEl);
};
setAuthToken(localStorage.jwtToken);
if (module.hot) {
  module.hot.accept("./MainApp", () => {
    const MainApp = require("./MainApp").default;
    render(<MainApp />, rootEl);
  });
}

render();
