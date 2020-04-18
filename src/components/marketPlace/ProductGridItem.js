import React from "react";
import StarRatingComponent from "react-star-rating-component";

import ViewMore from "../../app/routes/components/routes/dialogs/view_more2";
import ViewMoreP from "../../app/routes/components/routes/dialogs/view_more1";
import axios from "axios";
import jwt_decode from "jwt-decode";

class ProductGridItem extends React.Component {
  sellerInfo = null;
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      open: false,
      user: jwt_decode(localStorage.jwtToken),
      warning: false
    };
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.product.images.length !== 0) {
      let url = `http://localhost:5000/` + this.props.product.images[0];

      axios.get(url).then(response => {
        this.setState({ image: response.config.url });
      });
    }
  }
  componentDidMount() {
    if (this.props.product.images.length !== 0) {
      let url = `http://localhost:5000/` + this.props.product.images[0];

      axios.get(url).then(response => {
        this.setState({ image: response.config.url });
      });
    }
  }
  render() {
    return (
      <div className="col-xl-3 col-md-4 col-sm-6 col-12">
        <div className="card product-item">
          <div className="card-header border-0 p-0">
            <div className="card-image">
              <div className="grid-thumb-equal">
                <span className="grid-thumb-cover jr-link">
                  <img alt="Remy Sharp" src={this.state.image} />
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="product-details">
              <h3 className="card-title fw-regular">
                {this.props.product.name}

                <small className="text-grey text-darken-2">
                  {this.state.user.type === "Provider"
                    ? ", " + this.props.product.bag_weight + " Kg"
                    : ", " + this.props.product.quantity + " Kg"}
                </small>
              </h3>
              <div className="d-flex ">
                <h3 className="card-title">{this.props.product.prix} Dh</h3>
              </div>
              {this.state.user.type === "Farmer" ? (
                <div className="d-flex ">
                  {/* <h5 className="card-title">Composition :</h5> */}
                  <h5 className="text-success">
                    {"N : " +
                      this.props.product.N +
                      "% , P : " +
                      this.props.product.P +
                      "% ,  K : " +
                      this.props.product.K +
                      "%"}
                  </h5>
                </div>
              ) : null}
              <div className="d-flex flex-row">
                <StarRatingComponent
                  name=""
                  value={this.props.product.rating}
                  starCount={5}
                  editing={false}
                />
                <strong className="d-inline-block ml-2">
                  {this.props.product.rating}
                </strong>
              </div>
              <p>{this.props.product.description.slice(0, 70) + "..."}</p>
            </div>
            <div>
              {this.state.user.type !== "Provider" ? (
                <ViewMore
                  product={this.props.product}
                  seller={this.sellerInfo}
                />
              ) : (
                <center>
                  <ViewMoreP
                    product={this.props.product}
                    seller={this.sellerInfo}
                  />
                </center>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductGridItem;
