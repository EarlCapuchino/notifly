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
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBadge,
  MDBContainer,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BROWSE } from "../../../../redux/slices/persons/members";
import axios from "axios";

function MembersList({ members, catalogs, setMembers, loading }) {
  const handleSearch = e => {
    const key = e.target.value;

    if (key) {
      setMembers(
        catalogs.filter(catalog =>
          catalog.email.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setMembers(catalogs);
    }
  };

  return (
    <MDBCol md={5} className="mt-2 mt-md-0">
      <MDBListGroup>
        <MDBListGroupItem>
          <MDBInput
            onChange={handleSearch}
            type="search"
            label="Search by E-mail Address"
          />
        </MDBListGroupItem>
        {members?.map((member, index) => (
          <MDBListGroupItem key={member.email}>
            <MDBRow>
              <MDBCol
                size={10}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {member.email}
              </MDBCol>
              <MDBCol size={1} className="text-center">
                <MDBBtn
                  disabled={loading}
                  onClick={() => {
                    const newArr = [...members],
                      newObj = { ...newArr[index] };

                    newObj.isSelected = !member.isSelected;

                    newArr[index] = newObj;

                    // newArr[index].isSelected = member.isSelected ? false : true;
                    setMembers(newArr);
                  }}
                  size="sm"
                  floating
                  color={member.isSelected ? "danger" : "primary"}
                >
                  <MDBIcon icon={member.isSelected ? "times" : "check"} />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </MDBCol>
  );
}

export default function ViewModal({ visibility, setVisibility, meeting }) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [loading, setLoading] = useState(false),
    { catalogs } = useSelector(({ members }) => members),
    [members, setMembers] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE(token));
  }, [token]);

  useEffect(() => {
    setMembers(catalogs);
  }, [catalogs]);

  const handleAnnouncement = async () => {
    const recipients = members.filter(e => e.isSelected);

    if (recipients.length > 0) {
      setLoading(true);

      axios
        .post(
          "mailer/announce",
          { meeting, recipients },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(res => {
          if (res.data.status) {
            setMembers(catalogs);
            toast.success(res.data.message);
            setLoading(false);
            setVisibility(false);
          }
        })
        .catch(err => toast.warn(err.message));
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
                <MDBContainer className="rounded border my-2">
                  <MDBRow>
                    <MDBCol size={1} className="text-center">
                      To:
                    </MDBCol>
                    <MDBCol size={11}>
                      {members?.map(
                        (member, index) =>
                          member.isSelected && (
                            <MDBBadge
                              key={`selected-member-email-${index}`}
                              className="mx-1"
                            >
                              {member.email}
                            </MDBBadge>
                          )
                      )}
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
                <MDBTextArea
                  label="Content"
                  value={meeting.content}
                  rows={5}
                  readOnly
                />
              </MDBCol>
              <MembersList
                members={members}
                setMembers={setMembers}
                catalogs={catalogs}
                loading={loading}
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
              color="success"
            >
              {loading ? <MDBIcon far icon="clock" spin /> : "announcement"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
