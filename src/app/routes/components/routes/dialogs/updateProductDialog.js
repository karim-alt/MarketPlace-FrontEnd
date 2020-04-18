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
import SweetAlert from "react-bootstrap-sweetalert";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class UpdateProductDialog extends React.Component {
  fileObj = [];
  fileArray = [];
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: "",
      name: "",
      country: "",
      prix: "",
      quantity: "",
      description: "",
      success: false,
      images: null
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
  }
  uploadMultipleFiles(e) {
    // console.log("e.target.files : ", e.target.files);
    this.fileObj.push(e.target.files);
    this.setState({ images: e.target.files });
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
  }
  changeHandler = value => {
    console.log("value", value);
    this.setState({ country: value });
  };
  handleClickOpen = () => {
    axios
      .get("http://localhost:5000/api/agricultural_products/" + this.props.id)
      .then(response => {
        this.setState({
          open: true,
          id: response.data._id,
          name: response.data.name,
          country: response.data.country,
          prix: response.data.prix,
          quantity: response.data.quantity,
          description: response.data.description,
          images: response.data.images
        });
      })
      .catch(function(error) {
        console.log(error);
      });
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
      this.state.country === "" ||
      this.state.prix === "" ||
      this.state.quantity === ""
    ) {
      if (this.state.name === "")
        NotificationManager.error("Product name is required!");
      if (this.state.country === "")
        NotificationManager.error("Country field is required!");
      if (this.state.prix === "")
        NotificationManager.error("Price is required!");
      if (this.state.quantity === "")
        NotificationManager.error("Quantity is required!");
    } else if (this.state.prix <= 0)
      NotificationManager.error("Price must be positive!");
    else if (this.state.quantity <= 0)
      NotificationManager.error("Quantity must be positive!");
    else {
      const formData = new FormData();

      formData.append("name", this.state.name);
      formData.append("country", this.state.country);
      formData.append("prix", this.state.prix);
      formData.append("quantity", this.state.quantity);
      formData.append("description", this.state.description);

      if (this.state.images !== null)
        for (var x = 0; x < this.state.images.length; x++) {
          formData.append("images", this.state.images[x]);
        }

      const config = {
        headers: { "content-type": "multipart/form-data" }
      };
      axios
        .post(
          "http://localhost:5000/api/agricultural_products/update/" +
            this.state.id,
          formData,
          config
        )
        .then(res => console.log(res.data))
        .catch(error => {
          console.log(error);
        });

      this.setState({
        name: "",
        country: "",
        prix: "",
        quantity: "",
        description: "",
        images: null,
        open: false,
        success: true
      });
    }
    this.fileObj = [];
    this.fileArray = [];
  };

  render() {
    return (
      <div>
        <NotificationContainer />
        <Button
          color="primary"
          variant="contained"
          className="jr-btn jr-btn-sm "
          onClick={this.handleClickOpen}
        >
          {/* <IntlMessages id="eCommerce.addToCart" /> */}
          <i className="zmdi zmdi zmdi-edit" />
          <span>Update</span>
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
                Update product
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
                        value={this.state.name}
                        onChange={event =>
                          this.setState({ name: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        className="form-control form-control-lg"
                        id="country"
                        type="text"
                        placeholder="Country.."
                        defaultValue={this.state.country}
                        onChange={event =>
                          this.setState({ country: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Prix">Prix (Dh)</label>
                      <input
                        className="form-control form-control-lg"
                        id="Prix"
                        type="number"
                        placeholder="Prix.."
                        defaultValue={this.state.prix}
                        onChange={event =>
                          this.setState({ prix: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">Quantity (Kg)</label>
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
          Product updated successfully!
        </SweetAlert>
      </div>
    );
  }
}

export default UpdateProductDialog;
