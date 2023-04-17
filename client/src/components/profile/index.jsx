import React from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import ProfileBasic from "./basic";
// import ProfileOthers from "./others";
// import ProfileCredentials from "./credentials";

const UserProfile = ({ auth, view = true }) => {
  return (
    <MDBContainer className={`${!view && "mt-3 mt-md-5"}`}>
      <ProfileBasic auth={auth} view={view} />
      {/* <ProfileOthers auth={form} view={view} />
        <ProfileCredentials auth={form} view={view} /> */}
    </MDBContainer>
  );
};
export default UserProfile;
