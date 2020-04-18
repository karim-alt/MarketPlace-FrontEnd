import React from "react";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
      user: jwt_decode(localStorage.jwtToken)
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
      <li className="media">
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
            <strong>Order</strong>
            <p className="sub-heading mb-0" style={{ margin: "5px" }}>
              Hello, I want to buy{" "}
              <strong>
                "{order.Qty}
                {this.state.user.type === "Farmer" ? " Kg" : " bag(s)"} of{" "}
                {order.productName}"
              </strong>
              , Please contact me if you still have this quantity, thank you :)
            </p>
            <span className="jr-btn jr-btn-xs mb-0">
              <i className="zmdi zmdi-comment-text text-grey zmdi-hc-fw" />
            </span>
            <span className="meta-date" style={{ margin: "5px" }}>
              <small>
                {order.Date.slice(0, 10)} at {order.Date.slice(11, 16)}
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
            <center>
              <DialogTitle id="alert-dialog-slide-title">
                {"Order and customer informations"}
              </DialogTitle>
            </center>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <center>
                  <div className="row">
                    <div className="col-6" style={{ marginTop: "10px" }}>
                      <strong>Product name : </strong>
                      {order.productName}
                    </div>
                    <div className="col-6" style={{ marginTop: "10px" }}>
                      <strong>Customer Name : </strong>
                      {order.buyerName}
                    </div>

                    <div className="col-6" style={{ marginTop: "10px" }}>
                      <strong>Ordered Quantity : </strong>
                      {order.Qty}
                      {this.state.user.type === "Farmer" ? " Kg" : " bag(s)"}
                    </div>
                    <div className="col-6" style={{ marginTop: "10px" }}>
                      <strong>Phone Number : </strong>
                      {order.buyerPhone}
                    </div>
                    <div className="col-12" style={{ marginTop: "15px" }}>
                      <strong>Price : </strong>
                      {order.price * order.Qty}
                      {" dh"}
                    </div>
                  </div>
                </center>
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
