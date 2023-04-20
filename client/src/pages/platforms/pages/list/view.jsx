import React, { useState } from "react";
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
  MDBIcon,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { selenium } from "../../../../redux/APIServices";
import { toast } from "react-toastify";

export default function ViewModal({ visibility, setVisibility, page }) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [loading, setLoading] = useState(false);

  const handleLikes = async () => {
    setLoading(true);
    const response = await selenium("liking", { urls: page.urls }, token);
    if (response) {
      toast.success("Pages liked successfully");
      setLoading(false);
      setVisibility(false);
    }
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>{page.name}</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody className="py-0">
            <MDBListGroup numbered>
              {page.urls?.map((url, index) => (
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
              disabled={loading}
              type="button"
              color={theme.color}
              className="shadow-0"
              onClick={() => {
                setVisibility(false);
              }}
            >
              Close
            </MDBBtn>
            <MDBBtn disabled={loading} color="danger">
              {loading ? <MDBIcon far icon="clock" spin /> : "delete"}
            </MDBBtn>
            <MDBBtn disabled={loading} onClick={handleLikes}>
              {loading ? <MDBIcon far icon="clock" spin /> : "like"}
            </MDBBtn>
            <MDBBtn disabled={loading} color="success">
              {loading ? <MDBIcon far icon="clock" spin /> : "share"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
