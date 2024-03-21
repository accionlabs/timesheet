import { createSlice } from "@reduxjs/toolkit";

import userServices from "../services/user.service";

const userSlice = createSlice({
  name: "uuid",
  initialState: {},
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    setPushNotification(state, action) {
      return { ...state, pushNotification: action.payload };
    },
  },
});

export const initializeUser = (accessToken, timezone) => {
  return async (dispatch) => {
    const { data, error } = await userServices.getUser(accessToken, timezone);
    if (error) {
      console.log(error);
    }

    dispatch(setUser(data));
  };
};

export const updatePushNotification = (accessToken, pushNotification) => {
  return async (dispatch) => {
    const { data, error } = await userServices.setPushNotification(
      accessToken,
      pushNotification
    );
    if (error) {
      console.log(error);
    }

    dispatch(setPushNotification(pushNotification));
  };
};

const { setUser, setPushNotification } = userSlice.actions;

export default userSlice.reducer;
