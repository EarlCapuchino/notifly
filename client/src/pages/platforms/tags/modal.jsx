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
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selenium } from "../../../redux/APIServices";
import { isValidURL, removeEmoji } from "../../../components/utilities";

export default function GenerateTags({
  visibility,
  setVisibility,
  clusters = [],
}) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [message, setMessage] = useState(""),
    [url, setUrl] = useState(""),
    [loading, setLoading] = useState(false),
    [recipients, setRecipients] = useState([]);

  useEffect(() => {
    if (clusters.length > 0) {
      var members = [];

      clusters.map(cluster =>
        cluster.members?.map(member => member.facebook && members.push(member))
      );

      const newMembers = [];

      Array.from(new Set(members.map(member => member._id))).map(mmbr =>
        newMembers.push(members.find(e => e._id === mmbr))
      );

      setRecipients(newMembers);
    }
  }, [clusters]);

  const handleSend = async () => {
    if (message) {
      if (isValidURL(url)) {
        setLoading(true);
        const response = await selenium(
          "tagging",
          { message, recipients, url },
          token
        );

        if (response) {
          toast.success("Recipients tagged successfully");
          setMessage("");
          setUrl("");
          setLoading(false);
          setVisibility(false);
        }
      } else {
        toast.warn("Please specify a valid facebook url");
      }
    } else {
      toast.warn("Please create a message");
    }
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Tag People</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody className="py-0">
            <MDBContainer className="rounded border pb-2">
              <MDBRow>
                <MDBCol size={1} className="text-center">
                  To:
                </MDBCol>
                <MDBCol size={11}>
                  {recipients?.map((recipient, index) => (
                    <MDBBadge
                      key={`selected-recipient-${index}`}
                      className="mx-1"
                    >
                      {recipient.facebook}
                    </MDBBadge>
                  ))}
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <MDBInput
              label="Facebook Link"
              className="my-2"
              readOnly={loading}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <MDBTextArea
              label="Message"
              readOnly={loading}
              value={message}
              onChange={e => setMessage(removeEmoji(e.target.value))}
              rows={4}
            />
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              type="button"
              color={theme.color}
              disabled={loading}
              className="shadow-0"
              onClick={() => setVisibility(false)}
            >
              Close
            </MDBBtn>
            <MDBBtn
              type="button"
              color="success"
              disabled={loading}
              className="shadow-0"
              onClick={handleSend}
            >
              {loading ? <MDBIcon far icon="clock" spin /> : "send"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
