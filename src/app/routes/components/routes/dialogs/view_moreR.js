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
import Slide from "@material-ui/core/Slide";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import jwt_decode from "jwt-decode";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
class ViewMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 0,
      qteValue: 1,
      success: false,
      user: jwt_decode(localStorage.jwtToken),
      price: this.props.product.prix,
      imgs: [],
      sellerInfo: null,
    };
  }

  handleClickOpen = () => {
    if (this.props.product.images.length !== 0) {
      for (let x = 0; x < this.props.product.images.length; x++) {
        let url = `http://localhost:5000/` + this.props.product.images[x];
        axios
          .get(url)
          .then((response) => {
            var joined = this.state.imgs.concat(response.config.url);
            this.setState({ imgs: joined });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    // console.log("this.props.product.seller_id", this.props.product.seller_id);
    axios
      .get("http://localhost:5000/api/users/" + this.props.product.seller_id)
      .then((response) => {
        this.setState({ sellerInfo: response.data });
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
      imgs: [],
    });
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

  render() {
    let images = this.state.imgs.map((image, index) => {
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
          <Button color="primary" onClick={this.handleClickOpen}>
            View more
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
                          <Typography component="legend">Feedback</Typography>
                          <Rating
                            name="simple-controlled"
                            value={this.state.value}
                            onChange={this.handlechangeRating}
                          />
                        </Box>
                        <p>{this.props.product.description}</p>
                        <div class="product_meta">
                          <span class="posted_in">
                            <strong>Seller Name : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.state.sellerInfo !== null &&
                                this.state.sellerInfo.fullName}
                            </a>
                          </span>
                          <span class="posted_in">
                            <strong>Phone Number : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.state.sellerInfo !== null &&
                                this.state.sellerInfo.phone}
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
                                {this.props.product.composition !== null ? (
                                  <a rel="tag" href="javascript:void(0)">
                                    {this.props.product.composition}
                                  </a>
                                ) : (
                                  <a rel="tag" href="javascript:void(0)">
                                    {"N : " +
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
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="secondary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ViewMore;
