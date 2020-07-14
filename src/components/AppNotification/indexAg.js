import React from "react";
import NotificationItem from "./NotificationItem";
import NotificationItem2 from "./NotificationItem2";
import CustomScrollbars from "util/CustomScrollbars";
import axios from "axios";
import jwt_decode from "jwt-decode";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CardBody } from "reactstrap";
import Moment from "moment";
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
          ordershlp: response.data.sort(
            (a, b) =>
              new Moment(a.date).format("YYYYMMDD") -
              new Moment(b.date).format("YYYYMMDD")
          ),
        });
        let data = response.data
          .sort(
            (a, b) =>
              new Moment(a.date).format("YYYYMMDD") -
              new Moment(b.date).format("YYYYMMDD")
          )
          .reverse();
        this.setState({ orders: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { theme } = this.props;
    return (
      <CustomScrollbars
        className="messages-list scrollbar"
        style={{ height: 310 }}
      >
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          variant="fullWidth"
        >
          <Tab className="tab" label="Orders" />
          <Tab className="tab" label="Responses" />
        </Tabs>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <CustomScrollbars
              className="messages-list scrollbar"
              style={{ height: 260 }}
            >
              <CardBody style={{ margin: 0, padding: 5 }}>
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
              </CardBody>
            </CustomScrollbars>
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <CustomScrollbars
              className="messages-list scrollbar"
              style={{ height: 260 }}
            >
              <CardBody style={{ margin: 0, padding: 5 }}>
                <ul className="list-unstyled">
                  {this.state.orders.map((order, index) => {
                    if (this.state.user.type !== "Provider") {
                      if (order.Type === "Client") {
                        if (
                          order.status === true &&
                          this.state.user.type === "Client"
                        ) {
                          return (
                            <NotificationItem2 key={index} order={order} />
                          );
                        } else return null;
                      } else if (order.Type === "Farmer") {
                        if (order.status === true) {
                          return (
                            <NotificationItem2 key={index} order={order} />
                          );
                        } else return null;
                      }
                    }
                  })}
                </ul>{" "}
              </CardBody>
            </CustomScrollbars>
          </TabContainer>
        </SwipeableViews>
      </CustomScrollbars>
    );
  }
}
AppNotification.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withStyles(null, { withTheme: true })(AppNotification);
