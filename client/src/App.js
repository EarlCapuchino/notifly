import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routers from "./Routes";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { REFRESH } from "./redux/slices/persons/auth";
// import DevTools from "devtools-detect";

const App = () => {
  const { theme, token, auth } = useSelector(state => state.auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && !auth._id) {
      // this is used to validate and update our token in case the user restarts so we can initialize our auth redux
      dispatch(REFRESH(token));
    }
  }, [auth, token, dispatch]);

  // this commented block of code will be used in deployment, it traps users that try to tweak the website using inspect button
  // useEffect(() => {
  // if (localStorage.getItem("rush_reload") === "true") {
  //   window.location.reload();
  // }
  // if (DevTools.isOpen) {
  //   localStorage.setItem("rush_reload", true);
  //   console.log("You shouldnt be here");
  //   window.location.reload();
  // }
  // window.addEventListener("devtoolschange", e => {
  //   if (e.detail.isOpen) {
  //     localStorage.setItem("rush_reload", true);
  //     console.log("You shouldnt be here");
  //     window.location.reload();
  //   }
  // });
  // }, []);

  return (
    // BrowserRouter lets us handle Routers
    <BrowserRouter>
      <main className="h-100">
        {/* This is where our components takes turn to show */}
        <Routers />
      </main>

      {/* We declare the design for Toast */}
      <ToastContainer
        theme={theme.color}
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </BrowserRouter>
  );
};

export default App;
