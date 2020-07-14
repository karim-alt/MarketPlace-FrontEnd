import React from "react";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import jwt_decode from "jwt-decode";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class NotificationItem extends React.Component {
  // sellerInfo = null;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: jwt_decode(localStorage.jwtToken),
      sellerInfo: null,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/users/" + this.props.order.Seller_Id)
      .then((response) => {
        // console.log("response", response);
        this.setState({ sellerInfo: response.data });
        // this.sellerInfo = response.data;
        console.log("response.data", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { order } = this.props;
    return (
      <li className="media" style={{ margin: 0, padding: 8 }}>
        <Button
          color="primary"
          className="jr-btn jr-btn-sm "
          style={{ textAlign: "left" }}
          onClick={this.handleClickOpen}
        >
          <div className="media-body align-self-center">
            <p className="sub-heading mb-0">
              {" Hello, your order "}
              <strong>
                "{order.Qty}
                {this.state.user.type === "Client" ? null : " bag(s) "}
                {" of "}
                {order.productName}"
              </strong>
              , have been aproved by the seller 😇.
            </p>
            <span className="jr-btn jr-btn-xs mb-0">
              <i className="zmdi zmdi-comment-text text-grey zmdi-hc-fw" />
            </span>
            <span className="meta-date" style={{ margin: "5px" }}>
              <small>
                {order.date.slice(0, 10)} at {order.date.slice(11, 16)}
              </small>
            </span>
          </div>
        </Button>
        <div>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth={true}
            maxWidth="sm"
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {" "}
                <table
                  width="100%"
                  style={{
                    margin: "auto",
                    padding: "10px",
                    backgroundColor: "#F3F3F3",
                  }}
                >
                  <tr>
                    <td>
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        style={{
                          textAlign: "center",
                          width: "100%",
                          backgroundColor: "#fff",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#57B45A",
                              height: "100px",
                              fontSize: "50px",
                              color: "#fff",
                            }}
                          >
                            <img
                              src="https://img.icons8.com/dusk/64/000000/return-purchase.png"
                              alt="icone"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h1 style={{ paddingTop: "20px" }}>
                              Order Approved
                            </h1>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <center>
                              <p style={{ padding: "0px 100px" }}>
                                <p>
                                  <strong>Product Name :</strong>{" "}
                                  {order.productName}
                                </p>
                                <p>
                                  <strong>Ordred quantity :</strong>
                                  {order.Qty}
                                  {this.state.user.type === "Farmer"
                                    ? " bag(s)"
                                    : null}
                                </p>
                                <p>
                                  <strong>Price :</strong>
                                  {this.state.user.type === "Client"
                                    ? order.price *
                                      order.Qty.slice(0, order.Qty.length - 2)
                                    : order.price * order.Qty}
                                  {" dh"}
                                </p>
                                <p>
                                  <strong>{"Seller Name : "} </strong>
                                  {this.state.sellerInfo
                                    ? this.state.sellerInfo.fullName
                                    : null}
                                </p>
                                <p style={{ paddingBottom: "20px" }}>
                                  <strong>{"Phone number : "}</strong>
                                  {this.state.sellerInfo
                                    ? this.state.sellerInfo.phone
                                    : null}
                                </p>
                              </p>
                            </center>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </li>
    );
  }
}

export default NotificationItem;
