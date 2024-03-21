import { createSlice } from "@reduxjs/toolkit";

import timesheetService from "../services/timesheet.service";

const timesheetSlice = createSlice({
  name: "timesheet",
  initialState: [],
  reducers: {
    setTimesheet(state, action) {
      return action.payload.map((row) => ({ ...row, updated: false }));
    },
    setRow(state, action) {
      const id = action.payload.id;
      const rowToChange = state.find((row) => row.id === id);
      let updatedRow = undefined;

      if (action.payload.type === "present") {
        updatedRow = {
          ...rowToChange,
          present: action.payload.present,
          updated: true,
        };
      } else if (action.payload.type === "leave") {
        updatedRow = {
          ...rowToChange,
          leave: action.payload.leave,
          updated: true,
        };
      } else if (action.payload.type === "holiday") {
        updatedRow = {
          ...rowToChange,
          holiday: action.payload.holiday,
          updated: true,
        };
      } else if (action.payload.type === "notes") {
        updatedRow = {
          ...rowToChange,
          notes: action.payload.notes,
          updated: true,
        };
      }

      if (action.payload.present || action.payload.holiday) {
        updatedRow = {
          ...updatedRow,
          leave: false,
        };
      } else if (action.payload.leave) {
        updatedRow = {
          ...updatedRow,
          present: false,
          holiday: false,
        };
      }

      return state.map((row) => (row.id === id ? updatedRow : row));
    },
    resetUpdatedRows(state) {
      return state.map((row) => ({ ...row, updated: false }));
    },
  },
});

export const updateTimesheet = (accessToken, date, timezone) => {
  return async (dispatch) => {
    const { data, error } = await timesheetService.getAll(
      accessToken,
      date,
      timezone
    );

    if (error) {
      console.log(error);
    }

    dispatch(setTimesheet(data));
  };
};

export const updateRow = (row) => {
  return async (dispatch) => {
    dispatch(setRow(row));
  };
};

export const submitRows = (accessToken, rows) => {
  return async (dispatch) => {
    const { data, error } = await timesheetService.setRows(accessToken, rows);
    if (error) {
      console.log(error);
    }

    dispatch(resetUpdatedRows());
  };
};

export const { setTimesheet, setRow, resetUpdatedRows } =
  timesheetSlice.actions;

export default timesheetSlice.reducer;
