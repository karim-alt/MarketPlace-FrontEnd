import React from "react";
import "./help.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import StarRatingComponent from "react-star-rating-component";
import Slide from "@material-ui/core/Slide";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
class ViewMore extends React.Component {
  imgs = [];
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 3,
      qteValue: 1,
      price: this.props.product.prix,
    };
  }
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
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false, qteValue: 1 });
    this.imgs = [];
  };
  average = (array) => array.reduce((a, b) => a + b) / array.length;
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
        <Button color="primary" onClick={this.handleClickOpen}>
          View more
        </Button>
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

                        <p>{this.props.product.description}</p>

                        <div class="product_meta1">
                          <span class="posted_in">
                            <strong>Countries : </strong>
                            <a rel="tag" href="javascript:void(0)">
                              {this.props.product.country.map((c, i) => {
                                return c + ", ";
                              })}
                            </a>
                          </span>

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
                          <span class="posted_in">
                            <strong>Quantity :</strong>

                            <a rel="tag" href="javascript:void(0)">
                              {this.props.product.quantity + " kg"}
                            </a>
                          </span>
                          <span class="posted_in">
                            <strong>Price :</strong>

                            <a rel="tag" href="javascript:void(0)">
                              {this.state.price} Dh
                            </a>
                          </span>
                        </div>
                        <div className="d-flex flex-row">
                          <span class="tagged_as">
                            <strong>Rating : </strong>
                          </span>
                          <StarRatingComponent
                            name=""
                            value={
                              this.props.product.rating.length !== 0
                                ? this.average(
                                    this.props.product.rating
                                  ).toFixed(1)
                                : 0
                            }
                            starCount={5}
                            editing={false}
                          />
                          <strong className="d-inline-block ml-2">
                            {this.props.product.rating.length !== 0
                              ? this.average(this.props.product.rating).toFixed(
                                  1
                                )
                              : 0}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ViewMore;
