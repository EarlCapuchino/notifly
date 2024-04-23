import React from "react";
import { MDBCol, MDBContainer, MDBIcon, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { THEME } from "../../../../redux/slices/persons/auth";

const SettingsTheme = () => {
  const { theme } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  return (
    <MDBCol className="custom-notification-container position-relative pb-4 mx-5">
      <MDBIcon
        onClick={() => dispatch(THEME(!theme.dark))}
        icon={theme.icon}
        size="lg"
        className={`custom-notification-icon ${theme.bg} ${theme.text} border border-${theme.border} cursor-pointer`}
      />
      <MDBContainer className="ms-5 p-0">
        <MDBTypography
          tag="h6"
          className={`custom-notification-title fw-bold p-0 w-0 ${theme.text} text-capitalize`}
        >
          {theme.color} theme
        </MDBTypography>
        <p className={`custom-notification-label p-0 w-0 ${theme.text}`}>
          Click the icon to toggle {theme.reverse} theme.
        </p>
      </MDBContainer>
    </MDBCol>
  );
};

export default SettingsTheme;
