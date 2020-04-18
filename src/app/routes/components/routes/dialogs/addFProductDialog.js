import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import jwt_decode from "jwt-decode";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import countryList from "react-select-country-list";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "./dialog.css";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddProductDialog extends React.Component {
  fileObj = [];
  fileArray = [];
  constructor(props) {
    super(props);
    this.options = countryList().getData();
    this.state = {
      options: this.options,
      open: false,
      name: "",
      country: null,
      prix: "",
      quantity: "",
      description: "",
      bag_weight: "",
      N: "",
      P: "",
      K: "",

      success: false,
      images: null,
      user: jwt_decode(localStorage.jwtToken)
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
  }
  changeHandler = value => {
    console.log("value", value);
    this.setState({ country: value });
  };
  uploadMultipleFiles(e) {
    // console.log("e.target.files : ", e.target.files);
    this.fileObj.push(e.target.files);
    this.setState({ images: e.target.files });
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleRequestClose = () => {
    this.setState({ open: false });
    this.fileObj = [];
    this.fileArray = [];
  };
  handleSave = e => {
    e.preventDefault();

    if (
      this.state.name === "" ||
      this.state.country === null ||
      this.state.prix === "" ||
      this.state.quantity === ""
    ) {
      if (this.state.name === "")
        NotificationManager.error("Product name is required!");
      if (this.state.country === null)
        NotificationManager.error("Country field is required!");
      if (this.state.prix === "")
        NotificationManager.error("Price is required!");
      if (this.state.bag_weight === "")
        NotificationManager.error("Bag weight is required!");
      if (this.state.quantity === "")
        NotificationManager.error("Quantity is required!");
    } else if (this.state.prix <= 0)
      NotificationManager.error("Price must be positive!");
    else if (this.state.quantity <= 0)
      NotificationManager.error("Quantity must be positive!");
    else if (this.state.N < 0 || this.state.P < 0 || this.state.K < 0)
      NotificationManager.error("Percentage can't be negative!");
    else {
      const formData = new FormData();

      formData.append("name", this.state.name);
      formData.append("country", this.state.country.label);
      formData.append("prix", this.state.prix);
      formData.append("quantity", this.state.quantity);
      formData.append("bag_weight", this.state.bag_weight);
      formData.append("description", this.state.description);
      formData.append("seller_id", this.state.user.id);

      if (this.state.N !== "") formData.append("N", this.state.N);
      else formData.append("N", 0);
      if (this.state.P !== "") formData.append("P", this.state.P);
      else formData.append("P", 0);
      if (this.state.K !== "") formData.append("K", this.state.K);
      else formData.append("K", 0);

      if (this.state.images !== null)
        for (let x = 0; x < this.state.images.length; x++) {
          formData.append("images", this.state.images[x]);
        }
      const config = {
        headers: { "content-type": "multipart/form-data" }
      };
      axios
        .post(
          "http://localhost:5000/api/fertilized_products/add",
          formData,
          config
        )
        .then(res => console.log(res.data))
        .catch(error => {
          console.log(error);
        });
      this.setState({
        name: "",
        country: null,
        prix: "",
        quantity: "",
        description: "",
        N: "",
        P: "",
        K: "",

        images: null,
        open: false,
        success: true
      });
      this.fileObj = [];
      this.fileArray = [];
    }
  };

  render() {
    return (
      <div>
        <div>
          <NotificationContainer />
        </div>

        <Button
          color="primary"
          variant="contained"
          className="jr-btn jr-btn-sm "
          onClick={this.handleClickOpen}
        >
          {/* <IntlMessages id="eCommerce.addToCart" /> */}
          <i className="zmdi zmdi-shopping-cart-plus" />
          <span>Add Product</span>
        </Button>

        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleRequestClose}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative">
            <Toolbar>
              <IconButton onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit"
                style={{
                  flex: 1,
                  textAlign: "center"
                }}
              >
                Add new product
              </Typography>
              <Button color="inherit" onClick={this.handleSave}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <div className="row">
            <div
              className="col-lg-9 col-md-8 col-sm-7 col-12"
              style={{
                display: "inline-block",
                margin: "0 auto"
              }}
            >
              <form action="" className="contact-form jr-card">
                <div className="row">
                  <div
                    style={{
                      display: "inline-block",
                      margin: "0 auto"
                    }}
                    className="col-12"
                  >
                    <div className="col-md-12">
                      <div className="card">
                        <div
                          className="card-header"
                          style={{
                            textAlign: "center"
                          }}
                        >
                          Product images
                        </div>
                        <div className="card-body">
                          <form>
                            <div className="form-group multi-preview">
                              {(this.fileArray || []).map(url => (
                                <img src={url} alt="..." />
                              ))}
                            </div>

                            <div className="form-group">
                              <input
                                type="file"
                                className="form-control"
                                onChange={this.uploadMultipleFiles}
                                multiple
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-md-6 col-12 ">
                    <div className="form-group">
                      <label form="productName">Product name</label>
                      <input
                        className="form-control form-control-lg"
                        id="productName"
                        type="text"
                        placeholder="Product Name.."
                        defaultValue={this.state.name}
                        onChange={event =>
                          this.setState({ name: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <Select
                        options={this.state.options}
                        value={this.state.country}
                        onChange={this.changeHandler}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="Prix">Bag weight (Kg)</label>
                      <input
                        className="form-control form-control-lg"
                        id="bag_weight"
                        type="Number"
                        placeholder="Bag weight.."
                        defaultValue={this.state.bag_weight}
                        onChange={event =>
                          this.setState({ bag_weight: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">Quantity(Bags) </label>
                      <input
                        className="form-control form-control-lg"
                        id="Quantity"
                        type="Number"
                        placeholder="Quantity.."
                        defaultValue={this.state.quantity}
                        onChange={event =>
                          this.setState({ quantity: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">Price (Dh/Bag) </label>
                      <input
                        className="form-control form-control-lg"
                        id="Price"
                        type="Number"
                        placeholder="Price.."
                        defaultValue={this.state.prix}
                        onChange={event =>
                          this.setState({ prix: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="N (%)">N (%) </label>
                      <input
                        className="form-control form-control-lg"
                        id="N"
                        type="Number"
                        placeholder="N.."
                        defaultValue={this.state.N}
                        onChange={event =>
                          this.setState({ N: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="P (%)">P (%) </label>
                      <input
                        className="form-control form-control-lg"
                        id="P"
                        type="Number"
                        placeholder="P.."
                        defaultValue={this.state.P}
                        onChange={event =>
                          this.setState({ P: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <label htmlFor="k (%)">k (%) </label>
                      <input
                        className="form-control form-control-lg"
                        id="K"
                        type="Number"
                        placeholder="K.."
                        defaultValue={this.state.K}
                        onChange={event =>
                          this.setState({ K: event.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="6"
                        placeholder="Product description.."
                        defaultValue={this.state.description}
                        onChange={event =>
                          this.setState({ description: event.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
        <SweetAlert
          show={this.state.success}
          success
          title="Success"
          onConfirm={event => this.setState({ success: false })}
        >
          Product added successfully!
        </SweetAlert>
      </div>
    );
  }
}

export default AddProductDialog;
