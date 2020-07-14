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
// import Select from "react-select";

import countryList from "react-select-country-list";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "./dialog.css";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

let count = 0;
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
      success: false,
      images: null,
      unit: "kg",
      user: jwt_decode(localStorage.jwtToken),
      chipData: [{ label: "Morocco" }],
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
  }
  handleChangeUnit = (e) => {
    this.setState({ unit: e.target.value });
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
    this.setState({ open: false, chipData: [{ label: "Morocco" }] });
    this.fileObj = [];
    this.fileArray = [];
  };

  onTagsChange = (event, values) => {
    console.log("values", values);
    this.setState({
      chipData: values,
    });
  };

  handleSave = (e) => {
    e.preventDefault();
    if (
      this.state.name === "" ||
      this.state.chipData.length === 0 ||
      this.state.prix === "" ||
      this.state.quantity === ""
    ) {
      if (this.state.name === "")
        NotificationManager.error("Product name is required!");
      if (this.state.chipData.length === 0)
        NotificationManager.error("You must enter at least one country!");
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
      formData.append("prix", this.state.prix);
      formData.append("quantity", this.state.quantity + " " + this.state.unit);
      formData.append("description", this.state.description);
      formData.append("seller_id", this.state.user.id);
      for (let x = 0; x < this.state.chipData.length; x++) {
        formData.append("country", this.state.chipData[x].label);
      }
      if (this.state.images !== null)
        for (let x = 0; x < this.state.images.length; x++) {
          formData.append("images", this.state.images[x]);
        }
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      axios
        .post(
          "http://localhost:5000/api/agricultural_products/add",
          formData,
          config
        )
        .then((res) => console.log(res.data))
        .catch((error) => {
          console.log(error);
        });
      this.setState({
        name: "",
        country: null,
        prix: "",
        quantity: "",
        description: "",
        images: null,
        open: false,
        success: true,
        unit: "kg",
        chipData: [{ label: "Morocco" }],
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
                  textAlign: "center",
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
                margin: "0 auto",
              }}
            >
              <form action="" className="contact-form jr-card">
                <div className="row">
                  <div
                    style={{
                      display: "inline-block",
                      margin: "0 auto",
                    }}
                    className="col-12"
                  >
                    <div className="col-md-12">
                      <div className="card">
                        <div
                          className="card-header"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Product images
                        </div>
                        <div className="card-body">
                          <form>
                            <div className="form-group multi-preview">
                              {(this.fileArray || []).map((url) => (
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
                        onChange={(event) =>
                          this.setState({ name: event.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">
                        Quantity ({this.state.unit})
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="Quantity"
                        type="Number"
                        placeholder="Quantity.."
                        defaultValue={this.state.quantity}
                        onChange={(event) =>
                          this.setState({ quantity: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-12">
                    <div className="form-group">
                      <label htmlFor="Unit">Unit </label>

                      <select
                        className="form-control form-control-lg"
                        placeholder="Unit.."
                        value={this.state.unit}
                        onChange={this.handleChangeUnit}
                      >
                        <option value="kg">Kg</option>
                        <option value="q">Quintal(q)</option>
                        <option value="t">Tonne(t)</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Prix">Price (Dh/{this.state.unit})</label>
                      <input
                        className="form-control form-control-lg"
                        id="Prix"
                        type="Number"
                        placeholder="Price.."
                        defaultValue={this.state.prix}
                        onChange={(event) =>
                          this.setState({ prix: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    {/* <div className="form-group">
                      <label htmlFor="country">Countries</label>
                      {/* <Select
                        options={this.state.options}
                        value={this.state.country}
                        placeholder="add country.."
                        onChange={this.changeHandler}
                      /> */}
                    {/* <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="add country and press enter to add more.. "
                        onChange={this.onValueChange.bind(this)}
                        value={this.state.nam}
                        onKeyPress={this._handleKeyPress.bind(this)}
                      />
                    </div> */}
                    <Autocomplete
                      style={{ marginTop: "16px" }}
                      multiple
                      id="tags-outlined"
                      options={this.state.options}
                      getOptionLabel={(option) => option.label}
                      defaultValue={[this.state.options[150]]}
                      onChange={this.onTagsChange}
                      // onClick={this.handleClick}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Countries"
                          placeholder="Add countries"
                        />
                      )}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="6"
                        placeholder="Product description.."
                        defaultValue={this.state.description}
                        onChange={(event) =>
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
          onConfirm={(event) => this.setState({ success: false })}
        >
          Product added successfully!
        </SweetAlert>
      </div>
    );
  }
}

export default AddProductDialog;
