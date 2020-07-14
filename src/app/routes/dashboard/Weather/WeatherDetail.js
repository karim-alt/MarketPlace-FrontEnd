import React, { Component } from "react";
// import { weatherData } from "./weatherData";
import moment from "moment";
// import CardLayout from "../CardLayout";
import { connect } from "react-redux";
import { switchLanguage } from "actions/Setting";
import axios from "axios";
class WeatherDetail extends Component {
  constructor() {
    super();
    this.state = {
      city: "",
      list: "",
    };
  }
  componentDidMount() {
    let lang = this.props.locale.locale;
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=Rabat&units=metric&lang=" +
          lang +
          "&appid=ccb0d96c804bb1ab40c45f6543e818f3"
      )
      .then((response) => {
        this.setState({ city: response.data.city, list: response.data.list });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { city, list } = this.state;
    if (!city) {
      return (
        <div className={bgColorClass}>
          <div className="jr-card-header text-white mt-0">
            <div style={{ margin: "10px" }}>
              <h2 className="card-heading">Rabat</h2>
              <p style={{ fontSize: "13px" }}>Thursday 9:00 pm, clear sky</p>
            </div>

            <div className="temp-section">
              <h2 className="temp-point">
                16.8
                <small>
                  <sup>
                    <sup>°</sup>C
                  </sup>
                </small>
              </h2>
              <div className="pl-2 pl-md-4">
                <i className={"detail-icon wi wi-owm-800"} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // TODO: refactoring this code...

    let bgColorClass = "detail-weather-widget ";
    // Set the background colour based on the temperature
    if (list[0].main.temp.toFixed(1) >= 30) {
      bgColorClass += "very-warm";
    } else if (
      list[0].main.temp.toFixed(1) > 20 &&
      list[0].main.temp.toFixed(1) < 30
    ) {
      bgColorClass += "warm";
    } else if (
      list[0].main.temp.toFixed(1) > 10 &&
      list[0].main.temp.toFixed(1) < 20
    ) {
      bgColorClass += "normal";
    } else if (
      list[0].main.temp.toFixed(1) > 0 &&
      list[0].main.temp.toFixed(1) < 10
    ) {
      bgColorClass += "cold";
    } else if (list[0].main.temp.toFixed(1) <= 0) {
      bgColorClass += "very-cold";
    }
    let lang = this.props.locale.locale;
    return (
      <div className={bgColorClass}>
        <div className="jr-card-header text-white mt-0">
          <div style={{ margin: "10px" }}>
            <h2 className="card-heading">{city.name}</h2>
            <p style={{ fontSize: "13px" }}>{`${moment
              .unix(list[0].dt)
              .locale(lang)
              .format("dddd h:mm a")}, ${list[0].weather[0].description}`}</p>
          </div>

          <div className="temp-section">
            <h2 className="temp-point">
              {list[0].main.temp.toFixed(1)}
              <small>
                <sup>
                  <sup>°</sup>C
                </sup>
              </small>
            </h2>
            <div className="pl-2 pl-md-4">
              <i className={"detail-icon wi wi-owm-" + list[0].weather[0].id} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ settings }) => {
  const { locale } = settings;
  return { locale };
};

export default connect(mapStateToProps, {
  switchLanguage,
})(WeatherDetail);
