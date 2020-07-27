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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import countryList from "react-select-country-list";
import IntlMessages from "util/IntlMessages";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
let count = 0;
class UpdateProductDialog extends React.Component {
  fileObj = [];
  fileArray = [];
  constructor(props) {
    super(props);
    this.options = countryList().getData();
    this.state = {
      options: this.options,
      open: false,
      id: "",
      name: "",
      country: "",
      prix: "",
      quantity: "",
      description: "",
      unit: "",
      success: false,
      chipData: [],
      images: null,
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
  }
  onTagsChange = (event, values) => {
    this.setState({
      chipData: values,
    });
  };
  handleChange = (e) => {
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
  handleRequestDelete = (data) => () => {
    const chipData = [...this.state.chipData];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.setState({ chipData });
  };

  handleClickOpen = () => {
    axios
      .get("http://localhost:5000/api/agricultural_products/" + this.props.id)
      .then((response) => {
        for (let i = 0; i < response.data.country.length; i++) {
          this.setState({
            label: "",
            chipData: this.state.chipData.concat({
              key: i,
              label: response.data.country[i],
            }),
          });
        }
        this.setState({
          open: true,
          id: response.data._id,
          name: response.data.name,
          country: response.data.country,
          prix: response.data.prix,
          unit: response.data.quantity.slice(-2),
          quantity: response.data.quantity.match(/\d/g).join(""),
          description: response.data.description,
          images: response.data.images,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  handleRequestClose = () => {
    this.setState({ open: false, nam: "", chipData: [] });
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
      for (let x = 0; x < this.state.chipData.length; x++) {
        formData.append("country", this.state.chipData[x].label);
      }
      if (this.state.images !== null)
        for (var x = 0; x < this.state.images.length; x++) {
          formData.append("images", this.state.images[x]);
        }

      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      axios
        .post(
          "http://localhost:5000/api/agricultural_products/update/" +
            this.state.id,
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
        unit: "kg",
        open: false,
        success: true,
        chipData: [],
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
          <span>
            <IntlMessages id="appModule.Update" />
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
                <IntlMessages id="appModule.UpdateProduct" />
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

                  <div className="col-md-3 col-12">
                    <div className="form-group">
                      <label htmlFor="Quantity">
                        <IntlMessages id="appModule.Quantity" /> (
                        {this.state.unit})
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
                  <div className="col-md-3 col-12">
                    <div className="form-group">
                      <label htmlFor="Unit">
                        <IntlMessages id="appModule.Unit" />{" "}
                      </label>

                      <select
                        className="form-control form-control-lg"
                        placeholder="Unit.."
                        defaultValue={this.state.unit}
                        onChange={this.handleChange}
                      >
                        <option value="kg">Kg</option>
                        <option value=" q">Quintal(q)</option>
                        <option value=" t">Tonne(t)</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Prix">
                        <IntlMessages id="appModule.Price" />
                      </label>
                      <input
                        className="form-control form-control-lg"
                        id="Prix"
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
                      value={this.state.chipData}
                      onChange={this.onTagsChange}
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
                      <label>
                        <IntlMessages id="appModule.Description" />
                      </label>
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
          title={<IntlMessages id="sweetAlerts.success" />}
          onConfirm={(event) => this.setState({ success: false })}
        >
          <IntlMessages id="sweetAlerts.Updatesuccess" />
        </SweetAlert>
      </div>
    );
  }
}

export default UpdateProductDialog;
