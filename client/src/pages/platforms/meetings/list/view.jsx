import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BROWSE } from "../../../../redux/slices/organizations/clusters";
import { BROWSE as GC } from "../../../../redux/slices/organizations/groupchats";
import axios from "axios";
import MeetingTabs from "./tabs";
import { selenium } from "../../../../redux/APIServices";

export default function ViewModal({ visibility, setVisibility, meeting }) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [loading, setLoading] = useState(false),
    [recipients, setRecipients] = useState([]),
    [activeTab, setActiveTab] = useState("Email"),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
    dispatch(GC(token));
  }, [token]);

  const handleAnnouncement = async () => {
    if (recipients.length > 0) {
      // setLoading(true);

      const _message = `${meeting.title} - ${new Date(
        meeting.date
      ).toLocaleString()}\n\n${meeting.content}`;

      switch (activeTab) {
        case "Group Chat":
          var _containers = [];

          for (const index in recipients) {
            const recipient = recipients[index];

            for (const ndx in recipient.urls) {
              _containers.push(recipient.urls[ndx]);
            }
          }

          var _recipients = Array.from(new Set(_containers.map(item => item)));

          const response = await selenium(
            "messaging",
            { recipients: _recipients, message: _message, type: "gc" },
            token
          );
          if (response) {
            toast.success("Group Chats messaged successfully");
            setLoading(false);
            setVisibility(false);
          }

          break;

        default:
          var _container = [];

          for (const index in recipients) {
            const recipient = recipients[index];

            for (const ndx in recipient.members) {
              _container.push(recipient.members[ndx]);
            }
          }

          var _recipientsx = [];

          Array.from(new Set(_container.map(item => item._id))).map(mmbr =>
            _recipientsx.push(_container.find(e => e._id === mmbr))
          );

          if (activeTab === "Email") {
            axios
              .post(
                "mailer/announce",
                { meeting, recipients: _recipientsx },
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
          } else {
            const response = await selenium(
              "messaging",
              { message: _message, recipients: _recipientsx, type: "pm" },
              token
            );
            if (response) {
              toast.success("Messages sent successfully");
              setLoading(false);
              setVisibility(false);
            }
          }

          break;
      }
    } else {
      toast.warn("Please select at least one(1) recipient");
    }
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size="xl">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Announce {meeting.title}</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBRow>
              <MDBCol md={7}>
                <MDBRow>
                  <MDBCol size={6}>
                    <MDBInput label="Title" value={meeting.title} readOnly />
                  </MDBCol>
                  <MDBCol size={6}>
                    <MDBInput
                      label="Date and Time"
                      value={new Date(meeting.date).toLocaleString()}
                      readOnly
                    />
                  </MDBCol>
                </MDBRow>
                <MDBTextArea
                  className="mt-3"
                  label="Content"
                  value={meeting?.content}
                  rows={5}
                  readOnly
                />
              </MDBCol>
              <MeetingTabs
                loading={loading}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                recipients={recipients}
                setRecipients={setRecipients}
              />
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
            <MDBBtn
              onClick={handleAnnouncement}
              disabled={loading}
              color="warning"
            >
              {loading ? <MDBIcon far icon="clock" spin /> : "announcement"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
