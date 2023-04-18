import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBSpinner,
  MDBIcon,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN } from "../../../redux/slices/persons/auth";
import Company from "../../../fakeDb/company";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE } from "../../../components/utilities";

const Login = () => {
  const { isLoading, auth } = useSelector(state => state.auth),
    [show, setShow] = useState(false),
    dispatch = useDispatch(),
    navigate = useNavigate();

  useEffect(() => {
    document.title = `${Company.name} | Login`;
    if (auth._id) {
      toast.info(`Hello, ${auth.email}`);
      navigate(`/${BASE}/dashboard`);
    }
  }, [auth, navigate]);

  const handleSubmit = e => {
    e.preventDefault();

    const { email, password } = e.target;

    dispatch(
      LOGIN({
        email: email.value,
        password: password.value,
      })
    );
  };

  return (
    <MDBContainer fluid style={{ backgroundColor: "#f6e7d8", height: "100vh" }}>
      <MDBCol
        size={10}
        sm={10}
        md={8}
        lg={6}
        xl={4}
        className="offset-1 offset-sm-1 offset-md-2 offset-lg-3 offset-xl-4 text-center"
      >
        <img
          src={Company.logo}
          style={{ maxWidth: 200 }}
          className="my-2 w-100"
          alt="Company logo"
        />
        <MDBCard>
          <MDBCardBody>
            <form onSubmit={handleSubmit}>
              <MDBInput
                type="text"
                label="E-mail Address"
                name="email"
                onInvalid={e =>
                  e.target.setCustomValidity("Identification is required.")
                }
                onInput={e => e.target.setCustomValidity("")}
                required
                autoFocus
              />
              <div className="position-relative my-3">
                <MDBInput
                  type={!show ? "password" : "text"}
                  label="Password"
                  name="password"
                  minLength={8}
                  onInvalid={e =>
                    e.target.setCustomValidity(
                      "Password is used for validation."
                    )
                  }
                  onInput={e => e.target.setCustomValidity("")}
                  required
                />
                <MDBIcon
                  icon={show ? "eye" : "eye-slash"}
                  className="custom-register-eye cursor-pointer"
                  onClick={() => setShow(!show)}
                />
              </div>
              <MDBBtn className="w-100" color="success" disabled={isLoading}>
                {isLoading ? <MDBSpinner grow size="sm" /> : "log in"}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
        {/* <MDBCard className="mt-2">
          <MDBCardBody>
            <MDBTypography className="mb-0">
              New to <b>{Company.name}</b>?&nbsp;
              <span
                onClick={() => navigate("/register")}
                className="cursor-pointer text-primary hover-line"
              >
                Create an account
              </span>
              .
            </MDBTypography>
          </MDBCardBody>
        </MDBCard> */}
      </MDBCol>
    </MDBContainer>
  );
};

export default Login;
