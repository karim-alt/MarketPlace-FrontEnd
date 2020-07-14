import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import "assets/vendors/style";
import defaultTheme from "./themes/defaultTheme";
import AppLocale from "../lngProvider";
import MainApp from "app/index";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { setInitUrl } from "../actions/Auth";
import RTL from "util/RTL";
import asyncComponent from "util/asyncComponent";
import io from "socket.io-client";
import jwt_decode from "jwt-decode";
// import img from "./background2.jpg";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
const RestrictedRoute = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.jwtToken ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class App extends Component {
  componentWillMount() {
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    if (this.props.initURL === "") {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
  }

  componentDidMount() {
    if (localStorage.jwtToken !== null) {
      let server = "localhost:5000";
      this.socket = io.connect(server);
      this.socket.on("approvedNotif", (msg) => {
        if (jwt_decode(localStorage.jwtToken).id === msg.Buyer_Id) {
          // let counter = parseInt(parseInt(localStorage.counter) + 1);
          // localStorage.setItem("counter", counter);
          if (jwt_decode(localStorage.jwtToken).type === "Client") {
            NotificationManager.info(
              `Hi ` +
                jwt_decode(localStorage.jwtToken).fullName +
                ` 😇! Your order
            ` +
                msg.Qty +
                ` of ` +
                msg.productName +
                `
          , have been approved.`,
              "Order accepted",
              7000
            );
          }
          if (jwt_decode(localStorage.jwtToken).type === "Farmer") {
            NotificationManager.info(
              `Hi ` +
                jwt_decode(localStorage.jwtToken).fullName +
                ` 😇! Your order
            ` +
                msg.Qty +
                ` bag(s) of ` +
                msg.productName +
                `
          , have been approved.`,
              "Order accepted",
              7000
            );
          }
        }
      });
      this.socket.on("sendResponse", (msg) => {
        if (jwt_decode(localStorage.jwtToken).id === msg.Seller_Id) {
          // let counter = parseInt(parseInt(localStorage.counter) + 1);
          // localStorage.setItem("counter", counter);
          if (jwt_decode(localStorage.jwtToken).type === "Farmer") {
            NotificationManager.info(
              `Hi ` +
                jwt_decode(localStorage.jwtToken).fullName +
                ` 😇, I want to buy 
              ` +
                msg.Qty +
                ` of ` +
                msg.productName,

              "New Order ",
              7000
            );
          }
          if (jwt_decode(localStorage.jwtToken).type === "Provider") {
            NotificationManager.info(
              `Hi ` +
                jwt_decode(localStorage.jwtToken).fullName +
                ` 😇, I want to buy 
            ` +
                msg.Qty +
                `bag(s) of ` +
                msg.productName,
              "New Order ",
              7000
            );
          }
        }
      });
    }
  }

  render() {
    const {
      match,
      location,
      locale,
      authUser,
      initURL,
      isDirectionRTL,
    } = this.props;
    if (location.pathname === "/") {
      if (localStorage.jwtToken === null) {
        return <Redirect to={"/signin"} />;
      } else if (initURL === "" || initURL === "/" || initURL === "/signin") {
        return <Redirect to={"/app/dashboard"} />;
      } else {
        return <Redirect to={initURL} />;
      }
    }
    const applyTheme = createMuiTheme(defaultTheme);
    if (isDirectionRTL) {
      applyTheme.direction = "rtl";
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
      applyTheme.direction = "ltr";
    }

    const currentAppLocale = AppLocale[locale.locale];
    return (
      <MuiThemeProvider theme={applyTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <RTL>
              <div
                className="app-main"
                // style={{ backgroundImage: `url(${img})` }}
                // style={{
                //   background: `linear-gradient(217deg,#95f99a, rgba(255,0,0,0) 70.71%)
                // `,
                // }}
              >
                <Switch>
                  <RestrictedRoute
                    path={`${match.url}app`}
                    authUser={authUser}
                    component={MainApp}
                  />
                  <Route path="/signin" component={SignIn} />
                  <Route path="/signup" component={SignUp} />
                  <Route
                    component={asyncComponent(() =>
                      import("components/Error404")
                    )}
                  />
                </Switch>
                <div>
                  <NotificationContainer />
                </div>
              </div>
            </RTL>
          </IntlProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { sideNavColor, locale, isDirectionRTL } = settings;
  const { authUser, initURL } = auth;
  return { sideNavColor, locale, isDirectionRTL, authUser, initURL };
};

export default connect(mapStateToProps, { setInitUrl })(App);
