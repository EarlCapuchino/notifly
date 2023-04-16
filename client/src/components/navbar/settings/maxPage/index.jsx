import React from "react";
import { MDBCol, MDBContainer, MDBIcon, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { MAXPAGE } from "../../../../redux/slices/persons/auth";
import Swal from "sweetalert2";

const SettingsMaxPage = () => {
  const { theme, maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleClick = async () => {
    const { value: num } = await Swal.fire({
      title: "Specify a number",
      input: "number",
      inputLabel: "Minimum is 1 and Maximum is 50",
      inputPlaceholder: `Current is ${maxPage} item(s) per page`,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }

        if (Number(value) < 1) {
          return "Minimum is 1 item per page!";
        }

        if (Number(value) > 50) {
          return "Maximum is 50 items per page!";
        }
      },
    });

    if (num) {
      dispatch(MAXPAGE(Number(num)));
    }
  };

  return (
    <MDBCol className="custom-notification-container position-relative pb-4 mx-5">
      <span
        onClick={handleClick}
        className={`custom-notification-icon ${theme.bg} ${theme.text} border border-${theme.border} cursor-pointer`}
      >
        {maxPage}
      </span>
      <MDBContainer className="ms-5 p-0">
        <MDBTypography
          tag="h6"
          className={`custom-notification-title fw-bold p-0 w-0 ${theme.text} text-capitalize d-flex align-items-center justify-content-between`}
        >
          <span>Max item per page</span>
          <MDBIcon
            onClick={() => dispatch(MAXPAGE(true))}
            icon="angle-up"
            className="me-5 cursor-pointer"
          />
        </MDBTypography>
        <p
          className={`p-0 w-0 ${theme.text} d-flex align-items-center justify-content-between`}
        >
          <span className="custom-notification-label">
            Click the icon to specify a number.
          </span>
          <MDBIcon
            onClick={() => dispatch(MAXPAGE(false))}
            icon="angle-down"
            className="me-5 cursor-pointer"
          />
        </p>
      </MDBContainer>
    </MDBCol>
  );
};

export default SettingsMaxPage;
