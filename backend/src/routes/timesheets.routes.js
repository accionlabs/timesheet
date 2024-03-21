const express = require("express");

const { validateAccessToken } = require("../middleware/auth0.middleware");
const timesheetsControllers = require("../controllers/timesheets.controllers");

const timesheetsRouter = express.Router();

timesheetsRouter.use(validateAccessToken);

timesheetsRouter.get("/timesheet", timesheetsControllers.getTimesheet);

timesheetsRouter.put("/timesheet", timesheetsControllers.setTimesheet);

module.exports = {
  timesheetsRouter,
};
