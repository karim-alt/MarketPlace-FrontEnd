import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import configureStore, { history } from "./store";
import App from "./containers/App";
import setAuthToken from "../src/util/setAuthToken";
import { userSignInSuccess, logoutUser } from "../src/actions/Auth";
export const store = configureStore();

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // console.log("token", token);
  console.log("decoded", decoded);
  // Set user and isAuthenticated
  store.dispatch(userSignInSuccess(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./signin";
  }
}

const MainApp = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default MainApp;
