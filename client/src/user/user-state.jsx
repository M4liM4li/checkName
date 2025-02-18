import React from "react";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { create } from "zustand";

const userState = (set) => ({
  user: null,
  token: null,
  actionLogin: async (form) => {
    const res = await axios.post(
      "https://check-name-server.vercel.app/api/login",
      form
    );
    console.log(res.data.token);
    set({
      user: res.data.user,
      token: res.data.token,
    });
    return res;
  },
});
const usePersist = {
  name: "user-state",
  storage: createJSONStorage(() => localStorage),
};
const useStateUser = create(persist(userState, usePersist));
export default useStateUser;
