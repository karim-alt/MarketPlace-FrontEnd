import React from "react";
import List from "@material-ui/core/List";
import ContainerHeader from "components/ContainerHeader";
import ProductListItem from "components/marketPlace/ProductListItem";
import SearchBox from "components/SearchBox";
import AddAProduct from "../components/routes/dialogs/addAProductDialog";
import AddFProduct from "../components/routes/dialogs/addFProductDialog";
import axios from "axios";
import jwt_decode from "jwt-decode";
import IntlMessages from "util/IntlMessages";

class ProductsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      products: [],
      user: jwt_decode(localStorage.jwtToken),
    };
  }
  componentDidMount() {
    let url = "http://localhost:5000/api/fertilized_products/myStore/";

    if (this.state.user.type === "Farmer")
      url = "http://localhost:5000/api/agricultural_products/myStore/";
    axios
      .get(url + this.state.user.id)
      .then((response) => {
        this.setState({ products: response.data });
        // console.log("response.data", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    let url = "http://localhost:5000/api/fertilized_products/myStore/";
    // console.log("decoded.id", decoded.id);
    if (this.state.user.type === "Farmer")
      url = "http://localhost:5000/api/agricultural_products/myStore/";
    axios
      .get(url + this.state.user.id)
      .then((response) => {
        this.setState({ products: response.data });
        // console.log("response.data", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  render() {
    const { search } = this.state;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.store" />}
          />
          <div className="row">
            <div
              className="col-md-3"
              style={{
                display: "inline-block",
                margin: "0 auto",
              }}
            >
              <div className="mb-2">
                <SearchBox
                  placeholder="Search.."
                  onChange={(e) => this.searchSpace(e)}
                  value={search}
                />
              </div>
            </div>
            <div style={{ marginRight: "16px" }}>
              {this.state.user.type === "Farmer" ? (
                <AddAProduct />
              ) : (
                <AddFProduct />
              )}
            </div>
          </div>
          <div className="animated slideInUpTiny animation-duration-3">
            <List>
              {this.state.products
                .filter((data) => {
                  if (search == null) return data;
                  else if (
                    data.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return data;
                  } else if (
                    data.prix
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return data;
                  }
                })
                .map((product, index) => {
                  return <ProductListItem key={index} product={product} />;
                })}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductsList;
