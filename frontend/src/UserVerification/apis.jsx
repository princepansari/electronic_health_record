import axios from "./../axios";

export const getUsersList = (token) => {
  // token =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1MDg2OTEwNCwianRpIjoiMTcyZWMxMmItODc2Ny00OTZmLThmYWUtNmU1Yzg3ZDYxZTI3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjFkNWFmYzUyLWRkNDUtNGM0My1iN2JhLTUzOTlhMzUxOTZkNiIsIm5iZiI6MTY1MDg2OTEwNCwiZXhwIjoxNjUwOTU1NTA0LCJlbWFpbCI6ImFkbWluX2VockBpaXRiaGlsYWkuYWMuaW4iLCJuYW1lIjoiQURNSU4iLCJ1c2VyX3R5cGUiOiJhZG1pbiJ9.wTbGA2j-Bhka8UrVie4dwg55VXf9s3SnaOkPaibAOCE";

  axios.defaults.headers = {
    "Content-Type": `application/json`,
    Authorization: `Bearer ${token}`,
  };

  return axios
    .get("/api/admin/verification/get_users")
    .then((res) => res.data)
    .catch((err) => err.message);
};

export const sendVerfication = (token, user_id, verificationStatus) => {
  // token =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1MDg2OTEwNCwianRpIjoiMTcyZWMxMmItODc2Ny00OTZmLThmYWUtNmU1Yzg3ZDYxZTI3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjFkNWFmYzUyLWRkNDUtNGM0My1iN2JhLTUzOTlhMzUxOTZkNiIsIm5iZiI6MTY1MDg2OTEwNCwiZXhwIjoxNjUwOTU1NTA0LCJlbWFpbCI6ImFkbWluX2VockBpaXRiaGlsYWkuYWMuaW4iLCJuYW1lIjoiQURNSU4iLCJ1c2VyX3R5cGUiOiJhZG1pbiJ9.wTbGA2j-Bhka8UrVie4dwg55VXf9s3SnaOkPaibAOCE";

  axios.defaults.headers = {
    "Content-Type": `application/json`,
    Authorization: `Bearer ${token}`,
  };

  const verificationData = {
    user_id,
    verified: verificationStatus,
  };

  return axios
    .post("/api/admin/verification/verify_user", verificationData)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};
