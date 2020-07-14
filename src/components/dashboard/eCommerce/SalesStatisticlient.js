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
import { salesStatisticData } from "../../../app/routes/dashboard/Listing/agriData";

class SalesStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Barley",
    };
  }
  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };
  render() {
    return (
      <div className="jr-card animated slideInUpTiny animation-duration-10">
        <div className="jr-card-header " style={{ textAlign: "center" }}>
          <h3>INTERNATIONAL COMMODITY PRICES US$/Q</h3>
          <div className="row justify-content-md-center">
            <div className="col-md-4 col-12">
              <select
                className="form-control form-control-lg"
                placeholder="product.."
                value={this.state.name}
                onChange={this.handleChange}
              >
                <option value="Barley">Barley</option>
                <option value="Corn">Corn</option>
                <option value="Rice">Rice</option>
                <option value="Rye">Rye</option>
                <option value="Wheat">Wheat</option>
                <option value="Cacao">Cacao</option>
                <option value="Coffee">Coffee</option>
                <option value="Cotton">Cotton</option>
                <option value="Cottonseed">Cottonseed</option>
                <option value="Palm Oil">Palm Oil</option>
                <option value="Sugar">Sugar</option>
                <option value="Tea">Tea</option>
                <option value="Tabacco">Tabacco</option>
                <option value="Wool">Wool</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-12 mb-5 mb-lg-1">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={salesStatisticData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="Year" />
                <YAxis type="number" domain={[0, 120]} />
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
                  dataKey={this.state.name}
                  strokeWidth={2}
                  stroke="#6F82E5"
                  fill="url(#salesStatistic)"
                />
              </AreaChart>
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
