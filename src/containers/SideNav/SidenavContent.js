import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import IntlMessages from "util/IntlMessages";
import CustomScrollbars from "util/CustomScrollbars";

class SidenavContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: jwt_decode(localStorage.jwtToken)
    };
  }
  componentDidMount() {
    const { history } = this.props;
    const that = this;
    const pathname = `${history.location.pathname}`; // get current path

    const menuLi = document.getElementsByClassName("menu");
    for (let i = 0; i < menuLi.length; i++) {
      menuLi[i].onclick = function(event) {
        for (let j = 0; j < menuLi.length; j++) {
          const parentLi = that.closest(this, "li");
          if (
            menuLi[j] !== this &&
            (parentLi === null || !parentLi.classList.contains("open"))
          ) {
            menuLi[j].classList.remove("open");
          }
        }
        this.classList.toggle("open");
      };
    }

    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("open");
      } else {
        this.closest(activeLi, "li").classList.add("open");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;
    const pathname = `${history.location.pathname}`; // get current path

    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("open");
      } else {
        this.closest(activeLi, "li").classList.add("open");
      }
    } catch (error) {}
  }

  closest(el, selector) {
    try {
      let matchesFn;
      // find vendor prefix
      [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector"
      ].some(function(fn) {
        if (typeof document.body[fn] == "function") {
          matchesFn = fn;
          return true;
        }
        return false;
      });

      let parent;

      // traverse parents
      while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
          return parent;
        }
        el = parent;
      }
    } catch (e) {}

    return null;
  }

  render() {
    return (
      <CustomScrollbars className=" scrollbar">
        <ul className="nav-menu">
          <li className="nav-header">
            <IntlMessages id="sidebar.main" />
          </li>
          <li className="menu no-arrow">
            <NavLink to="/app/dashboard">
              <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
              <span className="nav-text">
                <IntlMessages id="sidebar.dashboard" />
              </span>
            </NavLink>
          </li>

          {this.state.user.type === "Client" ? (
            <ul className="nav-menu">
              <li className="menu no-arrow">
                <NavLink to="/app/marketPlace">
                  <i className="zmdi zmdi-shopping-cart zmdi-hc-fw" />
                  <span className="nav-text text-transform-none">
                    MarketPlace
                    {/* <IntlMessages id="sidebar.eCommerce" /> */}
                  </span>
                </NavLink>
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/myOrders">
                  <i className="zmdi  zmdi-case-check zmdi-hc-fw" />
                  <span className="nav-text text-transform-none">
                    My card
                    {/* <IntlMessages id="sidebar.eCommerce" /> */}
                  </span>
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="nav-menu">
              <li className="menu no-arrow">
                <NavLink to="/app/map">
                  <i className="zmdi zmdi-google-maps zmdi-hc-fw" />
                  <span className="nav-text">Map analysis</span>
                </NavLink>
              </li>
              <li className="menu no-arrow">
                <NavLink to="/app/marketPlace">
                  <i className="zmdi zmdi-shopping-cart zmdi-hc-fw" />
                  <span className="nav-text text-transform-none">
                    MarketPlace
                    {/* <IntlMessages id="sidebar.eCommerce" /> */}
                  </span>
                </NavLink>
              </li>

              <li className="menu no-arrow">
                <NavLink to="/app/orders">
                  <i className="zmdi zmdi-view-web zmdi-hc-fw" />
                  <span className="nav-text text-transform-none">
                    Orders
                    {/* <IntlMessages id="sidebar.eCommerce" /> */}
                  </span>
                </NavLink>
              </li>

              {this.state.user.type === "Farmer" ? (
                <li className="menu no-arrow">
                  <NavLink to="/app/myOrders">
                    <i className="zmdi  zmdi-case-check zmdi-hc-fw" />
                    <span className="nav-text text-transform-none">
                      My Card
                      {/* <IntlMessages id="sidebar.eCommerce" /> */}
                    </span>
                  </NavLink>
                </li>
              ) : null}
              <li className="menu no-arrow">
                <NavLink to="/app/myStore">
                  <i className="zmdi zmdi-storage zmdi-hc-fw" />
                  <span className="nav-text text-transform-none">
                    My store
                    {/* <IntlMessages id="sidebar.eCommerce" /> */}
                  </span>
                </NavLink>
              </li>
            </ul>
          )}
        </ul>
      </CustomScrollbars>
    );
  }
}

export default withRouter(SidenavContent);
