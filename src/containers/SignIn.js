import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ParticleComponent from "./ParticleComponent";
import { NavLink } from "react-router-dom";
import LanguageSwitcher from "components/LanguageSwitcher/index";
import IconButton from "@material-ui/core/IconButton";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import { switchLanguage } from "actions/Setting";
import { hideMessage, showAuthLoader, userSignIn } from "actions/Auth";
import "./Sign.css";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      mail: "",
      passwd: "",

      anchorEl: undefined,
      langSwitcher: false
    };
  }

  onLangSwitcherSelect = event => {
    this.setState({
      langSwitcher: !this.state.langSwitcher,
      anchorEl: event.currentTarget
    });
  };
  handleRequestClose = () => {
    this.setState({
      langSwitcher: false
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    const email = this.state.mail;
    const password = this.state.passwrd;

    this.props.showAuthLoader();
    console.log("test user : " + this.props.userSignIn({ email, password }));
  };

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser != null) {
      this.props.history.push("/");
    }
  }

  render() {
    const { mail, passwrd } = this.state;
    const { showMessage, loader, alertMessage, locale } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "auto"
        }}
      >
        <ParticleComponent />
        <div
          className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3"
          style={{
            position: "absolute",
            top: 0,
            left: 335,
            width: "auto",
            height: "100%"
          }}
        >
          <div className="app-login-main-content" style={{ opacity: 0.9 }}>
            <div
              className="app-logo-content d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#87ed82" }}
            >
              <Link className="logo-lg" to="/" title="Agriedge">
                <img
                  src={require("assets/images/logo.png")}
                  alt="AgriEdge"
                  title="AgriEdge"
                />
              </Link>
            </div>

            <div className="app-login-content">
              <div className="app-login-header mb-4">
                <h1>
                  {/* <IntlMessages id="appModule.email" /> */}
                  Sign in
                </h1>
              </div>

              <div className="app-login-form">
                <form>
                  <fieldset>
                    <Dropdown
                      className="quick-menu"
                      isOpen={this.state.langSwitcher}
                      toggle={this.onLangSwitcherSelect.bind(this)}
                    >
                      <label>Choose your language : </label>
                      <DropdownToggle
                        className="d-inline-block"
                        tag="span"
                        data-toggle="dropdown"
                      >
                        <IconButton className="icon-btn">
                          <i className={`flag ${locale.icon}`} />
                        </IconButton>
                      </DropdownToggle>

                      <DropdownMenu right className="w-50">
                        <LanguageSwitcher
                          switchLanguage={this.props.switchLanguage}
                          handleRequestClose={this.handleRequestClose}
                        />
                      </DropdownMenu>
                    </Dropdown>
                    <TextField
                      label={<IntlMessages id="appModule.email" />}
                      fullWidth
                      onChange={event =>
                        this.setState({ mail: event.target.value })
                      }
                      defaultValue={mail}
                      margin="normal"
                      className="mt-1 my-sm-3"
                    />
                    <TextField
                      type="password"
                      label={<IntlMessages id="appModule.password" />}
                      fullWidth
                      onChange={event =>
                        this.setState({ passwrd: event.target.value })
                      }
                      defaultValue={passwrd}
                      margin="normal"
                      className="mt-1 my-sm-3"
                    />

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                      <Button
                        onClick={this.handleSubmit}
                        variant="contained"
                        color="primary"
                      >
                        <IntlMessages id="appModule.signIn" />
                      </Button>

                      <NavLink to="/signup">
                        <IntlMessages id="signIn.signUp" />
                      </NavLink>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
          {loader && (
            <div className="loader-view">
              <CircularProgress />
            </div>
          )}
          {showMessage && NotificationManager.error(alertMessage)}
          <NotificationContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, settings }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  const { locale } = settings;
  return { loader, alertMessage, showMessage, authUser, locale };
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader,
  switchLanguage
})(SignIn);
