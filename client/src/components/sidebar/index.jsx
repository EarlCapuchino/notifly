import React, { useEffect, useState } from "react";
import {
  MDBListGroupItem,
  MDBListGroup,
  MDBIcon,
  MDBTypography,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import SidebarCard from "./card";
import Company from "../../fakeDb/company";
import { BASE } from "../utilities";

const Sidebar = ({ lists, show, toggle, dimensions }) => {
  const [activeMenu, setActiveMenu] = useState(null),
    navigate = useNavigate(),
    location = useLocation(),
    [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div
      id="sidebar"
      style={{
        width: 140,
        left: !show && dimensions.width <= 768 && "-140px",
      }}
      className="sidebar-fixed position-fixed transition-all"
    >
      <span
        className="logo-wrapper waves-effect m-0 py-0 px-2 d-flex align-items-center"
        style={{ height: dimensions.width <= 768 ? "4.5rem" : "7.5rem" }}
      >
        <img
          src={Company.logo}
          draggable={false}
          style={{
            width: dimensions.width <= 768 ? "3rem" : "4.5rem",
            height: dimensions.width <= 768 ? "3rem" : "4.5rem",
          }}
          className="mx-auto"
          alt={Company.name}
        />
      </span>
      <MDBListGroup className="list-group-flush text-center">
        {lists.map((list, index) => {
          if (list.children) {
            return (
              <SidebarCard
                list={list}
                currentPath={currentPath}
                setCurrentPath={setCurrentPath}
                key={`link-${index}`}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                toggle={toggle}
                dimensions={dimensions}
              />
            );
          } else {
            const _path = `/${BASE}/${list.path}`;
            return (
              <MDBListGroupItem
                key={`sidebar-link-${index}`}
                className={`border-0 bg-transparent p-0  ${
                  dimensions.height > 800 && "py-lg-3"
                }`}
              >
                <MDBBtn
                  onClick={() => {
                    setCurrentPath(_path);
                    navigate(_path);
                    setActiveMenu(list.name);
                    toggle();
                  }}
                  className={`m-0 px-0 w-100 shadow-0 text-light`}
                  color="transparent"
                >
                  <MDBIcon
                    icon={list.icon}
                    size={dimensions.height < 800 ? "lg" : "2x"}
                    className={`text-${
                      currentPath === _path ? "primary" : "muted"
                    }`}
                  />
                  <MDBTypography
                    tag="h6"
                    className={`special-header mb-1 text-${
                      currentPath === _path ? "light" : "muted"
                    }`}
                  >
                    {list.name}
                  </MDBTypography>
                </MDBBtn>
              </MDBListGroupItem>
            );
          }
        })}
        {dimensions.width <= 768 && (
          <MDBListGroupItem className="bg-transparent border-0 px-0 py-1 py-lg-3">
            <MDBBtn
              onClick={toggle}
              className={`m-0 px-0 w-100 shadow-0 text-light`}
              color="transparent"
            >
              <MDBIcon icon="times" size="lg" className="text-muted" />
            </MDBBtn>
          </MDBListGroupItem>
        )}
      </MDBListGroup>
    </div>
  );
};

export default Sidebar;
