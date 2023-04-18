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
  MDBContainer,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function GenerateMessage({
  visibility,
  setVisibility,
  clusters = [],
}) {
  const { theme } = useSelector(({ auth }) => auth),
    [message, setMessage] = useState(""),
    [facebooks, setFacebooks] = useState([]);

  useEffect(() => {
    if (clusters.length > 0) {
      var members = [];

      clusters.map(cluster =>
        cluster.members?.map(member => member.facebook && members.push(member))
      );

      setFacebooks(Array.from(new Set(members.map(member => member.facebook))));
    }
  }, [clusters]);

  const handleSend = () => {
    console.log(facebooks);
    console.log(message);
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Generate a Message</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody className="py-0">
            <MDBContainer className="rounded border pb-2">
              <MDBRow>
                <MDBCol size={1} className="text-center">
                  To:
                </MDBCol>
                <MDBCol size={11}>
                  {facebooks?.map((facebook, index) => (
                    <MDBBadge
                      key={`selected-facebook-${index}`}
                      className="mx-1"
                    >
                      {facebook}
                    </MDBBadge>
                  ))}
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <MDBTextArea
              label="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="mt-2"
              rows={4}
            />
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
            <MDBBtn
              type="button"
              color="success"
              className="shadow-0"
              onClick={handleSend}
            >
              send
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
