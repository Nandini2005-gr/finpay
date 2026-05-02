import axios from "axios"

const API = axios.create({
  baseURL: "https://finpay-5tzd.onrender.com",
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `bearer ${token}`
  return config
})

export default API