import React from "react";
import jwt_decode from "jwt-decode";

class OrderTableCell extends React.Component {
  constructor() {
    super();
    this.state = {
      user: jwt_decode(localStorage.jwtToken)
    };
  }
  handleChange = event => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };
  render() {
    const { index, order } = this.props;

    return (
      <tr tabIndex={-1} key={index} style={{ textAlign: "left" }}>
        <td>{order.productName}</td>

        <td>{order.Qty}</td>
        <td>{order.price * order.Qty}</td>
        <td>{order.Date.slice(0, 10)}</td>
        <td className="status-cell text-left">
          {order.status === true ? (
            <div className={` badge text-uppercase text-white bg-success`}>
              Approved
            </div>
          ) : (
            <div className={` badge text-uppercase bg-amber`}>On Hold</div>
          )}
        </td>
        <td></td>
      </tr>
    );
  }
}

export default OrderTableCell;
