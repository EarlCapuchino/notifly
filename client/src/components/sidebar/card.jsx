import React, { useEffect, useState } from "react";
import {
  MDBListGroupItem,
  MDBIcon,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { BASE } from "../utilities";
import { SIDEBAR } from "../../redux/slices/persons/auth";

const SidebarCard = ({ list, currentPath, dimensions }) => {
  const { showCard } = useSelector(({ auth }) => auth),
    [active, setActive] = useState(false),
    dispatch = useDispatch();

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

  return (
    <MDBListGroupItem
      className="border-0 bg-transparent px-0 py-2"
      id={`sidebar-${list.path}`}
    >
      <MDBBtn
        className="m-0 px-0 w-100 shadow-0 text-light border-0"
        outline={!active}
        color={active ? "light" : "transparent"}
        onClick={() =>
          dispatch(SIDEBAR(showCard === list.path ? "" : list.path))
        }
      >
        <MDBRow>
          <MDBCol
            className="d-flex align-items-center justify-content-center"
            size={3}
          >
            <MDBIcon
              icon={list.icon}
              size="lg"
              className={`ms-4 text-${active ? "primary" : "light"}`}
            />
          </MDBCol>
          <MDBCol
            className={`text-start text-capitalize ps-3 text-${
              active ? "primary" : "light"
            }`}
          >
            {list.name}
          </MDBCol>
        </MDBRow>
      </MDBBtn>
    </MDBListGroupItem>
  );
};

export default SidebarCard;
