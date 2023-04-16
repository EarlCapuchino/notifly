import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routers from "./Routes";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { REFRESH } from "./redux/slices/persons/auth";
import Company from "./fakeDb/company";
// import DevTools from "devtools-detect";

const App = () => {
  const { theme, token, auth } = useSelector(state => state.auth),
    dispatch = useDispatch();

  useEffect(() => {
    document.title = Company.name;
    if (token && !auth._id) {
      dispatch(REFRESH(token));
    }
  }, [auth, token, dispatch]);

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
    <BrowserRouter>
      <main className="h-100">
        <Routers />
      </main>
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
