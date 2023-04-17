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
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { RESET, UPDATE } from "../../../redux/slices/persons/auth";
import { customID } from "../../utilities";

export default function BasicForm({ visibility, setVisibility, auth }) {
  const { theme, token, isSuccess } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({
      facebook: "",
      email: "",
      customId: "",
      nickname: "",
      username: "",
    }),
    dispatch = useDispatch();

  useEffect(() => {
    if (auth && auth._id) {
      const newObj = { ...auth };
      newObj.customId = customID(newObj.customId);
      setForm(newObj);
    }
  }, [auth]);

  useEffect(() => {
    if (isSuccess) {
      setVisibility(false);
      dispatch(RESET());
    }
  }, [isSuccess]);

  const toggleShow = () => setVisibility(!visibility);

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(UPDATE({ form, token }));
  };

  const handleChange = (name, value) =>
    setForm({
      ...form,
      [name]: value,
    });

  return (
    <MDBModal
      show={visibility}
      staticBackdrop
      setShow={setVisibility}
      tabIndex="-1"
    >
      <MDBModalDialog size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>Update Your Information</MDBModalTitle>
          </MDBModalHeader>
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <MDBRow className="my-3">
                <MDBCol size={6}>
                  <MDBInput
                    label="Facebook Name"
                    value={form.facebook}
                    onChange={e => handleChange("facebook", e.target.value)}
                    contrast={theme.dark}
                  />
                </MDBCol>
                <MDBCol size={6}>
                  <MDBInput
                    label="User ID"
                    value={form.customId}
                    onChange={e => handleChange("customId", e.target.value)}
                    contrast={theme.dark}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="my-3">
                <MDBCol size={6}>
                  <MDBInput
                    label="Username"
                    value={form.username}
                    onChange={e => handleChange("username", e.target.value)}
                    contrast={theme.dark}
                  />
                </MDBCol>
                <MDBCol size={6}>
                  <MDBInput
                    label="Nickname"
                    value={form.nickname}
                    onChange={e => handleChange("nickname", e.target.value)}
                    contrast={theme.dark}
                  />
                </MDBCol>
              </MDBRow>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                type="button"
                color={theme.color}
                className="shadow-0"
                onClick={toggleShow}
              >
                Close
              </MDBBtn>
              <MDBBtn color="success">Save changes</MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
