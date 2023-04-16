import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBTypography,
} from "mdb-react-ui-kit";

const DashboardStatistics = ({ icon, color, title, texts }) => {
  return (
    <MDBCol md={4} className="my-1 my-md-3">
      <MDBCard className={`bg-${color} text-white`}>
        <MDBCardBody className="pt-0">
          <MDBIcon size="2x" icon={icon} className="mt-4" />
          <MDBTypography tag="h4" className="font-weight-bold mt-2">
            {title}
          </MDBTypography>
          <small>{texts.join(", ")}</small>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default DashboardStatistics;
