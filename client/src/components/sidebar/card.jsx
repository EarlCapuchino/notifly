import React, { useEffect, useState } from "react";
import {
  MDBListGroupItem,
  MDBIcon,
  MDBTypography,
  MDBBtn,
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
      className={`border-0 bg-transparent p-0 ${
        dimensions.height > 800 && "py-lg-3"
      }`}
      id={`sidebar-${list.path}`}
    >
      <MDBBtn
        className="dropbtn-sidebar m-0 px-0 w-100 shadow-0 text-light border-0"
        outline
        color="transparent"
        onClick={() =>
          dispatch(SIDEBAR(showCard === list.path ? "" : list.path))
        }
      >
        <MDBIcon
          icon={list.icon}
          size={dimensions.height < 800 ? "lg" : "2x"}
          className={`text-${active ? "warning" : "light"}`}
        />
        <MDBTypography
          tag="h6"
          className={`special-header mb-1 text-${active ? "warning" : "light"}`}
        >
          {list.name}
        </MDBTypography>
      </MDBBtn>
    </MDBListGroupItem>
  );
};

export default SidebarCard;
