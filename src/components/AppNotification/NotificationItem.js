import React from "react";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import jwt_decode from "jwt-decode";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: jwt_decode(localStorage.jwtToken),
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
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
          {/* <Avatar
            alt="https://via.placeholder.com/150x150"
            src="https://via.placeholder.com/150x150"
            className=" mr-2"
          /> */}

          <div className="media-body align-self-center">
            <p className="sub-heading mb-0">
              Hello, I want to buy{" "}
              <strong>
                "{order.Qty}
                {this.state.user.type === "Farmer" ? null : " bag(s)"} of{" "}
                {order.productName}"
              </strong>
              , Please contact me if you still have this quantity, thank you 😇.
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
                            <h1 style={{ paddingTop: "20px" }}>New Order</h1>
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
                                    ? null
                                    : " bag(s)"}
                                </p>
                                <p>
                                  <strong>Price :</strong>{" "}
                                  {this.state.user.type === "Farmer"
                                    ? order.price *
                                      order.Qty.slice(0, order.Qty.length - 2)
                                    : order.price * order.Qty}
                                  {" dh"}
                                </p>
                                <p>
                                  {" "}
                                  <strong>Costumer Name :</strong>{" "}
                                  {order.buyerName}
                                </p>
                                <p style={{ paddingBottom: "20px" }}>
                                  <strong>Phone number :</strong>{" "}
                                  {order.buyerPhone}
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
              <center>
                <Button onClick={this.handleClose} color="primary">
                  OK
                </Button>
              </center>
            </DialogActions>
          </Dialog>
        </div>
      </li>
    );
  }
}

export default NotificationItem;
