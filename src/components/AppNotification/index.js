import React from "react";
import NotificationItem from "./NotificationItem";
import NotificationItem2 from "./NotificationItem2";
import CustomScrollbars from "util/CustomScrollbars";
import axios from "axios";
import jwt_decode from "jwt-decode";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import Moment from "moment";
function TabContainer({ children, dir }) {
  return <div dir={dir}>{children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class AppNotification extends React.Component {
  sellerInfo = null;
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      ordershlp: [],
      user: jwt_decode(localStorage.jwtToken),
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };
  componentDidMount() {
    let url = "http://localhost:5000/api/orders/myOrders/";
    axios
      .get(url + this.state.user.id)
      .then((response) => {
        this.setState({
          ordershlp: response.data,
        });
        let data = response.data;
        // .sort(
        //   (a, b) =>
        //     new Moment(a.date).format("YYYYMMDD") -
        //     new Moment(b.date).format("YYYYMMDD")
        // );

        this.setState({ orders: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // componentDidUpdate() {
  //   let url = "http://localhost:5000/api/orders/myOrders/";
  //   axios
  //     .get(url + this.state.user.id)
  //     .then(response => {
  //       this.setState({ ordershlp: response.data, orders: response.data });
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }

  render() {
    const { theme } = this.props;
    return (
      <CustomScrollbars
        className="messages-list scrollbar"
        style={{ height: 280 }}
      >
        <ul className="list-unstyled">
          {this.state.ordershlp.map((order, index) => {
            if (
              this.state.user.type !== "Client" &&
              order.Type !== this.state.user.type
            ) {
              return <NotificationItem key={index} order={order} />;
            }
          })}
        </ul>
        <ul className="list-unstyled">
          {this.state.orders.map((order, index) => {
            if (this.state.user.type !== "Provider") {
              if (order.Type === "Client") {
                if (
                  order.status === true &&
                  this.state.user.type === "Client"
                ) {
                  return <NotificationItem2 key={index} order={order} />;
                } else return null;
              } else if (order.Type === "Farmer") {
                if (order.status === true) {
                  return <NotificationItem2 key={index} order={order} />;
                } else return null;
              }
            }
          })}
        </ul>
      </CustomScrollbars>
    );
  }
}
AppNotification.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withStyles(null, { withTheme: true })(AppNotification);
