import { configureStore } from "@reduxjs/toolkit";

import timesheetReducer from "./reducers/timesheet.reducer";
import userReducer from "./reducers/user.reducer";

const store = configureStore({
  reducer: {
    timesheet: timesheetReducer,
    user: userReducer,
  },
});

export default store;
