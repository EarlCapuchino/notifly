import React from "react";
import { MDBCol, MDBContainer, MDBTypography } from "mdb-react-ui-kit";
import { BASE, ErrorPage } from "../../../components/utilities";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ErrorNull() {
  const { auth } = useSelector(({ auth }) => auth),
    navigate = useNavigate();

  const handleRedirect = () => {
    if (auth._id) {
      navigate(`/${BASE}/dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <MDBContainer
      className="error-page d-flex align-items-center min-height"
      style={{ background: "#f6e7d8" }}
      fluid
    >
      <MDBCol
        md={6}
        sm={10}
        size={12}
        className="offset-md-3 offset-sm-1 text-center"
      >
        <img
          src={ErrorPage}
          alt="Error 404"
          className="w-75"
          draggable={false}
        />
        <MDBTypography tag="h5" className="mb-0 mt-3">
          Click&nbsp;
          <u className="text-info cursor-pointer" onClick={handleRedirect}>
            here
          </u>
          &nbsp;to go back home!
        </MDBTypography>
      </MDBCol>
    </MDBContainer>
  );
}
