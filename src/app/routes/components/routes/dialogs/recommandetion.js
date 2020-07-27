import React, { Component } from "react";
import { GoogleMap, withGoogleMap, OverlayView } from "react-google-maps";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import ProductGridItem from "components/marketPlace/ProductGridItemR";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import "./dialog.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import IntlMessages from "util/IntlMessages";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
// const google = window.google;
const STYLES = {
  overlayView: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "15px ",
    padding: 15,
    margin: "auto",
    marginTop: "120px",
    // marginRigt: "100px",
    width: "60%",
    position: "relative",
    zIndex: 100,
    backgroundRepeat: "no-repeat",
  },
};

// let count = 0;
class Recommandations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      N: null,
      P: null,
      K: null,
      totalPrice: null,
      products: null,
      sellerInfo: null,
      success: false,
      user: jwt_decode(localStorage.jwtToken),
    };
  }
  handleClickOpen = (e) => {
    e.preventDefault();
    this.setState({ open: true });
    // console.log("this.state.N", this.state.N);
    const data = {
      N: this.state.N,
      P: this.state.P,
      K: this.state.K,
    };
    //the optimisation results from the backend
    let recommandation = axios
      .post(
        "http://localhost:5000/api/recommandation/" + this.state.user.country,
        data
      )
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    recommandation.then((r) => {
      // console.log("this.recommandation", r);
      let c = 0;
      let arr = [];
      let values = [];
      for (var i in r) {
        if (i !== "feasible" && i !== "result" && i !== "0" && i !== "-0") {
          arr[c] = i;
          values[c] = r[i];
          c++;
        }
      }
      //get the ids of products in order to show them in the user interface
      let data2 = { ids: arr };
      // console.log("values", values);
      axios
        .post("http://localhost:5000/api/recommandation", data2)
        .then((response) => {
          let i = 0;
          //foreach product assign a number witch design the qty of bags that the user shoold buy
          var result = response.data.map(function (product) {
            var o = Object.assign({}, product);
            if (parseInt(values[i]) === 0) o.number = 1;
            else o.number = parseInt(values[i]);
            i++;
            //get user mail foreach product
            let user = axios
              .get("http://localhost:5000/api/users/" + product.seller_id)
              .then((response) => {
                return response.data;
              })
              .catch(function (error) {
                console.log(error);
              });
            user.then((u) => {
              o.email = u.email;
            });
            return o;
          });
          //store the result in products in order to show them letter
          this.setState({ products: result });
          //get totale price
          let sum = 0;
          result.map((product) => {
            sum += product.prix * product.number;
          });
          this.setState({ totalPrice: sum });
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };
  handleRequestClose = () => {
    this.setState({
      open: false,
      N: null,
      P: null,
      K: null,
    });
  };
  handleSave = (e) => {
    e.preventDefault();
    const config = {
      headers: { "content-type": "application/json" },
    };
    //send notification and store order in database
    let server = "localhost:5000";
    this.socket = io.connect(server);
    this.state.products.map((product) => {
      this.socket.emit("sendOrder", {
        Products_Id: product._id,
        productName: product.name,
        buyerName: this.state.user.fullName,
        buyerPhone: this.state.user.phone,
        Seller_Id: product.seller_id,
        Buyer_Id: this.state.user.id,
        Qty: product.number,
        price: product.prix,
        Type: this.state.user.type,
      });
      //send email message to the seller
      if (this.state.user.type === "Farmer") {
        const bdy = JSON.stringify({
          fullName: this.state.user.fullName,
          productName: product.name,
          phone: this.state.user.phone,
          qte: product.number,
          price: product.prix,
          email: product.email,
          message:
            "Hello, this costumer want to buy " +
            product.number +
            " bag(s) of " +
            product.name +
            ", Please contact him if you still have this quantity, thank you 😇.",
        });
        axios
          .post("http://localhost:5000/api/orders/send", bdy, config)
          .then((res) => console.log(res.data))
          .catch((error) => {
            console.log(error);
          });
      }
    });
    this.setState({
      open: false,
      success: true,
      imgs: [],
      N: "",
      P: "",
      K: "",
    });
  };
  render() {
    return (
      <div
      // style={{
      //   zIndex: 0,
      //   position: "absolute",
      //   height: "100%",
      //   width: "100%",
      //   backgroundRepeat: "no-repeat",
      //   top: 0,
      //   left: 0,
      // }}
      >
        {/* <GoogleMap
          defaultZoom={13}
          defaultCenter={new google.maps.LatLng(32.2307977, -7.9817398)}
        > */}
        <div style={STYLES.overlayView}>
          <center>
            <h1>
              {" "}
              <IntlMessages id="appModule.Recommandation" />
            </h1>
          </center>

          <div className="row justify-content-md-center">
            <div className="col-md-4 col-12">
              <div className="form-group">
                <label htmlFor="P (%)">N (kg) </label>
                <input
                  className="form-control form-control-lg"
                  id="N"
                  type="Number"
                  placeholder="N.."
                  defaultValue={this.state.N}
                  onChange={(event) => this.setState({ N: event.target.value })}
                />
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="form-group">
                <label htmlFor="P (%)">P (kg) </label>
                <input
                  className="form-control form-control-lg"
                  id="P"
                  type="Number"
                  placeholder="P.."
                  defaultValue={this.state.P}
                  onChange={(event) => this.setState({ P: event.target.value })}
                />
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="form-group">
                <label htmlFor="K (%)">K (kg) </label>
                <input
                  className="form-control form-control-lg"
                  id="K"
                  type="Number"
                  placeholder="K.."
                  defaultValue={this.state.K}
                  onChange={(event) => this.setState({ K: event.target.value })}
                />
              </div>
            </div>
            <div>
              <center>
                <Button
                  color="primary"
                  variant="contained"
                  className="jr-btn jr-btn-sm "
                  style={{ backgroundColor: "#57B45A" }}
                  onClick={this.handleClickOpen}
                >
                  {/* <IntlMessages id="eCommerce.addToCart" /> */}
                  <i className="zmdi zmdi-shopping-cart-plus" />
                  <span>
                    {" "}
                    <IntlMessages id="appModule.ShowResults" />
                  </span>
                </Button>
              </center>
              <Dialog
                fullScreen
                open={this.state.open}
                onClose={this.handleRequestClose}
                TransitionComponent={Transition}
              >
                <AppBar
                  className="position-relative"
                  style={{ backgroundColor: "#57B45A" }}
                >
                  <Toolbar>
                    <IconButton
                      onClick={this.handleRequestClose}
                      aria-label="Close"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      variant="title"
                      color="inherit"
                      style={{
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      <IntlMessages id="appModule.Recommandation" />
                    </Typography>
                    <Button color="inherit" onClick={this.handleSave}>
                      <IntlMessages id="eCommerce.OrderNow" />
                    </Button>
                  </Toolbar>
                </AppBar>

                <div className="app-wrapper">
                  <div className="dashboard animated slideInUpTiny animation-duration-3">
                    <div className="row  justify-content-md-center animated slideInUpTiny animation-duration-3">
                      <div className="col-md-12">
                        <center>
                          <h3>
                            <IntlMessages id="appModule.TotPrice" />
                            <strong style={{ color: "red" }}>
                              {" : " + this.state.totalPrice + " Dh"}
                            </strong>
                          </h3>
                        </center>
                      </div>

                      {this.state.products
                        ? this.state.products.map((product, index) => {
                            return (
                              <ProductGridItem key={index} product={product} />
                            );
                          })
                        : null}
                    </div>
                  </div>
                </div>
              </Dialog>
              <SweetAlert
                show={this.state.success}
                success
                title={<IntlMessages id="appModule.OrderSuccessful" />}
                onConfirm={(event) => this.setState({ success: false })}
              >
                <IntlMessages id="appModule.OrderSuccessfultxt" />
              </SweetAlert>
            </div>
          </div>
        </div>
        {/* <DrawingManager
            // defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
            defaultOptions={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE,
                ],
              },
              circleOptions: {
                fillColor: "#ff0000",
                fillOpacity: 0.2,
                strokeWeight: 3,
                clickable: false,
                editable: true,
                zIndex: 1,
              },
              rectangleOptions: {
                fillColor: "#ff0000",
                fillOpacity: 0.2,
                strokeWeight: 3,
                clickable: false,
                editable: true,
                zIndex: 1,
              },
            }}
          />
        </GoogleMap> */}
      </div>
    );
  }
}

export default Recommandations;
