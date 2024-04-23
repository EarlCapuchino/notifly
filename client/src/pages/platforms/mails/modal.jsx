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
import { removeEmoji } from "../../../components/utilities";
import axios from "axios";

export default function GenerateMessage({
  visibility,
  setVisibility,
  clusters = [],
}) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [content, setContent] = useState(""),
    [title, setTitle] = useState(""),
    [date, setDate] = useState(""),
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

  const handleSend = async e => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(
        "mailer/announce",
        {
          meeting: {
            title,
            date,
            content,
          },
          recipients,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        if (res.data.status) {
          toast.success(res.data.message);
          setLoading(false);
          setVisibility(false);
        }
      })
      .catch(err => toast.warn(err.message));
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="xl">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Generate a Message</MDBModalTitle>
          </MDBModalHeader>
          <form onSubmit={handleSend}>
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
                        {recipient.email}
                      </MDBBadge>
                    ))}
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
              <MDBRow className="mt-2">
                <MDBCol size={6}>
                  <MDBInput
                    label="Title"
                    value={title}
                    required
                    onChange={e => setTitle(e.target.value)}
                    readOnly={loading}
                  />
                </MDBCol>
                <MDBCol size={6}>
                  <MDBInput
                    label="Date and Time"
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    readOnly={loading}
                  />
                </MDBCol>
              </MDBRow>
              <MDBTextArea
                label="Content"
                readOnly={loading}
                value={content}
                required
                onChange={e => setContent(removeEmoji(e.target.value))}
                className="mt-2"
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
                type="submit"
                color="warning"
                disabled={loading}
                className="shadow-0"
              >
                {loading ? <MDBIcon far icon="clock" spin /> : "send"}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
