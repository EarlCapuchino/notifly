import React, { useState, useEffect } from "react";
import { MDBBtn, MDBCol, MDBIcon, MDBTooltip } from "mdb-react-ui-kit";
import Swal from "sweetalert2";

export default function Pager({ total, setPage, page }) {
  const [width, setWidth] = useState(window.innerWidth);

  const handlePage = action => {
    if (action) {
      setPage(prev => prev + 1);
    } else {
      setPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    function debounce(fn, ms) {
      let timer;

      return _ => {
        clearTimeout(timer);

        timer = setTimeout(_ => {
          timer = null;

          fn.apply(this, arguments);
        }, ms);
      };
    }

    const debounceResize = debounce(() => setWidth(window.innerWidth), 500);

    window.addEventListener("resize", debounceResize);

    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  const handleOverride = async () => {
    const { value: _page } = await Swal.fire({
      title: "Specify a number",
      input: "number",
      inputLabel: `Minimum is 1 and Maximum is ${total}`,
      inputPlaceholder: `Current page is #${page}.`,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }

        if (Number(value) < 1) {
          return "Cannot go lower than 1";
        }

        if (Number(value) > total) {
          return `Cannot go higher than ${total}`;
        }
      },
    });

    if (_page) {
      setPage(Number(_page));
    }
  };

  return (
    <MDBCol className="d-flex justify-content-end align-items-center">
      <MDBTooltip
        tag="span"
        wrapperClass="d-inline-block"
        title="Previous"
        placement="bottom"
      >
        <MDBBtn
          floating
          color="info"
          outline
          size={width < 768 && "sm"}
          disabled={page <= 1}
          onClick={() => handlePage(false)}
        >
          <MDBIcon icon="angle-double-left" />
        </MDBBtn>
      </MDBTooltip>
      <MDBTooltip
        tag="span"
        wrapperClass="d-inline-block"
        title="Click to change page"
      >
        <MDBBtn
          color="info"
          rounded
          onClick={handleOverride}
          className="mx-1"
          size={width < 768 && "sm"}
        >
          {page} / {total}
        </MDBBtn>
      </MDBTooltip>
      <MDBTooltip
        tag="span"
        wrapperClass="d-inline-block"
        title="Next"
        placement="bottom"
      >
        <MDBBtn
          color="info"
          outline
          floating
          size={width < 768 && "sm"}
          onClick={() => handlePage(true)}
          disabled={page >= total}
        >
          <MDBIcon icon="angle-double-right" />
        </MDBBtn>
      </MDBTooltip>
    </MDBCol>
  );
}
