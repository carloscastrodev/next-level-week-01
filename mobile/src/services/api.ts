import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.67:3030",
});

export default api;
