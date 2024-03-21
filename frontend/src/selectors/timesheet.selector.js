// /redux/timesheet/selectors.js
import { createSelector } from "@reduxjs/toolkit";

export const selectTimesheet = (state) => state.timesheet;

export const selectUpdatedRows = createSelector(
  [selectTimesheet],
  (timesheet) => timesheet.filter((row) => row.updated)
);
