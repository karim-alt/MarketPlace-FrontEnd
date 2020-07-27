import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import ParticleComponent from "./ParticleComponent";
import background from "./background2.jpg";
import PropTypes from "prop-types";
// import axios from "axios";
// import SweetAlert from "react-bootstrap-sweetalert";
import { NavLink } from "react-router-dom";
import PhoneInput from "material-ui-phone-number";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import { hideMessage, showAuthLoader, userSignUp } from "actions/Auth";

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      fullName: "",
      email: null,
      password: "",
      confirmPassword: "",
      phone: "",
      country: "",
      type: "",
      code: "",
      open: false,
    };
  }

  static propTypes = {
    showAuthLoader: PropTypes.func.isRequired,
    userSignUp: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    if (this.props.showMessage || this.props.alertMessage !== "") {
      NotificationManager.error(this.props.alertMessage);
      setTimeout(() => {
        this.props.hideMessage();
      }, 3000);
    }
    if (this.props.user === true) {
      // console.log("update :" + this.props.authUser._id);
      this.props.history.push("/signin");
    }
  }

  handleSubmit = (event) => {
    let mailRegex = new RegExp(
      /^(?!.{254})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (
      this.state.fullName === "" ||
      this.state.email === null ||
      this.state.password.length <= 6 ||
      this.state.confirmPassword === "" ||
      this.state.phone === "" ||
      this.state.type === "" ||
      this.state.password !== this.state.confirmPassword ||
      this.state.password.length < 6 ||
      !mailRegex.test(this.state.email)
    ) {
      this.setState({ open: false });
    }
    event.preventDefault();
    const data = {
      fullName: this.state.fullName,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      phone: this.state.phone,
      country: this.state.country,
      type: this.state.type,
    };
    this.props.userSignUp(data);
  };
  handleChange = (name) => (e) => {
    this.setState({ [name]: e.target.value });
  };
  handleChangePhone = (value, country) => {
    this.setState({ phone: value, country: country.name });
    console.log("value", value);
    console.log("country", country.name);
  };
  // handleRegister = event => {
  //   event.preventDefault();
  //   if (this.state.code.length === 4) {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     };
  //     let code = this.state.code;
  //     // Request body
  //     const body = JSON.stringify({
  //       code
  //     });
  //     axios
  //       .post("http://localhost:5000/api/users/verify", body, config)
  //       .then((res, err) => {
  //         if (res.data.status === "failure") NotificationManager.error(res.msg);
  //         else {
  //           console.log(res);
  //           console.log(res.data);
  //           NotificationManager.success(res.msg);
  //           this.setState({ open: false });
  //           this.props.history.push("/signin");
  //         }
  //       })
  //       .catch(error => console.log(error));
  //   }
  // };

  render() {
    const {
      fullName,
      email,
      password,
      phone,
      confirmPassword,
      type,
    } = this.state;

    const { loader } = this.props;
    return (
      <div
        //   style={{
        //     position: "absolute",
        //     top: 0,
        //     left: 0,
        //     width: "100%",
        //     height: "auto",
        //   }}
        className="bg-image"
      >
        {/* // <ParticleComponent /> */}
        <div
          className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3"
          style={{
            // backgroundImage: `url(${background})`,
            position: "absolute",
            top: 0,
            left: 350,
            width: "auto",
            height: "100%",
          }}
        >
          <div className="app-login-main-content" style={{ opacity: 0.9 }}>
            <div
              className="app-logo-content d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#87ed82" }}
            >
              <Link className="logo-lg" to="/" title="AgriEdge">
                <img
                  src={require("assets/images/logo.png")}
                  alt="AgriEdge"
                  title="AgriEdge"
                />
              </Link>
            </div>

            <div className="app-login-content">
              <div className="app-login-header">
                <h1>
                  <IntlMessages id="appModule.signUp" />
                </h1>
              </div>

              <div className="mb-">
                <h2>
                  <IntlMessages id="appModule.createAccount" />
                </h2>
              </div>

              <div className="app-login-form">
                <form onSubmit={this.handleSubmit}>
                  <TextField
                    type="text"
                    label={<IntlMessages id="appModule.name" />}
                    onChange={(event) =>
                      this.setState({ fullName: event.target.value })
                    }
                    fullWidth
                    defaultValue={fullName}
                    margin="normal"
                    className="mt-0 mb-2"
                    id="fullName"
                  />
                  <PhoneInput
                    defaultCountry="ma"
                    value={phone}
                    onChange={this.handleChangePhone}
                    style={{ width: "100%", marginTop: "10px" }}
                    // onClick={this.onClick}
                  />
                  <TextField
                    type="email"
                    onChange={(event) =>
                      this.setState({ email: event.target.value })
                    }
                    label={<IntlMessages id="signUp.Email" />}
                    // {<IntlMessages id="appModule.email" />}
                    fullWidth
                    defaultValue={email}
                    margin="normal"
                    className="mt-0 mb-2"
                    id="email"
                  />
                  <TextField
                    type="password"
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                    label={<IntlMessages id="signUp.Password" />}
                    // {<IntlMessages id="appModule.password" />}
                    fullWidth
                    defaultValue={password}
                    margin="normal"
                    className="mt-0 mb-2"
                  />
                  <TextField
                    type="password"
                    onChange={(event) =>
                      this.setState({ confirmPassword: event.target.value })
                    }
                    label={<IntlMessages id="signUp.ConfirmPassword" />}
                    // label={<IntlMessages id="appModule.password" />}
                    fullWidth
                    defaultValue={confirmPassword}
                    margin="normal"
                    className="mt-0 mb-2"
                  />
                  <div className="mt-0 mb-2">
                    <FormControl className="w-100 mb-2">
                      <InputLabel htmlFor="Type">
                        <IntlMessages id="signUp.Type" />
                      </InputLabel>
                      <Select
                        value={type}
                        onChange={this.handleChange("type")}
                        input={<Input id="type" />}
                      >
                        <MenuItem value="Farmer">
                          <IntlMessages id="signUp.Farmer" />
                        </MenuItem>
                        <MenuItem value="Provider">
                          <IntlMessages id="signUp.Provider" />
                        </MenuItem>
                        <MenuItem value="Client">
                          <IntlMessages id="signUp.Client" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        value={this.state.open}
                      >
                        <IntlMessages id="appModule.regsiter" />
                      </Button>
                      <Dialog
                        open={this.state.open}
                        onClose={(event) => this.setState({ open: false })}
                        value={this.state.open}
                        aria-labelledby="form-dialog-title"
                      >
                        <DialogTitle id="form-dialog-title">
                          Verification code
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please enter your verifcation code
                          </DialogContentText>
                          <TextField
                            autoFocus
                            onChange={(event) =>
                              this.setState({ code: event.target.value })
                            }
                            margin="dense"
                            id="nacodeme"
                            label="verification code"
                            type="text"
                            value={this.state.code}
                            placeholder="####"
                            fullWidth
                          />
                          <input type="hidden" name="action" />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={(event) => this.setState({ open: false })}
                            value={this.state.open}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={this.handleRegister}
                            value={this.state.open}
                            color="primary"
                          >
                            <IntlMessages id="appModule.regsiter" />
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    <NavLink to="/signin">
                      <IntlMessages id="signUp.alreadyMember" />
                    </NavLink>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {loader && (
            <div className="loader-view">
              <CircularProgress />
            </div>
          )}
          <NotificationContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, user } = auth;
  return { loader, alertMessage, showMessage, user };
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader,
})(SignUp);
