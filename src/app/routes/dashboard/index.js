import React from "react";
import ContainerHeader from "components/ContainerHeader/index";
import WeatherDetail from "components/MyWeather/index";

class Dashboard extends React.Component {
  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader
          match={this.props.match}
          title="Dashboard"
          // {<IntlMessages id="sidebar.dashboard.ecommerce" />}
        />
        <div className="row">
          <div className="col-12">
            <WeatherDetail />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
