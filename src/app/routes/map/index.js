import React, { Component } from "react";

import DrawingExampleGoogleMap from "../components/routes/dialogs/recommandetion";

export default class DrawingView extends Component {
  render() {
    return (
      <div style={{ height: " 100%", margin: 0, padding: 0 }}>
        <div style={{ height: "inherit" }}>
          <DrawingExampleGoogleMap
            containerElement={
              <div className="embed-responsive embed-responsive-21by9" />
            }
            mapElement={<div className="embed-responsive-item" />}
          />
        </div>
      </div>
    );
  }
}
