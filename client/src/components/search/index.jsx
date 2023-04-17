import React from "react";
import { MDBCol, MDBInput } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function Search({ label, handler }) {
  const { theme } = useSelector(({ auth }) => auth);

  return (
    <MDBCol>
      <MDBInput
        autoComplete="off"
        type="search"
        label={label}
        onChange={handler}
        name="key"
        contrast={theme.dark}
      />
    </MDBCol>
  );
}
