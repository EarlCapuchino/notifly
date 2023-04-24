// this file is used for redux it handles all axios calls so we do not have to call axios everytime, it greatly reduces redundancy

import axios from "axios";
import { toast } from "react-toastify";

const breached = localStorage.getItem("rush_reload") || false;

export const login = async (email, password) =>
  await axios
    .get(`auth/login?email=${email}&password=${password}`)
    .then(res => {
      if (res.data.status) {
        return res.data.content;
      } else {
        toast.warn(res.data.message);
        throw new Error(res.data.message);
      }
    })
    .catch(err => {
      toast.warn(err.response.data.message);
      throw new Error(err.response.data.message);
    });

export const validateRefresh = async token =>
  await axios
    .get(`auth/validateRefresh`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (res.data.status) {
        return res.data.content;
      } else {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });

export const browse = async (entity, key = "", token) => {
  if (!breached) {
    if (typeof key === "object") {
      key = `?${Object.keys(key)
        .map(i => `${i}=${key[i]}`)
        .join("&")}`;
    } else if (key) {
      key = `?key=${key}`;
    }

    return await axios
      .get(`${entity}${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.data.content)
      .catch(err => {
        if (err.response.data.expired) {
          toast.warn("Session expired, login again.");
          localStorage.removeItem("token");
        }
        toast.error(err.response.data.message);
        throw new Error(err);
      });
  }
};

export const find = async (entity, pk, token) =>
  !breached &&
  axios
    .get(`${entity}/find?id=${pk}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data)
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      throw new Error(err);
    });

export const save = async (entity, form, token, willToast = true) =>
  !breached &&
  axios
    .post(`${entity}/save`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (willToast) {
        toast.success("Item saved successfully");
      }
      return res.data.content;
    })
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      throw new Error(err);
    });

export const update = (entity, data, id, token, willToast = true) =>
  !breached &&
  axios
    .put(`${entity}/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (willToast) {
        toast.info("Item updated successfully");
      }
      return res.data.content;
    })
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      throw new Error(err);
    });

export const destroy = async (entity, id, token) =>
  !breached &&
  axios
    .delete(`${entity}/${id}/destroy`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      toast.success("Item archived successfully");
      return res.data.content;
    })
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      throw new Error(err);
    });

export const restore = async (entity, id, token) =>
  !breached &&
  axios
    .put(
      `${entity}/${id}/restore`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(res => {
      toast.success("Item restored successfully");
      return res.data.content;
    })
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      throw new Error(err);
    });

export const selenium = async (endpoint, form, token) =>
  !breached &&
  axios
    .post(`selenium/${endpoint}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (res.data.skipped) {
        if (res.data.skipped.length > 0) {
          toast.warn(`Items skipped: ${res.data.skipped.join(", ")}`);
        }
      }
      return res.data.status;
    })
    .catch(err => {
      if (err.response.data.expired) {
        toast.warn("Session expired, login again.");
        localStorage.removeItem("token");
      }
      toast.error(err.response.data.message);
      toast.error(`Error occured, will refresh automatically`);
      setTimeout(() => {
        window.location.reload();
      }, 5500);
    });
