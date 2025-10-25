import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7077/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10s
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("[Axios Error]", error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
