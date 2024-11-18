import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


export async function generateOTP(email,name) {
  try {
     const {
       data: { code },
       status,
     } = await axios.get("/api/generateOTP", { params: { email } });
    if (status === 201) {
      
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("/api/registerMail", {
        username:name,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyOTP({ email, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { email, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}