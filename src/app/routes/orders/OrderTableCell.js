import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import jwt_decode from "jwt-decode";
// import axios from "axios";
import io from "socket.io-client";
class OrderTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.order.status,
      user: jwt_decode(localStorage.jwtToken),
    };
  }
  handleChange = (event) => {
    if (this.state.checked === false) {
      this.setState({ checked: true });
      let server = "localhost:5000";
      this.socket = io.connect(server);
      this.socket.emit("approve", this.props.order._id);
    }
  };

  render() {
    const { index, order } = this.props;
    const AntSwitch = withStyles((theme) => ({
      root: {
        width: 28,
        height: 16,
        padding: 0,
        display: "flex",
      },
      switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        "&$checked": {
          transform: "translateX(12px)",
          color: theme.palette.common.white,
          "& + $track": {
            opacity: 1,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
        },
      },
      thumb: {
        width: 12,
        height: 12,
        boxShadow: "none",
      },
      track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
      },
      checked: {},
    }))(Switch);

    return (
      <tr tabIndex={-1} key={index} style={{ textAlign: "left" }}>
        <td>{order.productName}</td>
        <td>
          <div className="user-profile d-flex flex-row align-items-center">
            <Avatar
              alt="https://via.placeholder.com/150x150"
              src="https://via.placeholder.com/150x150"
              className="user-avatar"
            />
            <div className="user-detail">
              <h5 className="user-name">{order.buyerName} </h5>
            </div>
          </div>
        </td>
        <td>
          {this.state.user.type === "Farmer" ||
          this.state.user.type === "Provider"
            ? order.buyerPhone
            : null}
        </td>
        <td>{order.Qty}</td>
        <td>
          {this.state.user.type === "Farmer"
            ? order.price * order.Qty.slice(0, order.Qty.length - 2)
            : order.price * order.Qty}
        </td>
        <td>{order.date.slice(0, 10)}</td>
        {/* <td className="status-cell text-right">
          <div className={` badge text-uppercase bg-amber`}>On Hold</div>
        </td> */}
        <td>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
                <AntSwitch
                  checked={this.state.checked}
                  onChange={this.handleChange}
                  onClick={this.handleClick}
                  name="checked"
                />
              </Grid>
              <Grid item>Accept</Grid>
            </Grid>
          </Typography>
        </td>
      </tr>
    );
  }
}

export default OrderTableCell;
