import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import IntlMessages from "util/IntlMessages";
// import { salesStatisticData } from "../../../app/routes/dashboard/Listing/data";

class SalesStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      fertilizer: [],
      salesStatisticData: null,
      name: [],
      price: [],
    };
  }
  handleChange = (e) => {
    this.setState({ id: e.target.value });
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
        let id = this.state.id;
        // console.log(id);
        for (let j = 0; j < keys.length; j++) {
          value.push(response.data[id][keys[j]]);
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
        console.log(this.state.salesStatisticData);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({ salesStatisticData: [] });
  };
  render() {
    return (
      <div className="jr-card animated slideInUpTiny animation-duration-10">
        <div className="jr-card-header " style={{ textAlign: "center" }}>
          <h3>
            <IntlMessages id="appModule.sales" />
          </h3>{" "}
          <div className="row justify-content-md-center">
            <div className="col-md-4 col-12">
              <select
                className="form-control form-control-lg"
                placeholder="Unit.."
                value={this.state.id}
                onChange={this.handleChange}
              >
                {this.props.fertilizer.map((fert, index) => {
                  return (
                    <option key={index} value={index}>
                      {fert}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-12 mb-5 mb-lg-1">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={this.state.salesStatisticData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="names" />
                <YAxis type="number" domain={[0, 490]} />
                <CartesianGrid strokeDasharray="0" stroke="#DCDEDE" />
                <Tooltip />
                <defs>
                  <linearGradient
                    id="salesStatistic"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4258BC" stopOpacity={1} />
                    <stop offset="95%" stopColor="#FFF" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="price"
                  strokeWidth={2}
                  stroke="#6F82E5"
                  fill="url(#salesStatistic)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default SalesStatistic;
