import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBNavbarItem,
  MDBCol,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
// import SettingsTheme from "./theme";
import SettingsMaxPage from "./maxPage";

const NavbarSettings = () => {
  const [visibility, setVisibility] = useState(false),
    { theme } = useSelector(state => state.auth),
    [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function debounce(fn, ms) {
      let timer;

      return _ => {
        clearTimeout(timer);

        timer = setTimeout(_ => {
          timer = null;

          fn.apply(this, arguments);
        }, ms);
      };
    }

    const debounceResize = debounce(() => setWidth(window.innerWidth), 500);

    window.addEventListener("resize", debounceResize);

    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  const handleWidth = () => {
    if (width > 1400) {
      return "30%";
    } else if (width > 1200) {
      return "40%";
    } else if (width > 1000) {
      return "50%";
    } else if (width > 800) {
      return "60%";
    } else if (width > 600) {
      return "75%";
    } else {
      return "100%";
    }
  };

  return (
    <>
      <MDBNavbarItem className={theme.text}>
        <MDBTooltip tag="span" wrapperClass="d-inline-block" title="Settings">
          <MDBBtn
            onClick={setVisibility}
            value={true}
            size="sm"
            color="transparent"
            className="shadow-0"
          >
            <MDBIcon icon="cogs" size="lg" className="custom-navbar-icon" />
          </MDBBtn>
        </MDBTooltip>
      </MDBNavbarItem>

      <MDBCol
        className={`custom-notification-modal ${theme.bg} ${
          visibility && "notification-modal-active"
        }`}
        style={{
          width: handleWidth(),
        }}
      >
        <MDBCol className="d-flex align-items-center justify-content-between px-3 py-3">
          <h4 className={`font-poppins fw-bold h4 h4-responsive ${theme.text}`}>
            Settings
          </h4>
          <MDBIcon
            onClick={() => setVisibility(!visibility)}
            icon="times"
            size="1x"
            className={`custom-notification-close p-3 cursor-pointer ${theme.text}`}
          />
        </MDBCol>
        {/* <SettingsTheme /> */}
        <SettingsMaxPage />
      </MDBCol>
      <MDBCol
        className={`custom-notification-overlay ${
          visibility && "custom-notification-overlay-active"
        }`}
        onClick={() => setVisibility(!visibility)}
      ></MDBCol>
    </>
  );
};

export default NavbarSettings;
