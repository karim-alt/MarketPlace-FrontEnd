import React from "react";
import Button from "@material-ui/core/Button";
import StarRatingComponent from "react-star-rating-component";
import UpdateProduct from "../../app/routes/components/routes/dialogs/updateProductDialog";
import UpdateFProduct from "../../app/routes/components/routes/dialogs/updateFProductDialog";
import ViewMore from "../../app/routes/components/routes/dialogs/view_more";
import ViewMoreF from "../../app/routes/components/routes/dialogs/view_more1";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import jwt_decode from "jwt-decode";

class ProductListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      open: false,
      warning: false,
      user: jwt_decode(localStorage.jwtToken)
    };
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.product.images.length !== 0) {
      let url = `http://localhost:5000/` + this.props.product.images[0];

      axios.get(url).then(response => {
        // console.log("response", response);
        this.setState({ image: response.config.url });
      });
    }
  }
  componentDidMount() {
    if (this.props.product.images.length !== 0) {
      let url = `http://localhost:5000/` + this.props.product.images[0];

      axios.get(url).then(response => {
        // console.log("response", response);
        this.setState({ image: response.config.url });
      });
    }
  }

  deleteProduct = () => {
    let url = "http://localhost:5000/api/fertilized_products/delete/";
    if (this.state.user.type === "Farmer")
      url = "http://localhost:5000/api/agricultural_products/delete/";
    axios
      .delete(url + this.props.product._id)
      .then(response => {
        this.setState({
          warning: false
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="card product-item-vertical hoverable animation flipInX">
        <div className="row d-flex align-items-sm-center">
          <div className="col-xl-3 col-lg-4 col-md-3 col-12">
            <div className="card-header border-0 p-0">
              <div className="card-image">
                <div className="grid-thumb-equal">
                  <span className="grid-thumb-cover jr-link">
                    <img
                      className="img-fluid"
                      src={this.state.image}
                      alt="..."
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-5 col-md-6 col-12">
            <div className="card-body">
              <div className="product-details">
                <h3 className="card-title fw-regular">
                  {this.props.product.name}
                  <small className="text-grey text-darken-2">
                    {", " + this.props.product.quantity + " Kg"}
                  </small>
                </h3>
                <div className="d-flex ">
                  <h3 className="card-title">{this.props.product.prix} Dh</h3>
                </div>

                <div className="d-flex flex-row " style={{ height: 25 }}>
                  <StarRatingComponent
                    name=""
                    value={this.props.product.rating}
                    starCount={5}
                    editing={false}
                  />
                  <p className="ml-2">{this.props.product.rating}</p>
                </div>
                <p>{this.props.product.description}</p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-3 col-12">
            <div className="card-footer border-0 text-center bg-white">
              <div className="cart-btn mb-2">
                {this.state.user.type === "Farmer" ? (
                  <UpdateProduct id={this.props.product._id} />
                ) : (
                  <UpdateFProduct id={this.props.product._id} />
                )}
              </div>
              <div className="cart-btn mb-2">
                <Button
                  style={{
                    Width: "300px",
                    Height: "300px"
                  }}
                  variant="contained"
                  color="secondary"
                  className="jr-btn jr-btn-sm "
                  onClick={() => {
                    this.setState({ warning: true });
                  }}
                >
                  <i className="zmdi zmdi-delete" />
                  <span> remove </span>
                </Button>
              </div>
              <div className="cart-btn mb-2">
                {this.state.user.type === "Farmer" ? (
                  <ViewMore product={this.props.product} />
                ) : (
                  <ViewMoreF product={this.props.product} />
                )}
              </div>
            </div>
          </div>
        </div>
        <SweetAlert
          show={this.state.warning}
          warning
          showCancel
          confirmBtnText="Yes, Delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.deleteProduct}
          onCancel={() => {
            this.setState({ warning: false });
          }}
        >
          Do you really want to delete this product? this process cannot be
          undone
        </SweetAlert>
      </div>
    );
  }
}

export default ProductListItem;
