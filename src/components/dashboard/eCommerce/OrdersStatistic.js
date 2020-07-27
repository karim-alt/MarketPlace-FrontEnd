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
import { data } from "./data";
import axios from "axios";

class SalesStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: jwt_decode(localStorage.jwtToken),
      Data: [],
      groupedData: [],
      nameOrd: null,
      Approved: null,
      OnHold: null,
    };
  }
  sortByMonth(arr) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    arr.sort(function (a, b) {
      return months.indexOf(a.name) - months.indexOf(b.name);
    });
  }
  componentDidMount() {
    let url = "http://localhost:5000/api/orders/myOrders/";

    axios
      .get(url + this.state.user.id)
      .then((response) => {
        let d = null;
        let name = [];
        let Approved = [];
        let OnHold = [];
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let help = 0;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].Type !== this.state.user.type) {
            if (response.data[i].status === true) {
              d = new Date(response.data[i].date);
              name[help] = monthNames[d.getMonth()];
              console.log("name[" + help + "]", name[help]);
              if (this.state.user.type === "Farmer") {
                Approved[help] =
                  response.data[i].price *
                  response.data[i].Qty.slice(
                    0,
                    response.data[i].Qty.length - 2
                  );

                console.log("Approved[" + help + "]", Approved[help]);
              } else {
                Approved[help] = response.data[i].price * response.data[i].Qty;
              }
              OnHold[help] = 0;
            } else {
              d = new Date(response.data[i].date);
              name[help] = monthNames[d.getMonth()];
              console.log("name[" + help + "]", name[help]);
              if (this.state.user.type === "Farmer") {
                OnHold[help] =
                  response.data[i].price *
                  response.data[i].Qty.slice(
                    0,
                    response.data[i].Qty.length - 2
                  );

                console.log("OnHold[" + help + "]", OnHold[help]);
              } else {
                OnHold[help] = response.data[i].price * response.data[i].Qty;
              }
              Approved[help] = 0;
            }
            help++;
          }
        }
        this.setState({ name: name, Approved: Approved, OnHold: OnHold });
        for (let j = 0; j < name.length; j++) {
          this.setState({
            Data: this.state.Data.concat({
              name: this.state.name[j],
              Approved: this.state.Approved[j],
              OnHold: this.state.OnHold[j],
            }),
          });
        }
        console.log(this.state.Data);
        // Array.from(
        //   this.state.Data.reduce(
        //     (m, { name, v }) => m.set(name, (m.get(name) || 0) + v),
        //     new Map()
        //   ).entries(),
        //   ([name, v]) => ({ name, v })
        // );
        let groupedData = this.state.Data.reduce((acc, obj) => {
          var existItem = acc.find((item) => item.name === obj.name);
          if (existItem) {
            existItem.Approved += obj.Approved;
            existItem.OnHold += obj.Approved;
            return acc;
          }
          acc.push(obj);
          return acc;
        }, []);

        this.sortByMonth(groupedData);
        this.setState({ groupedData: groupedData });
        console.log("grouped orders", groupedData);
      })
      .catch(function (error) {
        console.log(error);
      });
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
                data={this.state.groupedData}
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
