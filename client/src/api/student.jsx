import axios from "axios";

export const getUserData = async (token) => {
  return await axios.get("https://check-name-server.vercel.app/api/listUsers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
