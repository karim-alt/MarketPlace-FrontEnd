import React from "react";
import ContainerHeader from "components/ContainerHeader";
import ProductGridItem from "components/marketPlace/ProductGridItem";
import SearchBox from "components/SearchBox";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import IntlMessages from "util/IntlMessages";
class ProductsGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      user: jwt_decode(localStorage.jwtToken),
      products: [],
      type: "name",
    };
  }
  handleChange = (e) => {
    this.setState({ type: e.target.value });
  };

  componentDidMount() {
    let url = "http://localhost:5000/api/fertilized_products/country/";
    if (this.state.user.type === "Client") {
      url = "http://localhost:5000/api/agricultural_products/country/";
    }
    axios
      .get(url + this.state.user.country)
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    let url = "";
    if (this.state.user.type === "Farmer") {
      url = "http://localhost:5000/api/fertilized_products/country/";
      axios
        .get(url + this.state.user.country)
        .then((response) => {
          this.setState({ products: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (this.state.user.type === "Client") {
      url = "http://localhost:5000/api/agricultural_products/country/";
      axios
        .get(url + this.state.user.country)
        .then((response) => {
          this.setState({ products: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .get("http://localhost:5000/api/fertilized_products")
        .then((response) => {
          this.setState({ products: response.data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
    // console.log("keyword :", keyword);
  };
  average = (array) => array.reduce((a, b) => a + b) / array.length;
  render() {
    const { search } = this.state;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.marketPlace" />}
          />
          <div className="row justify-content-md-center">
            <div className="mb-3">
              <SearchBox
                placeholder="..."
                onChange={(e) => this.searchSpace(e)}
                value={search}
              />
            </div>

            <div style={{ marginLeft: "30px" }}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="type"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleChange}
                >
                  <FormControlLabel
                    value="name"
                    control={<Radio color="primary" />}
                    label={<IntlMessages id="appModule.wname" />}
                  />
                  <FormControlLabel
                    value="price"
                    control={<Radio color="primary" />}
                    label={<IntlMessages id="appModule.wprice" />}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          {this.state.type === "name" ? (
            <div className="row animated slideInUpTiny animation-duration-3">
              {this.state.products
                .filter((data) => {
                  if (this.state.search == null) return data;
                  else if (
                    data.name
                      .toLowerCase()
                      .includes(this.state.search.toLowerCase())
                  ) {
                    return data;
                  }
                })
                .map((product, index) => {
                  return <ProductGridItem key={index} product={product} />;
                })}
            </div>
          ) : this.state.type === "price" ? (
            <div className="row animated slideInUpTiny animation-duration-3">
              {this.state.products
                .filter((data) => {
                  if (this.state.search == null) return data;
                  else if (
                    data.prix
                      .toString()
                      .toLowerCase()
                      .includes(this.state.search.toString().toLowerCase())
                  ) {
                    return data;
                  }
                })
                .map((product, index) => {
                  return <ProductGridItem key={index} product={product} />;
                })}
            </div>
          ) : this.state.type === "rating" ? (
            <div className="row animated slideInUpTiny animation-duration-3">
              {this.state.products
                .filter((data) => {
                  if (this.state.search == null) return data;
                  else if (
                    data.name
                      .toLowerCase()
                      .includes(this.state.search.toLowerCase())
                  ) {
                    return data;
                  }
                })
                .map((product, index) => {
                  return <ProductGridItem key={index} product={product} />;
                })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ProductsGrid;
