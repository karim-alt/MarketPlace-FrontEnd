import React, { Component } from "react";
import OrderTableCell from "./OrderTableCell";
import IntlMessages from "util/IntlMessages";
import ContainerHeader from "components/ContainerHeader";
import SearchBox from "components/SearchBox";
import axios from "axios";
import jwt_decode from "jwt-decode";

class OrderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      user: jwt_decode(localStorage.jwtToken),
      orders: []
    };
  }

  componentDidMount() {
    let url = "http://localhost:5000/api/orders/myOrders/";
    axios
      .get(url + this.state.user.id)
      .then(response => {
        this.setState({ orders: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // componentDidUpdate() {
  //   let url = "http://localhost:5000/api/orders/myOrders/";
  //   axios
  //     .get(url + this.state.user.id)
  //     .then(response => {
  //       this.setState({ orders: response.data });
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }

  searchSpace = event => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  render() {
    const { search } = this.state;
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title="Orders" />

        <div className="animated slideInUpTiny animation-duration-3">
          <div className="row mb-md-3">
            <div className="col-12">
              <div className="jr-card">
                <div className="jr-card-header d-flex align-items-center">
                  <h3 className="mb-0">
                    <IntlMessages id="table.recentOrders" />
                  </h3>
                  <div className="col-md-3">
                    <SearchBox
                      placeholder="Search.."
                      onChange={e => this.searchSpace(e)}
                      value={search}
                    />
                  </div>
                </div>
                <div className="table-responsive-material">
                  <table className="default-table table-unbordered table table-sm table-hover">
                    <thead className="th-border-b">
                      <tr>
                        <th>Product Name</th>
                        <th>
                          {this.state.user.type === "Farmer" ||
                          this.state.user.type === "Provider"
                            ? "Customer"
                            : null}
                        </th>
                        <th>
                          {this.state.user.type === "Farmer" ||
                          this.state.user.type === "Provider"
                            ? "Phone number"
                            : null}
                        </th>
                        <th>
                          Quantity (
                          {this.state.user.type === "Farmer"
                            ? " Kg"
                            : this.state.user.type === "Provider"
                            ? " bag"
                            : null}
                          )
                        </th>
                        <th>Price (dh)</th>
                        <th>Order Date </th>

                        {/* <th className="status-cell text-right"> */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.orders
                        .filter(order => {
                          if (search == null) return order;
                          else if (
                            order.productName
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return order;
                          } else if (
                            order.buyerPhone
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return order;
                          } else if (
                            order.buyerName
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return order;
                          }
                        })
                        .map((order, index) => {
                          if (order.Type !== this.state.user.type)
                            return <OrderTableCell key={index} order={order} />;
                          else return null;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderTable;
