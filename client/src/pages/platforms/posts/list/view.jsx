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
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function ViewModal({ visibility, setVisibility, post }) {
  const { theme } = useSelector(({ auth }) => auth);

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>{post.name}</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody className="py-0">
            <MDBListGroup numbered>
              {post.urls?.map((url, index) => (
                <MDBListGroupItem
                  key={`url-view-${index}`}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {url}
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => {
                setVisibility(false);
              }}
            >
              Close
            </MDBBtn>
            <MDBBtn color="danger">delete</MDBBtn>
            <MDBBtn>like</MDBBtn>
            <MDBBtn color="success">share</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
