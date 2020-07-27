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
import IntlMessages from "util/IntlMessages";
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
      bag_weight: "",
      composition: null,
      N: null,
      P: null,
      K: null,
      success: false,
      images: null,
      nam: "",
      chipData: [{ label: "Morocco" }],
      user: jwt_decode(localStorage.jwtToken),
      other: false,
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
  }
  onTagsChange = (event, values) => {
    this.setState({
      chipData: values,
    });
  };
  handleRequestDelete = (data) => () => {
    const chipData = [...this.state.chipData];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.setState({ chipData });
  };
  handleChange = (e) => {
    switch (e.target.value) {
      case "Other":
        this.setState({
          other: true,
          composition: e.target.value,
          N: null,
          P: null,
          K: null,
        });
        break;
      case "Nitrate de potasse 13N-0P-46K":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 13,
          P: 0,
          K: 46,
        });
        break;
      case "MAP 12N-61P-0K":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 12,
          P: 61,
          K: 0,
        });
        break;
      case "NPK 15-15-15-10S":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 15,
          P: 15,
          K: 15,
        });
        break;
      case "MAP 11N-52P-0K":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 11,
          P: 52,
          K: 0,
        });
        break;
      case "DAP 18N-46P-0K":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 18,
          P: 46,
          K: 0,
        });
        break;
      case "NPK 16-11-20":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 16,
          P: 11,
          K: 20,
        });
        break;
      case "NPK 17-16-12":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 17,
          P: 16,
          K: 12,
        });
        break;
      case "NPS 12N-46P-0K-7S":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 12,
          P: 46,
          K: 0,
        });
        break;
      case "NPS 19N-38P-0K-7S":
        this.setState({
          other: false,
          composition: e.target.value,
          N: 19,
          P: 38,
          K: 0,
        });
        break;
    }
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
    this.setState({
      open: false,
      chipData: [{ label: "Morocco" }],
      N: null,
      P: null,
      K: null,
    });
    this.fileObj = [];
    this.fileArray = [];
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
      if (this.state.bag_weight === "")
        NotificationManager.error("Bag weight is required!");
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
      formData.append("quantity", this.state.quantity);
      formData.append("bag_weight", this.state.bag_weight);
      formData.append("description", this.state.description);
      formData.append("seller_id", this.state.user.id);
      // console.log("this.state.N", (this.state.bag_weight * this.state.K) / 100);
      formData.append("N", (this.state.bag_weight * this.state.N) / 100);
      formData.append("P", (this.state.bag_weight * this.state.P) / 100);
      formData.append("K", (this.state.bag_weight * this.state.K) / 100);
      if (this.state.other === false) {
        formData.append("composition", this.state.composition);
      } else
        formData.append(
          "composition",
          "NPK " + this.state.N + "-" + this.state.N + "-" + this.state.K
        );
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
          "http://localhost:5000/api/fertilized_products/add",
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
        bag_weight: "",
        N: null,
        P: null,
        K: null,
        images: null,
        open: false,
        success: true,
        chipData: [{ label: "Morocco" }],
        composition: null,
        other: false,
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
          <span>
            <IntlMessages id="appModule.AddProduct" />
          </span>
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
                <IntlMessages id="appModule.AddNproduct" />
              </Typography>
              <Button color="inherit" onClick={this.handleSave}>
                <IntlMessages id="appModule.Save" />
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
                          <IntlMessages id="appModule.ProductImages" />
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
                      <label form="productName">
                        <IntlMessages id="appModule.ProductName" />
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="productName"
                        type="text"
                        placeholder=".."
                        defaultValue={this.state.name}
                        onChange={(event) =>
                          this.setState({ name: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Prix">
                        {" "}
                        <IntlMessages id="appModule.Bagweight" />
                        (<IntlMessages id="appModule.Kg" />)
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="bag_weight"
                        type="Number"
                        placeholder=".."
                        defaultValue={this.state.bag_weight}
                        onChange={(event) =>
                          this.setState({ bag_weight: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">
                        <IntlMessages id="appModule.Quantity" />
                        <IntlMessages id="appModule.bag" />{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="Quantity"
                        type="Number"
                        placeholder=".."
                        defaultValue={this.state.quantity}
                        onChange={(event) =>
                          this.setState({ quantity: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">
                        <IntlMessages id="appModule.Price" />
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="Price"
                        type="Number"
                        placeholder=".."
                        defaultValue={this.state.prix}
                        onChange={(event) =>
                          this.setState({ prix: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
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
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Composition">
                        <IntlMessages id="appModule.Composition" />
                      </label>
                      <select
                        className="form-control form-control-lg"
                        value={this.state.composition}
                        onChange={this.handleChange}
                      >
                        <option value="" disabled selected>
                          Select composition
                        </option>
                        <option value="Nitrate de potasse 13N-0P-46K">
                          Nitrate de potasse 13N-0P-46K
                        </option>
                        <option value="MAP 12N-61P-0K">MAP 12N-61P-0K</option>
                        <option value="NPK 15-15-15-10S">
                          NPK 15-15-15-10S
                        </option>
                        <option value="MAP 11N-52P-0K">MAP 11N-52P-0K</option>
                        <option value="DAP 18N-46P-0K">DAP 18N-46P-0K</option>
                        <option value="NPK 16-11-20">NPK 16-11-20</option>
                        <option value="NPK 17-16-12">NPK 17-16-12</option>
                        <option value="NPS 12N-46P-0K-7S">
                          NPS 12N-46P-0K-7S
                        </option>
                        <option value="NPS 19N-38P-0K-7S">
                          NPS 19N-38P-0K-7S
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {this.state.other && (
                    <div className="col-md-4 col-12">
                      <div className="form-group">
                        <label htmlFor="N (%)">N (%) </label>
                        <input
                          className="form-control form-control-lg"
                          id="N"
                          type="Number"
                          placeholder="N.."
                          defaultValue={this.state.N}
                          onChange={(event) =>
                            this.setState({ N: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {this.state.other && (
                    <div className="col-md-4 col-12">
                      <div className="form-group">
                        <label htmlFor="P (%)">P (%) </label>
                        <input
                          className="form-control form-control-lg"
                          id="P"
                          type="Number"
                          placeholder="P.."
                          defaultValue={this.state.P}
                          onChange={(event) =>
                            this.setState({ P: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {this.state.other && (
                    <div className="col-md-4 col-12">
                      <div className="form-group">
                        <label htmlFor="k (%)">k (%) </label>
                        <input
                          className="form-control form-control-lg"
                          id="K"
                          type="Number"
                          placeholder="K.."
                          defaultValue={this.state.K}
                          onChange={(event) =>
                            this.setState({ K: event.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="form-group">
                      <label>
                        <IntlMessages id="appModule.Description" />
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="6"
                        placeholder=".."
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
          title={<IntlMessages id="sweetAlerts.success" />}
          onConfirm={(event) => this.setState({ success: false })}
        >
          <IntlMessages id="sweetAlerts.Addsuccess" />
        </SweetAlert>
      </div>
    );
  }
}

export default AddProductDialog;
