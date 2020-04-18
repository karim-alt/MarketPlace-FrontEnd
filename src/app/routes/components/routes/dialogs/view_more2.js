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
class ViewMore extends React.Component {
  imgs = [];
  sellerInfo = null;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 3,
      qteValue: 1,
      success: false,
      user: jwt_decode(localStorage.jwtToken),
      price: this.props.product.prix
    };
  }

  decrease = () => {
    if (this.state.qteValue > 1)
      this.setState({
        qteValue: this.state.qteValue - 1,
        price: this.state.price - this.props.product.prix
      });
  };

  increase = () => {
    this.setState({
      qteValue: this.state.qteValue + 1,
      price: this.state.price + this.props.product.prix
    });
  };
  handleClickOpen = () => {
    if (this.props.product.images.length !== 0) {
      for (let x = 0; x < this.props.product.images.length; x++) {
        let url = `http://localhost:5000/` + this.props.product.images[x];
        axios
          .get(url)
          .then(response => {
            this.imgs.push(response.config.url);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
    axios
      .get("http://localhost:5000/api/users/" + this.props.product.seller_id)
      .then(response => {
        this.sellerInfo = response.data;
      })
      .catch(function(error) {
        console.log(error);
      });

    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false, qteValue: 1, price: this.props.product.prix });
    this.imgs = [];
  };
  sendOrder = e => {
    e.preventDefault();
    const config = {
      headers: { "content-type": "application/json" }
    };
    const body = JSON.stringify({
      Products_Id: this.props.product._id,
      productName: this.props.product.name,
      buyerName: this.state.user.fullName,
      buyerPhone: this.state.user.phone,
      Seller_Id: this.props.product.seller_id,
      Buyer_Id: this.state.user.id,
      Qty: this.state.qteValue,
      price: this.props.product.prix,
      Type: this.state.user.type
    });

    axios
      .post("http://localhost:5000/api/orders/add", body, config)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log(error);
      });
    this.setState({
      open: false,
      qteValue: 1,
      success: true,
      price: this.props.product.prix
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
        <center>
          <Button
            color="primary"
            variant="contained"
            className="jr-btn jr-btn-sm "
            onClick={this.handleClickOpen}
          >
            <i className="zmdi zmdi-shopping-cart" />
            <span>
              {/* <IntlMessages id="eCommerce.buyNow" /> */}
              Buy
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
                          <Typography component="legend">Review</Typography>
                          <Rating
                            name="simple-controlled"
                            value={this.state.value}
                            onChange={(event, newValue) => {
                              this.setState({ value: newValue });
                            }}
                          />
                        </Box>
                        <p>{this.props.product.description}</p>
                        <div class="product_meta">
                          <span class="posted_in">
                            <strong>Seller Name : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.sellerInfo !== null &&
                                this.sellerInfo.fullName}
                            </a>
                          </span>
                          <span class="posted_in">
                            <strong>Phone Number : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.sellerInfo !== null &&
                                this.sellerInfo.phone}
                            </a>
                          </span>
                          <span class="posted_in">
                            <strong>Country : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.props.product.country}
                            </a>
                          </span>
                        </div>
                        <div class="product_meta">
                          {this.state.user.type !== "Client" ? (
                            <div>
                              <span class="posted_in">
                                <strong>Bag weight : </strong>
                                <a rel="tag" href="javascript:void(0)">
                                  {this.props.product.bag_weight} kg
                                </a>
                              </span>
                              <span class="posted_in">
                                <strong>Composition : </strong>
                                <a rel="tag" href="javascript:void(0)">
                                  {"N : " +
                                    this.props.product.N +
                                    "% , P : " +
                                    this.props.product.P +
                                    "% ,  K : " +
                                    this.props.product.K +
                                    "%"}
                                </a>
                              </span>
                            </div>
                          ) : null}

                          <span class="posted_in">
                            <div className="row">
                              <strong style={{ marginLeft: "16px" }}>
                                Quantity :
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
                                  type="number"
                                />
                                <button
                                  onClick={this.increase}
                                  className="plus"
                                ></button>
                              </div>
                              <div className="col-md-5 col-5 ">
                                <strong>Price :</strong>
                                <strong>
                                  <a rel="tag" href="javascript:void(0)">
                                    {this.state.price} Dh
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
              Order Now
            </Button>
            <Button onClick={this.handleRequestClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <SweetAlert
          show={this.state.success}
          success
          title="Order successful"
          onConfirm={event => this.setState({ success: false })}
        >
          A text message have been sent to the seller!
        </SweetAlert>
      </div>
    );
  }
}

export default ViewMore;
