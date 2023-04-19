import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE } from "../../../../redux/slices/persons/members";

export default function PostModal({
  visibility,
  setVisibility,
  member,
  clusters,
}) {
  const { theme, token } = useSelector(({ auth }) => auth);

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>View Cluster</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>hello</MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => setVisibility({ visibility: false, create: true })}
            >
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
