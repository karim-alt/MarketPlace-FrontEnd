import React from "react";
import "./help.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SweetAlert from "react-bootstrap-sweetalert";
import Slide from "@material-ui/core/Slide";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import IntlMessages from "util/IntlMessages";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
class ViewMore extends React.Component {
  imgs = [];
  sellerInfo = null;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 0,
      qteValue: 1,
      success: false,
      user: jwt_decode(localStorage.jwtToken),
      price: this.props.product.prix,
    };
  }
  handleChange = (event) => {
    if (event.target.value !== "" && event.target.value >= 1) {
      this.setState({
        qteValue: event.target.value,
      });
    }
  };
  decrease = () => {
    if (this.state.qteValue > 1)
      this.setState({
        qteValue: this.state.qteValue - 1,
        price: this.state.price - this.props.product.prix,
      });
  };

  increase = () => {
    this.setState({
      qteValue: this.state.qteValue + 1,
      price: this.state.price + this.props.product.prix,
    });
  };
  handleClickOpen = () => {
    if (this.props.product.images.length !== 0) {
      for (let x = 0; x < this.props.product.images.length; x++) {
        let url = `http://localhost:5000/` + this.props.product.images[x];
        axios
          .get(url)
          .then((response) => {
            this.imgs.push(response.config.url);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    axios
      .get("http://localhost:5000/api/users/" + this.props.product.seller_id)
      .then((response) => {
        this.sellerInfo = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
      qteValue: 1,
      price: this.props.product.prix,
      value: 0,
    });
    this.imgs = [];
  };

  handlechangeRating = (event, newValue) => {
    this.setState({ value: newValue });
    const config = {
      headers: { "content-type": "application/json" },
    };
    const body = JSON.stringify({
      rating: newValue,
    });
    let url = "http://localhost:5000/api/agricultural_products/rating/";
    if (this.state.user.type !== "Client")
      url = "http://localhost:5000/api/fertilized_products/rating/";
    axios
      .post(url + this.props.product._id, body, config)
      .then((res) => {
        console.log(res.data);
        NotificationManager.info("Thank you for your feedback 😇");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendOrder = (e) => {
    e.preventDefault();
    const config = {
      headers: { "content-type": "application/json" },
    };
    let qte = "";
    if (this.state.user.type === "Client") {
      qte = this.props.product.quantity.slice(-2);
    }

    let server = "localhost:5000";
    this.socket = io.connect(server);
    this.socket.emit("sendOrder", {
      Products_Id: this.props.product._id,
      productName: this.props.product.name,
      buyerName: this.state.user.fullName,
      buyerPhone: this.state.user.phone,
      Seller_Id: this.props.product.seller_id,
      Buyer_Id: this.state.user.id,
      Qty: this.state.qteValue + qte,
      price: this.props.product.prix,
      Type: this.state.user.type,
    });
    if (this.state.user.type === "Farmer") {
      const bdy = JSON.stringify({
        fullName: this.state.user.fullName,
        productName: this.props.product.name,
        phone: this.state.user.phone,
        qte: this.state.qteValue + qte,
        price: this.props.product.prix,
        email: this.sellerInfo.email,
        message:
          "Hello, this costumer want to buy " +
          this.state.qteValue +
          qte +
          "bag(s) of " +
          this.props.product.name +
          ", Please contact him if you still have this quantity, thank you 😇.",
      });

      axios
        .post("http://localhost:5000/api/orders/send", bdy, config)
        .then((res) => console.log(res.data))
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({
      open: false,
      qteValue: 1,
      success: true,
      price: this.props.product.prix,
      value: 0,
    });
    this.imgs = [];
  };

  render() {
    let images = this.imgs.map((image, index) => {
      return (
        <Carousel.Item>
          <img key={index} className="d-block w-500" src={image} alt="" />
        </Carousel.Item>
      );
    });
    return (
      <div>
        <NotificationContainer />
        <center>
          <Button
            color="primary"
            variant="contained"
            className="jr-btn jr-btn-sm "
            onClick={this.handleClickOpen}
          >
            <i className="zmdi zmdi-shopping-cart" />
            <span>
              <IntlMessages id="eCommerce.buyNow" />
            </span>
          </Button>
        </center>

        <Dialog
          open={this.state.open}
          onClose={this.handleRequestClose}
          maxWidth="md"
          fullWidth={true}
          TransitionComponent={Slide}
        >
          <DialogContent>
            <DialogContentText>
              <div class="">
                <section class="panel">
                  <div class="panel-body">
                    <div class="row">
                      <div class="col-md-6 col-12">
                        <div class="pro-img-details">
                          <Carousel>{images}</Carousel>
                        </div>
                      </div>
                      <div class="col-md-6 col-12">
                        <h4 class="pro-d-title">
                          <a href="javascript:void(0)">
                            {this.props.product.name}
                          </a>
                        </h4>
                        <Box
                          component="fieldset"
                          mb={3}
                          borderColor="transparent"
                        >
                          <Typography component="legend">
                            <IntlMessages id="appModule.Feedback" />
                          </Typography>
                          <Rating
                            name="simple-controlled"
                            value={this.state.value}
                            onChange={this.handlechangeRating}
                          />
                        </Box>
                        <p>{this.props.product.description}</p>
                        <div class="product_meta">
                          <span class="posted_in">
                            <strong style={{ display: "inline-block" }}>
                              <IntlMessages id="appModule.Seller" />{" "}
                            </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.sellerInfo !== null &&
                                " : " + this.sellerInfo.fullName}
                            </a>
                          </span>
                          <span class="posted_in">
                            <strong style={{ display: "inline-block" }}>
                              <IntlMessages id="appModule.phone" />{" "}
                            </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.sellerInfo !== null &&
                                " : " + this.sellerInfo.phone}
                            </a>
                          </span>
                        </div>
                        <div class="product_meta">
                          {this.state.user.type !== "Client" ? (
                            <div>
                              <span class="posted_in">
                                <strong style={{ display: "inline-block" }}>
                                  <IntlMessages id="appModule.Bagweight" />{" "}
                                </strong>
                                <a rel="tag" href="javascript:void(0)">
                                  {" : " + this.props.product.bag_weight} kg
                                </a>
                              </span>
                              <span class="posted_in">
                                <strong style={{ display: "inline-block" }}>
                                  <IntlMessages id="appModule.Composition" />{" "}
                                </strong>
                                {this.props.product.composition !== null ? (
                                  <a rel="tag" href="javascript:void(0)">
                                    {" : " + this.props.product.composition}
                                  </a>
                                ) : (
                                  <a rel="tag" href="javascript:void(0)">
                                    {" : " +
                                      "N : " +
                                      this.props.product.N +
                                      "% , P : " +
                                      this.props.product.P +
                                      "% ,  K : " +
                                      this.props.product.K +
                                      "%"}
                                  </a>
                                )}
                              </span>
                            </div>
                          ) : null}

                          <span class="posted_in">
                            <div className="row">
                              <strong
                                style={{
                                  marginLeft: "16px",
                                  display: "inline-block",
                                }}
                              >
                                <IntlMessages id="appModule.Quantity" />
                              </strong>
                              <div
                                className="def-number-input number-input"
                                style={{ marginBottom: "0px" }}
                              >
                                <button
                                  onClick={this.decrease}
                                  className="minus"
                                ></button>
                                <input
                                  className="quantity"
                                  name="quantity"
                                  value={this.state.qteValue}
                                  onChange={this.handleChange}
                                  type="number"
                                />
                                <button
                                  onClick={this.increase}
                                  className="plus"
                                ></button>
                              </div>
                              <div className="col-md-5 col-5 ">
                                <strong style={{ display: "inline-block" }}>
                                  <IntlMessages id="appModule.Price" />
                                </strong>
                                <strong>
                                  <a rel="tag" href="javascript:void(0)">
                                    {" : " + this.state.price} Dh
                                    {this.state.user.type === "Client" &&
                                      (this.props.product.quantity.slice(-2) ===
                                      " q"
                                        ? "/q"
                                        : this.props.product.quantity.slice(
                                            -2
                                          ) === "kg"
                                        ? "/kg"
                                        : "/t")}
                                  </a>
                                </strong>
                              </div>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.sendOrder} color="secondary">
              <IntlMessages id="eCommerce.OrderNow" />
            </Button>
            <Button onClick={this.handleRequestClose} color="primary">
              <IntlMessages id="appModule.cancelBtnText" />
            </Button>
          </DialogActions>
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
    );
  }
}

export default ViewMore;
