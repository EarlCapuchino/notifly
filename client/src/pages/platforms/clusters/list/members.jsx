import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function ViewMembers({ visibility, setVisibility, cluster }) {
  const { theme } = useSelector(({ auth }) => auth);

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>View Members</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBListGroup>
              {cluster?.members?.map((member, index) => (
                <MDBListGroupItem
                  key={`view-member-${index}`}
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{member.email}</div>
                    {member.messengerId}
                  </div>
                  {member.facebook && (
                    <MDBBadge pill light>
                      {member.facebook}
                    </MDBBadge>
                  )}
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => setVisibility(false)}
            >
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
