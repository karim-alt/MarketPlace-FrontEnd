import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import axios from "axios";
import WeatherWidget from "./components/WeatherWidget";
// import styled from "styled-components";
import "moment/locale/ar";
import "moment/locale/fr";
import SearchBox from "components/SearchBox";
import IntlMessages from "util/IntlMessages";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecast: null,
      search: "",
      location: "",
    };
    // console.log("init", this.state.forecast);
  }
  getPosition = () => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  componentDidMount() {
    let lang = this.props.locale.locale;
    let url =
      "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?" +
      "q=Rabat&units=metric&lang=" +
      lang +
      "&appid=ccb0d96c804bb1ab40c45f6543e818f3";
    axios
      .get(url)
      .then((response) => {
        this.setState({
          forecast: response.data.list.map((data) => ({
            dt: data.dt,
            temp: data.main.temp,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            humidity: data.main.humidity,
            icon: data.weather[0].icon,
            desc: data.weather[0].description,
            clouds: data.clouds.all,
            wind: data.wind.speed,
          })),
          location: response.data.city.name,
        });
        // console.log("this.state.forecast", this.state.forecast);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleGeo = (e) => {
    e.preventDefault();
    this.setState({ search: "" });
    this.getPosition()
      .then((position) => {
        NotificationManager.info("It may take a few seconds!", "info");
        let lang = this.props.locale.locale;
        let url =
          "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?lat=" +
          position.coords.latitude +
          "&lon=" +
          position.coords.longitude +
          "&units=metric&lang=" +
          lang +
          "&appid=ccb0d96c804bb1ab40c45f6543e818f3";

        axios
          .get(url)
          .then((response) => {
            this.setState({
              forecast: response.data.list.map((data) => ({
                dt: data.dt,
                temp: data.main.temp,
                temp_min: data.main.temp_min,
                temp_max: data.main.temp_max,
                humidity: data.main.humidity,
                icon: data.weather[0].icon,
                desc: data.weather[0].description,
                clouds: data.clouds.all,
                wind: data.wind.speed,
              })),
              location: response.data.city.name,
            });
          })
          .catch(function (error) {
            console.log(error);
            NotificationManager.error("City not found!", "Error");
          });
      })
      .catch((err) => {
        console.log(err.message);
        NotificationManager.error(
          "Your geolocation is disabled, please enable it first!",
          "Error"
        );
      });
  };

  handleClick = (e) => {
    e.preventDefault();
    if (this.state.search !== "") {
      NotificationManager.info("It may take a few seconds!", "info");
      let lang = this.props.locale.locale;
      let url =
        "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" +
        this.state.search +
        "&units=metric&lang=" +
        lang +
        "&appid=ccb0d96c804bb1ab40c45f6543e818f3";
      axios
        .get(url)
        .then((response) => {
          this.setState({
            forecast: response.data.list.map((data) => ({
              dt: data.dt,
              temp: data.main.temp,
              temp_min: data.main.temp_min,
              temp_max: data.main.temp_max,
              humidity: data.main.humidity,
              icon: data.weather[0].icon,
              desc: data.weather[0].description,
              clouds: data.clouds.all,
              wind: data.wind.speed,
            })),
            location: this.state.search,
          });
          // console.log("this.state.forecast", this.state.forecast);
        })
        .catch(function (error) {
          console.log(error);

          NotificationManager.error("City not found!", "Error");
        });
    } else
      NotificationManager.error("You must write the city name first!", "Error");
  };
  render() {
    // console.log("courant", this.state.forecast);
    const { locale } = this.props;
    return (
      <div className="jr-card animated slideInUpTiny animation-duration-10">
        <div style={{ marginLeft: "1px" }}>
          <div>
            <NotificationContainer />
          </div>
          <div className="row justify-content-md-center">
            <div className="col-md-3">
              <SearchBox
                placeholder="..."
                onChange={(event) =>
                  this.setState({ search: event.target.value })
                }
                value={this.state.search}
              />
            </div>
            <div style={{ marginLeft: "0px" }}>
              <Button
                color="primary"
                variant="contained"
                className="jr-btn jr-btn-sm "
                onClick={this.handleClick}
              >
                <IntlMessages id="chat.search" />
              </Button>
              <IntlMessages id="chat.or" />
              <Button
                color="primary"
                className="jr-btn jr-btn-sm "
                onClick={this.handleGeo}
              >
                <IntlMessages id="chat.position" />
              </Button>
            </div>
          </div>

          {this.state.location === "" ? (
            <WeatherWidget
              config={{
                location: this.state.location,
                unit: "metric",
                locale: locale.locale,
              }}
              forecast={this.state.forecast}
            />
          ) : (
            <WeatherWidget
              config={{
                location: this.state.location,
                unit: "metric",
                locale: locale.locale,
              }}
              forecast={this.state.forecast}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { locale } = settings;
  return { locale };
};
export default connect(mapStateToProps)(App);
