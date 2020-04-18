import React from "react";
// import fr from "../../assets/flags/france.png";
// import ar from "../../assets/flags/arabia.png";
// import us from "../../assets/flags/usa.png";
const LanguageItem = ({ language, switchLanguage, handleRequestClose }) => {
  const { icon, name } = language;
  return (
    <li
      className="pointer"
      onClick={() => {
        handleRequestClose();
        switchLanguage(language);
      }}
    >
      <div className="d-flex align-items-center">
        {/* {icon === "fr" ? (
          <img src={fr} style={{ height: "25px", width: "25px" }} />
        ) : icon === "sa" ? (
          <img src={ar} style={{ height: "25px", width: "25px" }} />
        ) : (
          <img src={us} style={{ height: "25px", width: "25px" }} />
        )} */}

        <i className={`flag ${icon}`} />
        <h4 className="mb-0 ml-2">{name}</h4>
      </div>
    </li>
  );
};

export default LanguageItem;
