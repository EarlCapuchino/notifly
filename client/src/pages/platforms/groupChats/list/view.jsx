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
  MDBRow,
  MDBCol,
  MDBTextArea,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { selenium } from "../../../../redux/APIServices";
import { toast } from "react-toastify";
import { removeEmoji } from "../../../../components/utilities";

export default function ViewModal({ visibility, setVisibility, groupchat }) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(false);

  const handleMessages = async () => {
    if (message) {
      setLoading(true);
      const response = await selenium(
        "messaging",
        { recipients: groupchat.urls, message, type: "gc" },
        token
      );
      if (response) {
        toast.success("Group Chats messaged successfully");
        setLoading(false);
        setVisibility(false);
      }
    } else {
      toast.warn("Please specify a message");
    }
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="xl">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Message {groupchat.name} List</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow>
              <MDBCol>
                <MDBTextArea
                  label="Message"
                  rows={4}
                  value={message}
                  onChange={e => setMessage(removeEmoji(e.target.value))}
                />
              </MDBCol>
              <MDBCol size={5}>
                <MDBListGroup>
                  {groupchat.urls?.map((url, index) => (
                    <MDBListGroupItem
                      key={`url-view-${index}`}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{url?.name}</span>
                      <MDBBadge>{url?.messengerId}</MDBBadge>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCol>
            </MDBRow>
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
            <MDBBtn color="warning" disabled={loading} onClick={handleMessages}>
              {loading ? <MDBIcon far icon="clock" spin /> : "send"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
