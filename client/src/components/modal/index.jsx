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
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import ModalForm from "./form";
import { useState } from "react";
import { useEffect } from "react";

export default function Modal({
  visibility = false,
  setVisibility,
  size = "md",
  form = [],
  title = "",
  submitColor = "",
  submitText = "",
  submitHandler,
  data = {},
}) {
  const { theme } = useSelector(({ auth }) => auth),
    [record, setRecord] = useState(data);

  useEffect(() => {
    setRecord(data);
  }, [data]);

  const handleRecord = (name, value) => setRecord({ ...record, [name]: value });

  const handleSubmit = e => {
    e.preventDefault();

    submitHandler(record);
    setRecord(data);
  };

  return (
    <MDBModal staticBackdrop show={visibility} tabIndex="-1">
      <MDBModalDialog centered size={size}>
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <form onSubmit={handleSubmit}>
            <MDBModalHeader>
              <MDBModalTitle>{title}</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <ModalForm
                form={form}
                record={record}
                handleRecord={handleRecord}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                type="button"
                color={theme.color}
                className="shadow-0"
                onClick={setVisibility}
              >
                Close
              </MDBBtn>
              <MDBBtn color={submitColor}>{submitText}</MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
