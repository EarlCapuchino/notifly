import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  MDBNavbarItem,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import UserCircle from "../../../assets/images/default.png";

// const items = [
//   {
//     name: "My Profile",
//     icon: "user-circle",
//     path: `/${BASE}/profile`,
//     external: false,
//   },
//   {
//     name: "Time Records",
//     icon: "calendar-alt",
//     path: `/attendance/${auth._id}`,
//     external: true,
//   },
// ];

const NavbarProfile = () => {
  const [visibility, setVisibility] = useState(false),
    { auth, theme } = useSelector(state => state.auth);

  const handleLogout = () => {
    toast.info("Removing all your cache.");
    setVisibility(false);

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "/login";
    }, 5500);
  };

  useEffect(() => {
    const handleEvent = e =>
      e.target.id !== "my-profile" && setVisibility(false);

    if (visibility) {
      setTimeout(() => window.addEventListener("click", handleEvent), 100);
    } else {
      window.removeEventListener("click", handleEvent);
    }
    return () => window.removeEventListener("click", handleEvent);
  }, [visibility]);

  return (
    <MDBNavbarItem className={`${theme.text} me-3`}>
      <div className="dropdown">
        <MDBBtn
          className="p-0 shadow-0 mx-2 dropbtn"
          onClick={() => setVisibility(!visibility)}
          color="transparent"
        >
          <img
            id="my-profile"
            src={UserCircle}
            alt={auth.email}
            height={28}
            width={28}
          />
        </MDBBtn>
        <div
          className={`custom-dropdown-content ${
            visibility ? "d-block" : "d-none"
          }`}
          style={{ backgroundColor: theme.bgHex }}
        >
          <MDBListGroup>
            {/* {items.map((item, index) => (
              <MDBListGroupItem
                key={`profile-item-${index}`}
                onClick={() => {
                  setVisibility(!visibility);
                  if (item.external) {
                    window.open(
                      item.path,
                      item.name,
                      "top=100px,width=768px,height=650px"
                    );
                  } else {
                    navigate(item.path);
                  }
                }}
                color={theme.color}
                className="cursor-pointer text-capitalize border-0"
              >
                <MDBIcon icon={item.icon} />
                &nbsp;
                {item.name}
              </MDBListGroupItem>
            ))} */}

            <MDBListGroupItem
              onClick={handleLogout}
              color={theme.color}
              className="cursor-pointer border-0"
            >
              <MDBIcon icon="sign-out-alt" />
              &nbsp;Logout
            </MDBListGroupItem>
          </MDBListGroup>
        </div>
      </div>
    </MDBNavbarItem>
  );
};

export default NavbarProfile;
