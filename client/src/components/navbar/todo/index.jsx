import React from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBNavbarItem,
  MDBBadge,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
  MDBModalHeader,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { useState } from "react";

const NavbarTodo = () => {
  const [visibility, setVisibility] = useState(false);
  const { theme } = useSelector(state => state.auth);

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
          <MDBIcon
            icon="clipboard-check"
            size="lg"
            className="custom-navbar-icon"
          />
          <MDBBadge color="primary" className="mb-1" dot />
        </MDBBtn>
      </MDBNavbarItem>
      <MDBModal
        backdrop={false}
        tabIndex="-1"
        show={visibility}
        setShow={setVisibility}
        className="custom-backdrop"
      >
        <MDBModalDialog centered>
          <MDBModalContent className={`${theme.bg} ${theme.text}`}>
            <MDBModalHeader>Todo</MDBModalHeader>
            <MDBModalBody>asdf</MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default NavbarTodo;
