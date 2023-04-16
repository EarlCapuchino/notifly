import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBNavbarItem,
  MDBBadge,
  MDBCol,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import UserApprovalCard from "./card/user";
import StoreApprovalCard from "./card/store";

const NavbarNotifications = () => {
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
        <MDBBtn
          onClick={setVisibility}
          value={true}
          size="sm"
          color="transparent"
          className="shadow-0"
        >
          <MDBIcon icon="bell" size="lg" className="custom-navbar-icon" />
          <MDBBadge color="primary" className="mb-1" dot />
        </MDBBtn>
      </MDBNavbarItem>

      <MDBCol
        className={`custom-notification-modal ${theme.bg} ${
          visibility && "notification-modal-active"
        }`}
        style={{
          width: handleWidth(),
        }}
      >
        <MDBCol className="d-flex align-items-center justify-content-between px-4 pt-4 pb-5">
          <h4 className={`font-poppins fw-bold h4 h4-responsive ${theme.text}`}>
            Notifications
          </h4>
          <MDBIcon
            onClick={() => setVisibility(!visibility)}
            icon="times"
            size="1x"
            className={`custom-notification-close p-3 cursor-pointer ${theme.text}`}
          />
        </MDBCol>

        <UserApprovalCard theme={theme} />
        <StoreApprovalCard theme={theme} />
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

export default NavbarNotifications;
