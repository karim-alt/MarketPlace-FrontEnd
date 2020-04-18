import React from "react";
import ContainerHeader from "components/ContainerHeader";
import ProductGridItem from "components/marketPlace/ProductGridItem";
import SearchBox from "components/SearchBox";
import axios from "axios";
import jwt_decode from "jwt-decode";
class ProductsGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      user: jwt_decode(localStorage.jwtToken),
      products: []
    };
  }
  componentDidMount() {
    let url = "http://localhost:5000/api/fertilized_products";
    if (this.state.user.type === "Client") {
      url = "http://localhost:5000/api/agricultural_products";
    }
    axios
      .get(url)
      .then(response => {
        this.setState({ products: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    let url = "http://localhost:5000/api/fertilized_products";
    if (this.state.user.type === "Client") {
      url = "http://localhost:5000/api/agricultural_products";
    }
    axios
      .get(url)
      .then(response => {
        this.setState({ products: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  searchSpace = event => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
    // console.log("keyword :", keyword);
  };
  render() {
    const { search } = this.state;
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title="MarketPlace" />
        <div className="row">
          <div
            className="col-md-3"
            style={{
              display: "inline-block",
              margin: "0 auto"
            }}
          >
            <div className="mb-3">
              <SearchBox
                placeholder="Search.."
                onChange={e => this.searchSpace(e)}
                value={search}
              />
            </div>
          </div>
        </div>
        <div className="row animated slideInUpTiny animation-duration-3">
          {this.state.products
            .filter(data => {
              if (this.state.search == null) return data;
              else if (
                data.name
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase())
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
              return <ProductGridItem key={index} product={product} />;
            })}
        </div>
      </div>
    );
  }
}

export default ProductsGrid;
