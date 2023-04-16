import axios from "axios";
import io from "socket.io-client";
import PresetUser from "../../assets/images/default.jpg";
import ErrorPage from "../../assets/images/404.gif";
import ErrorFalse from "../../assets/images/400.png";

const BASE = "snapshot"; // initial routes, snapshot is used for deployment, we will change this depending on our status
const ENDPOINT = "http://localhost:5000"; // used for development
// const ENDPOINT = window.location.origin // used for deployment

const socket = io.connect(ENDPOINT); // socket connection for backend

// basic register handler for axios to transfer data to redux
const register = data =>
  axios
    .post("auth/save", data)
    .then(() => true)
    .catch(err => {
      throw new Error(err.response.data.error);
    });

export { PresetUser, ErrorPage, ErrorFalse, BASE, ENDPOINT, register, socket };
