import React from "react";
import SalesStatistic from "components/dashboard/eCommerce/SalesStatistic";
import OrdersStatistic from "components/dashboard/eCommerce/OrdersStatistic";
import SalesStatisticlient from "components/dashboard/eCommerce/SalesStatisticlient";
import SalesStatisticFarmer from "components/dashboard/eCommerce/SalesStatisticFarmer";
import jwt_decode from "jwt-decode";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "reactstrap";
import Weather from "../../../components/MyWeather/index";
import WeatherDetail from "./Weather/WeatherDetail";
import ChartCard from "components/dashboard/Common/ChartCard";
import CardLayout from "./CardLayout";
import axios from "axios";
import { salesStatisticData } from "../../../app/routes/dashboard/Listing/data";
import IntlMessages from "util/IntlMessages";
const user = jwt_decode(localStorage.jwtToken);
class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: jwt_decode(localStorage.jwtToken),
      totalOrders: 0,
      approved: 0,
      showId: "1",
      fertilizer: [],
      orders: [],
      salesStatisticData: [],
      name: [],
      price: [],
      wheatherTime: null,
      wheatherDesc: null,
      weatherDeg: null,
    };
  }
  handleClick = (value) => (e) => {
    e.preventDefault();
    this.setState({ showId: value });
    // console.log("this.state.showId", this.state.showId);
  };
  componentDidMount() {
    let url = "http://localhost:5000/api/orders/myOrders/";

    axios
      .get(url + this.state.user.id)
      .then((response) => {
        this.setState({
          orders: response.data,
          totalOrders: response.data.filter(function (x) {
            if (user.type === "Farmer") return x.Type !== "Farmer";
            else return x.Type !== "Provider";
          }).length,
          approved: response.data.filter(function (x) {
            if (user.type === "Farmer")
              return x.Type !== "Farmer" && x.status === true;
            else return x.Type !== "Provider" && x.status === true;
          }).length,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:5000/api/scrap/sales")
      .then((response) => {
        let keys = [];
        let value = [];
        let fert = [];
        for (let i = 0; i < response.data.length; i++) {
          fert.push(response.data[i].fertilizer);
          Object.keys(response.data[i]).forEach(function (key) {
            if (keys.indexOf(key) === -1) {
              keys.push(key);
              // console.log(response.data[i].[key]);
            }
          });
        }
        for (let j = 0; j < keys.length; j++) {
          // console.log("" + keys[j], response.data[1][keys[j]]);
          value.push(response.data[8][keys[j]]);
        }
        this.setState({ fertilizer: fert });
        this.setState({ name: keys });
        this.setState({ price: value });
        // console.log(this.state.name);
        // console.log(this.state.value);
        for (let j = 2; j < keys.length - 2; j++) {
          this.setState({
            salesStatisticData: this.state.salesStatisticData.concat({
              names: this.state.name[j],
              price: this.state.price[j],
            }),
          });
        }
        // console.log(this.state.salesStatisticData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getSum() {
    let sum = 0;
    if (user.type === "Farmer") {
      for (let i = 0; i < this.state.orders.length; i++) {
        if (
          this.state.orders[i].status === true &&
          this.state.orders[i].Type === "Client"
        ) {
          sum +=
            this.state.orders[i].price *
            this.state.orders[i].Qty.slice(
              0,
              this.state.orders[i].Qty.length - 2
            );
        }
      }
      return sum;
    } else {
      for (let i = 0; i < this.state.orders.length; i++) {
        if (
          this.state.orders[i].status === true &&
          this.state.orders[i].Type === "Farmer"
        ) {
          sum += this.state.orders[i].price * this.state.orders[i].Qty;
          // console.log("sum", sum);
        }
      }
      return sum;
    }
  }

  render() {
    // console.log("this.state.showId", this.state.showId);
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          {/* <ContainerHeader
            match={this.props.match}
            title="Dashboard"
            // {<IntlMessages id="sidebar.dashboard.ecommerce" />}
          /> */}
          {this.state.user.type === "Farmer" ? (
            <div className="row">
              <div
                className="col-lg-3 col-sm-6 col-12"
                value={this.state.showId}
                onClick={this.handleClick("0")}
                style={{ cursor: "pointer" }}
              >
                <div styleName="bg-cyan ">
                  <CardLayout styleName="col-lg-6">
                    <WeatherDetail />
                  </CardLayout>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 col-12"
                id="1"
                value={this.state.showId}
                onClick={this.handleClick("1")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-cyan text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">{this.getSum()} Dh</h2>
                    <p>
                      <IntlMessages id="dashboard.totalRevenue" />
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart
                      data={salesStatisticData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#00BCD4"
                        activeDot={{ r: 8 }}
                        fillOpacity={0.5}
                        fill="rgba(255,255,255,0.8)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div
                className="col-lg-3 col-sm-6 col-12"
                id="1"
                value={this.state.showId}
                onClick={this.handleClick("3")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-warning text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">{this.state.totalOrders}</h2>
                    <p>
                      <IntlMessages id="dashboard.totalOrders" />
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="d-flex flex-row p-0">
                      <p className="text-white m-0">
                        <IntlMessages id="dashboard.approved" />
                      </p>
                      <p className="text-white ml-auto m-0">
                        {parseFloat(
                          (this.state.approved * 100) / this.state.totalOrders
                        ).toFixed(1)}{" "}
                        %
                      </p>
                    </div>
                    <Progress
                      className="shadow-lg mb-2 my-1"
                      style={{ height: 6 }}
                      color="white"
                      value={parseFloat(
                        (this.state.approved * 100) / this.state.totalOrders
                      ).toFixed(1)}
                    />
                    <div className="d-flex flex-row">
                      <p className="text-white m-0">
                        <IntlMessages id="dashboard.hold" />
                      </p>
                      <p className="text-white ml-auto m-0">
                        {parseFloat(
                          100 -
                            (this.state.approved * 100) / this.state.totalOrders
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <Progress
                      className="shadow-lg my-1"
                      style={{ height: 6 }}
                      color="white"
                      value={parseFloat(
                        100 -
                          (this.state.approved * 100) / this.state.totalOrders
                      ).toFixed(1)}
                    />
                  </div>
                </ChartCard>
              </div>
              <div
                className="col-lg-3 col-sm-6 col-12"
                value={this.state.showId}
                onClick={this.handleClick("2")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-secondary text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">306 US$/t (MAP)</h2>
                    <p style={{ fontSize: "13px" }}>
                      <IntlMessages id="dashboard.international" />
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart
                      data={this.state.salesStatisticData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="price"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        fillOpacity={0.5}
                        stroke="#E91E63"
                        fill="rgba(255,255,255,0.8)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>{" "}
            </div>
          ) : this.state.user.type === "Provider" ? (
            <div className="row">
              <div
                className="col-lg-4 col-sm-6 col-12"
                value={this.state.showId}
                onClick={this.handleClick("1")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-cyan text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">{this.getSum()} Dh</h2>
                    <p>
                      {/* <IntlMessages id="dashboard.lastMonthSale" /> */}
                      Total Revenue
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart
                      data={salesStatisticData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="uv"
                        // dataValue="name"
                        stroke="#00BCD4"
                        activeDot={{ r: 8 }}
                        fillOpacity={0.5}
                        fill="rgba(255,255,255,0.8)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div
                className="col-lg-4 col-sm-6 col-12"
                value={this.state.showId}
                onClick={this.handleClick("3")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-warning text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">{this.state.totalOrders}</h2>
                    <p>
                      {/* <IntlMessages id="dashboard.totalEmail" /> */}Total
                      Orders
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="d-flex flex-row p-0">
                      <p className="text-white m-0">Approved</p>
                      <p className="text-white ml-auto m-0">
                        {parseFloat(
                          (this.state.approved * 100) / this.state.totalOrders
                        ).toFixed(1)}{" "}
                        %
                      </p>
                    </div>
                    <Progress
                      className="shadow-lg mb-2 my-1"
                      style={{ height: 6 }}
                      color="white"
                      value={parseFloat(
                        (this.state.approved * 100) / this.state.totalOrders
                      ).toFixed(1)}
                    />
                    <div className="d-flex flex-row">
                      <p className="text-white m-0">On hold</p>
                      <p className="text-white ml-auto m-0">
                        {parseFloat(
                          100 -
                            (this.state.approved * 100) / this.state.totalOrders
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <Progress
                      className="shadow-lg my-1"
                      style={{ height: 6 }}
                      color="white"
                      value={parseFloat(
                        100 -
                          (this.state.approved * 100) / this.state.totalOrders
                      ).toFixed(1)}
                    />
                  </div>
                </ChartCard>
              </div>
              <div
                className="col-lg-4 col-sm-6 col-12"
                value={this.state.showId}
                onClick={this.handleClick("2")}
                style={{ cursor: "pointer" }}
              >
                <ChartCard styleName="bg-secondary text-white">
                  <div className="chart-title">
                    <h2 className="mb-1">306 US$/t (MAP)</h2>
                    <p style={{ fontSize: "15px" }}>
                      {/* <IntlMessages id="dashboard.totalRevenue" /> */}
                      Internationnal Products Price
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart
                      data={this.state.salesStatisticData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#E91E63"
                        activeDot={{ r: 8 }}
                        fillOpacity={0.5}
                        fill="rgba(255,255,255,0.8)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>{" "}
            </div>
          ) : null}
          {this.state.user.type === "Farmer" ||
          this.state.user.type === "Provider" ? (
            this.state.showId === "1" ? (
              <div className="row">
                <div className="col-12">
                  <SalesStatistic totalRevenue={this.getSum()} />
                </div>
              </div>
            ) : this.state.showId === "2" ? (
              <div className="row">
                <div className="col-12">
                  <SalesStatisticFarmer
                    salesStatisticData={this.state.salesStatisticData}
                    fertilizer={this.state.fertilizer}
                  />
                </div>
              </div>
            ) : (
              this.state.showId === "3" && (
                <div className="row">
                  <div className="col-12">
                    <OrdersStatistic totalOrders={this.state.totalOrders} />
                  </div>
                </div>
              )
            )
          ) : (
            <div className="row">
              <div className="col-12">
                <SalesStatisticlient />
              </div>
            </div>
          )}

          {this.state.user.type === "Farmer"
            ? this.state.showId === "0" && (
                <div className="row">
                  <div className="col-12">
                    <Weather />
                  </div>
                </div>
              )
            : null}
        </div>
      </div>
    );
  }
}

export default Dashboard;
