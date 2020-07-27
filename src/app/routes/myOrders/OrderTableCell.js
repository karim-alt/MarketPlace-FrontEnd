import React from "react";
import jwt_decode from "jwt-decode";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import IntlMessages from "util/IntlMessages";
class OrderTableCell extends React.Component {
  sellerInfo = null;
  constructor() {
    super();
    this.state = {
      user: jwt_decode(localStorage.jwtToken),
    };
  }
  componentDidMount() {
    axios
      .get("http://localhost:5000/api/users/" + this.props.order.Seller_Id)
      .then((response) => {
        // console.log("response", response);
        this.sellerInfo = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };
  render() {
    const { index, order } = this.props;

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
              <h5 className="user-name">
                {this.sellerInfo !== null && this.sellerInfo.fullName}{" "}
              </h5>
            </div>
          </div>
        </td>
        <td>{this.sellerInfo !== null && this.sellerInfo.phone}</td>
        <td>{order.Qty}</td>
        <td>
          {this.state.user.type === "Client"
            ? order.price * order.Qty.slice(0, order.Qty.length - 2)
            : order.price * order.Qty}
        </td>
        <td>{order.date.slice(0, 10)}</td>
        <td className="status-cell text-left">
          {order.status === true ? (
            <div className={` badge text-uppercase text-white bg-success`}>
              <IntlMessages id="appModule.Approved" />
            </div>
          ) : (
            <div className={` badge text-uppercase bg-amber`}>
              {" "}
              <IntlMessages id="appModule.Hold" />
            </div>
          )}
        </td>
        <td></td>
      </tr>
    );
  }
}

export default OrderTableCell;
