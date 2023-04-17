import React, { useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { customID } from "../../utilities";
import BasicForm from "./modal";

export default function ProfileBasic({ auth, view }) {
  const { theme } = useSelector(({ auth }) => auth),
    [visibility, setVisibility] = useState(false);

  return (
    <MDBCard background={theme.color} className={`${theme.text}`}>
      <MDBCardBody>
        <BasicForm
          visibility={visibility}
          setVisibility={setVisibility}
          auth={auth}
        />
        <MDBCardTitle
          className={`border-bottom border-${theme.border} mb-3 d-flex justify-content-between align-items-center pb-1`}
        >
          Your Informations
          {!view && (
            <MDBTooltip
              tag="span"
              wrapperClass="d-inline-block"
              title="Update Information"
            >
              <MDBBtn
                size="sm"
                color="info"
                className="py-1"
                onClick={() => setVisibility(!visibility)}
              >
                <MDBIcon icon="pen-alt" />
              </MDBBtn>
            </MDBTooltip>
          )}
        </MDBCardTitle>
        <MDBRow>
          <MDBCol md={6}>
            <MDBInput
              label="Facebook Name"
              value={auth.facebook}
              contrast={theme.dark}
              readOnly
              className="bg-transparent"
            />
          </MDBCol>
          <MDBCol md={6}>
            <MDBInput
              label="Email Address"
              value={auth.email}
              contrast={theme.dark}
              readOnly
              className="bg-transparent"
            />
          </MDBCol>
          <MDBCol md={4}>
            <MDBInput
              label="User ID"
              value={customID(auth.customId)}
              contrast={theme.dark}
              readOnly
              className="bg-transparent my-3"
            />
          </MDBCol>
          <MDBCol md={4}>
            <MDBInput
              label="Username"
              value={auth.username}
              contrast={theme.dark}
              readOnly
              className="bg-transparent my-3"
            />
          </MDBCol>
          <MDBCol md={4}>
            <MDBInput
              label="Nickname"
              value={auth.nickname}
              contrast={theme.dark}
              readOnly
              className="bg-transparent my-3"
            />
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
}
