import React from "react";

const CardLayout = ({ children, styleName, childrenStyle }) => {
  return (
    <div
      className={`card`}
      style={{ backgroundColor: "grey" }}
      width="100%"
      height={110}
    >
      {children}
    </div>
  );
};

export default CardLayout;
