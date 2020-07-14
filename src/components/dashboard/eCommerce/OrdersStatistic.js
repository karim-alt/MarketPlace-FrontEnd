import React from "react";
// import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import IntlMessages from "util/IntlMessages";
// import { salesStatisticData } from "../../../app/routes/dashboard/Listing/data";
import { data } from "./data";
class SalesStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: jwt_decode(localStorage.jwtToken),
    };
  }

  render() {
    return (
      <div className="jr-card animated slideInUpTiny animation-duration-10">
        {/* <div
          className="jr-card-header d-flex align-items-center"
          // style={{ textAlign: "center" }}
        >
          <h3 className="mb-0">Sales Statistic</h3>
        </div> */}
        <div className="row justify-content-md-center">
          <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <span className="d-flex align-items-center mb-2">
              <i className="zmdi zmdi-calendar text-muted chart-f20" />
              <span className="ml-3 text-dark">{this.props.totalOrders}</span>
            </span>
            <p className="text-muted">
              <IntlMessages id="dashboard.totalOrders" />
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-12 mb-5 mb-lg-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Approved" fill="#3367d6" />
                <Bar dataKey="OnHold" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* <div className="col-lg-5 col-12">
          <ResponsiveContainer width="100%">
            <SalesGauge />
          </ResponsiveContainer>
        </div> */}
        </div>
      </div>
    );
  }
}

export default SalesStatistic;
