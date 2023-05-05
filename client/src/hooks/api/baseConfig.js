import axios, { AxiosRequestHeaders, AxiosError } from "axios";
import { useDispatch } from "react-redux";
import config from "../../config";
import { logoutUser } from "../../store/reducers/authSlice";
// interface Options {
//   headers?: {
//     "Content-Type"?: "application/json" | "multipart/form-data";
//   };
// }

const baseConfig = {
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

const getUnauthenticatedConfig = (url = "", options = {}) => {
  const getBaseURL = () => {
    const baseURL = baseConfig.baseURL;
    const updatedBaseURL = `${baseURL}${url}`;
    return updatedBaseURL;
  };
  let configuration = { ...baseConfig };
  if (options && options.headers) {
    configuration.headers = { ...configuration.headers, ...options.headers };
  }
  configuration.baseURL = getBaseURL();
  return configuration;
};

const getAuthenticatedConfig = (token, url = '', options = {}) => {
  const configuration = getUnauthenticatedConfig(url, options);
  configuration["headers"]["Authorization"] = token;
  return configuration;
};


export const getUnauthenticatedAxios = (url = "", options = {}) => {
  const config = getUnauthenticatedConfig(url, options);
  const unauthenticatedAxios = axios.create(config);
  unauthenticatedAxios.interceptors.response.use(
    (response) => {
      let res = response.data;
      return res.data;
    },
    (error) => {
      console.log(error.response.status)
      let err = error.response.data;
      console.error(err);
      throw err;
    }
  );

  return unauthenticatedAxios;
};


export const getAuthenticatedAxios = (url, token, options = {}) => {
  const config = getAuthenticatedConfig(token, url, options);
  const authenticatedAxios = axios.create(config);
  authenticatedAxios.interceptors.response.use(
    (response) => {
      let res = response.data;
      return res.data;
    },
    (error) => {
      let err = { ...error.response.data, status: error.response.status };
      console.error(err);
      throw err;
    }
  );

  return authenticatedAxios;
};
