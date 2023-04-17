import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "mdb-react-ui-kit/dist/css/mdb.min.css"; // eslint-disable-next-line
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ENDPOINT } from "./components/utilities";

// set the default base url for axios so we do not have to call the url everytime we call an API
axios.defaults.baseURL = ENDPOINT;

// requests will include credentials in cross-origin requests
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* We eclose <App> with <Provided> so we can allow redux within the whole project */}
    {/* We pass the props {store} so we can provide redux the allowed reducers */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); //fix
