import React, { Component } from "react";

import axios from "axios";
import WeatherWidget from "./components/WeatherWidget";
import "moment/locale/ar";
import "moment/locale/fr";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecast: null
    };
    // console.log("init", this.state.forecast);
  }

  componentDidMount() {
    let url =
      "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=Rabat&units=metric&lang=en&appid=ccb0d96c804bb1ab40c45f6543e818f3";
    axios
      .get(url)
      .then(response => {
        this.setState({
          forecast: response.data.list.map(data => ({
            dt: data.dt,
            temp: data.main.temp,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            humidity: data.main.humidity,
            icon: data.weather[0].icon,
            desc: data.weather[0].description,
            clouds: data.clouds.all,
            wind: data.wind.speed
          }))
        });
        // console.log("this.state.forecast", this.state.forecast);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    // console.log("courant", this.state.forecast);
    return (
      <div>
        <WeatherWidget
          config={{ location: "Rabat", unit: "metric", locale: "en" }}
          forecast={this.state.forecast}
        />
      </div>
    );
  }
}

export default App;
