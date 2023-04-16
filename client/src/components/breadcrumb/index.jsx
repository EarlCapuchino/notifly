import React, { useEffect, useState } from "react";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";
import { BASE } from "../utilities";

const BreadCrumb = ({
  paths = [],
  title,
  button = false,
  handler,
  tooltip = "",
}) => {
  const navigate = useNavigate(),
    { theme } = useSelector(state => state.auth),
    [width, setWidth] = useState(window.innerWidth);

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

  const handleWidth = () => {
    if (width > 1400) {
      return "90%";
    } else if (width > 1200) {
      return "87.5%";
    } else if (width > 1000) {
      return "85%";
    } else if (width > 800) {
      return "82.5%";
    } else if (width > 768) {
      return "80%";
    } else {
      return "100%";
    }
  };

  return (
    <MDBContainer
      fluid
      className={`custom-sticky-bread transition-all ${theme.skin}`}
    >
      <MDBCol className="font-poppins">
        <MDBTypography
          tag="h5"
          style={{ width: handleWidth() }}
          className={`${theme.text} mt-0 mt-md-1 mb-0 py-0 pe-2 d-flex align-items-center justify-content-between`}
        >
          <span>{title}</span>
          {button && (
            <MDBTooltip
              tag="span"
              wrapperClass="d-inline-block"
              title={tooltip}
              placement="bottom"
            >
              <MDBBtn
                onClick={handler}
                outline
                floating
                size={width < 768 && "sm"}
              >
                <MDBIcon icon="folder-plus" />
              </MDBBtn>
            </MDBTooltip>
          )}
        </MDBTypography>
        <MDBBreadcrumb className="custom-bread-height">
          <MDBBreadcrumbItem
            className={`${theme.text} custom-text cursor-pointer`}
            onClick={() => navigate(`/${BASE}/dashboard`)}
          >
            Dashboard
          </MDBBreadcrumbItem>
          {paths?.map((path, index) => (
            <MDBBreadcrumbItem
              key={`${title}-${index}`}
              className={`${theme.text} custom-text ${
                path.link ? "cursor-pointer" : "custom-path"
              }`}
              onClick={() => {
                if (path.link) {
                  navigate(path.link);
                }
              }}
            >
              {path.name}
            </MDBBreadcrumbItem>
          ))}
        </MDBBreadcrumb>
      </MDBCol>
    </MDBContainer>
  );
};

export default BreadCrumb;
