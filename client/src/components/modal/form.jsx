import React from "react";
import { MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

export default function ModalForm({ form, record, handleRecord }) {
  const { theme } = useSelector(({ auth }) => auth);

  return (
    <MDBRow>
      {form?.map((input, index) => {
        const {
          _name = "",
          _label = "",
          _md = 12,
          _size = 12,
          _required = false,
          _message = "",
          _type = "text",
          _format,
          _style = "",
        } = input;

        return (
          <MDBCol
            key={`${input.name}-${index}`}
            size={_size}
            md={_md}
            className={`${_style}`}
          >
            <MDBInput
              value={record[_name]}
              type={_type}
              onChange={e =>
                handleRecord(
                  _name,
                  _format ? _format(e.target.value) : e.target.value
                )
              }
              label={_label}
              required={_required}
              contrast={theme.dark}
              onInvalid={e => e.target.setCustomValidity(_message)}
              onInput={e => e.target.setCustomValidity("")}
            />
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
