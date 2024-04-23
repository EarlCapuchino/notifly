import React from "react";
import { MDBCol, MDBContainer, MDBIcon } from "mdb-react-ui-kit";
const UserApprovalCard = ({ theme }) => {
  return (
    <MDBCol className="custom-notification-container position-relative pb-4 mx-5">
      <MDBIcon
        icon="user-check"
        size="lg"
        className="custom-notification-icon"
      />
      <MDBContainer className="ms-5 p-0">
        <h6
          className={`h6 h6-responsive custom-notification-title fw-bold p-0 w-0 ${theme.text} cursor-pointer`}
        >
          Username is waiting for your approval.
        </h6>
        <p className={`custom-notification-label p-0 w-0 ${theme.text}`}>
          Added at 4:23 PM by
        </p>
      </MDBContainer>
    </MDBCol>
  );
};

export default UserApprovalCard;
