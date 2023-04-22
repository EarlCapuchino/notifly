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
  MDBInput,
  MDBRow,
  MDBCol,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function MeetingModal({
  modal,
  setVisibility,
  meeting,
  handleSubmit,
}) {
  const { theme } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({
      title: "",
      content: "",
      date: "",
    });

  useEffect(() => {
    if (modal) {
      document.getElementById("datetime").focus();

      if (!modal.create) {
        setForm(meeting);
      }
    }
  }, [modal, meeting]);

  return (
    <MDBModal staticBackdrop show={modal.visibility} tabIndex="-1">
      <MDBModalDialog centered size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>
              {modal.create ? "Create a Meeting" : `Update ${form.title}`}
            </MDBModalTitle>
          </MDBModalHeader>
          <form
            onSubmit={e => {
              e.preventDefault();

              handleSubmit(form);
            }}
          >
            <MDBModalBody>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="Title"
                    value={form.title}
                    onChange={e =>
                      setForm({ ...form, title: e.target.value.toUpperCase() })
                    }
                    required
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    id="datetime"
                    label="Date"
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBTextArea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                className="mt-2"
                label="Content"
                rows={3}
                required
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                type="button"
                color={theme.color}
                className="shadow-0"
                onClick={() => {
                  setForm({
                    title: "",
                    content: "",
                    date: "",
                  });
                  setVisibility({ visibility: false, create: true });
                }}
              >
                Close
              </MDBBtn>
              <MDBBtn type="submit" color="warning">
                submit
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
