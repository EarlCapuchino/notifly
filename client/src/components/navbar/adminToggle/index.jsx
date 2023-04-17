import React from "react";
import { MDBBtn, MDBIcon, MDBNavbarItem, MDBTooltip } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ADMIN } from "../../../redux/slices/persons/auth";

export default function NavbarAdminToggle() {
  const { theme, isAdmin } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handlePassword = async () => {
    if (isAdmin) {
      Swal.fire({
        icon: "question",
        title: "Are you sure?",
        html: `You are about to <b>TURN OFF ADMIN MODE</b>`,
        showCancelButton: true,
        confirmButtonText: "Proceed",
      }).then(result => {
        if (result.isConfirmed) {
          dispatch(ADMIN());
          toast.info("Admin mode off!");
        }
      });
    } else {
      const { value: code } = await Swal.fire({
        title: "Enter secret password",
        input: "password",
        inputValidator: value => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      if (code) {
        if (code === "password") {
          dispatch(ADMIN());
          toast.info("Admin mode on!");
        } else {
          toast.warn("Invalid secret password!");
        }
      }
    }
  };

  return (
    <MDBNavbarItem className={theme.text}>
      <MDBTooltip
        tag="span"
        wrapperClass="d-inline-block"
        title={isAdmin ? "Admin Mode Off" : "Admin Mode On"}
      >
        <MDBBtn
          onClick={handlePassword}
          value={true}
          size="sm"
          color="transparent"
          className="shadow-0"
        >
          <MDBIcon
            icon={isAdmin ? "user-times" : "user-cog"}
            size="lg"
            className="custom-navbar-icon"
          />
        </MDBBtn>
      </MDBTooltip>
    </MDBNavbarItem>
  );
}
