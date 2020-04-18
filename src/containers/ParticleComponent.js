import React from "react";
import Particles from "react-particles-js";
import paramsParticles from "./particles.json";

export default () => (
  <div className="bg-image">
    <Particles params={paramsParticles} />
  </div>
);
