import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IntlMessages from "util/IntlMessages";
import { NavLink, withRouter } from "react-router-dom";

class CardMenu extends React.Component {
  render() {
    // const options = [
    //   <IntlMessages id="popup.updateData" />,
    //   <IntlMessages id="popup.detailedLog" />
    // ];
    const { menuState, anchorEl, handleRequestClose } = this.props;
    return (
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={menuState}
        onClose={handleRequestClose}
        MenuListProps={{
          style: {
            width: 150,
            paddingTop: 0,
            paddingBottom: 0
          }
        }}
      >
        {/* {options.map(option => ( */}
        <MenuItem onClick={handleRequestClose}>
          <NavLink to="/app/orders">
            {" "}
            <IntlMessages id="popup.detailedLog" />
          </NavLink>
        </MenuItem>
        {/* ))} */}
      </Menu>
    );
  }
}

export default withRouter(CardMenu);
