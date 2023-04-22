import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE } from "../utilities";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { SIDEBAR } from "../../redux/slices/persons/auth";

const currentPath = "";

export default function FlyingCards({ list, toggle, dimensions }) {
  const { showCard, theme } = useSelector(({ auth }) => auth),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    [position, setPosition] = useState({
      top: 0,
      left: 0,
    }),
    [offset, setOffset] = useState(30),
    [show, setShow] = useState(false);

  useEffect(() => {
    if (list.path === showCard) {
      const div = document.getElementById(`sidebar-${list.path}`);
      if (div) {
        setPosition({
          top: div.offsetTop,
          left: div.offsetLeft,
        });
        setShow(true);

        const divTop = div.offsetTop;
        const divHeight = div.offsetHeight;
        const windowHeight = window.innerHeight;
        const windowBottom = window.pageYOffset + windowHeight;
        const distanceFromBottom = windowBottom - (divTop + divHeight);

        if (distanceFromBottom <= 100) {
          setOffset(75);
        } else {
          setOffset(30);
        }
      }
    } else {
      setShow(false);
    }
  }, [showCard, list, dimensions]);

  return (
    <div
      className={`custom-sidebar-dropdown-content ${
        show ? "d-block" : "d-none"
      }`}
      style={{
        top: position.top - offset,
        left: position.left + 140,
        backgroundColor: theme.bgHex,
      }}
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
                dispatch(SIDEBAR(""));
                if (dimensions.width <= 768) {
                  toggle();
                }
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
  );
}
