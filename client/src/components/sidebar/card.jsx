import React, { useEffect, useState } from "react";
import {
  MDBListGroupItem,
  MDBIcon,
  MDBTypography,
  MDBBtn,
  MDBListGroup,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE } from "../utilities";

const SidebarCard = ({
  list,
  currentPath,
  setCurrentPath,
  activeMenu,
  setActiveMenu,
  toggle,
  dimensions,
}) => {
  const { theme } = useSelector(({ auth }) => auth),
    navigate = useNavigate(),
    [active, setActive] = useState(false);

  useEffect(() => {
    const child = list.children.find(
      child => `/${BASE}/${list.path}/${child.path}` === currentPath
    );
    if (typeof child !== "undefined") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [currentPath, list]);

  useEffect(() => {
    const handleEvent = e =>
      e.target.id !== `side-${list.name}` && setActiveMenu(null);

    if (list.name === activeMenu) {
      setTimeout(() => window.addEventListener("click", handleEvent), 100);
    } else {
      window.removeEventListener("click", handleEvent);
    }
    return () => window.removeEventListener("click", handleEvent);
  }, [list, activeMenu, setActiveMenu]);

  return (
    <MDBListGroupItem
      className={`border-0 bg-transparent p-0 ${
        dimensions.height > 800 && "py-lg-3"
      }`}
    >
      <div className="dropdown-sidebar w-100">
        <MDBBtn
          className="dropbtn-sidebar m-0 px-0 w-100 shadow-0 text-light"
          color="transparent"
          onClick={() => {
            setActiveMenu(prev => (prev === list.name ? null : list.name));
          }}
        >
          <MDBIcon
            icon={list.icon}
            size={dimensions.height < 800 ? "lg" : "2x"}
            className={`text-${active ? "primary" : "muted"}`}
          />
          <MDBTypography
            tag="h6"
            className={`special-header mb-1 text-${active ? "light" : "muted"}`}
          >
            {list.name}
          </MDBTypography>
        </MDBBtn>
        <div
          className={`custom-sidebar-dropdown-content ${
            activeMenu === list.name ? "d-block" : "d-none"
          }`}
          style={{ backgroundColor: theme.bgHex }}
          id={`side-${list.name}`}
        >
          <MDBListGroup>
            {list.children.map((item, index) => {
              const _path = `/${BASE}/${list.path}/${item.path}`;

              return (
                <MDBListGroupItem
                  key={`${list.name}-${index}`}
                  color={theme.color}
                  onClick={() => {
                    navigate(_path);
                    setActiveMenu("");
                    setCurrentPath(_path);
                    toggle();
                  }}
                  className="border-0 cursor-pointer text-start"
                >
                  <MDBRow>
                    <MDBCol size={1}>
                      <MDBIcon
                        icon={item.icon}
                        className={`${currentPath === _path && "text-primary"}`}
                      />
                    </MDBCol>
                    <MDBCol
                      size={10}
                      className={`${currentPath === _path && "text-primary"}`}
                    >
                      {item.name}
                    </MDBCol>
                  </MDBRow>
                </MDBListGroupItem>
              );
            })}
          </MDBListGroup>
        </div>
      </div>
    </MDBListGroupItem>
  );
};

export default SidebarCard;
