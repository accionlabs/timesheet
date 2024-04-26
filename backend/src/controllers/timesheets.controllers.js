const {
  selectTimesheetByEmail,
  updateTimesheetByEmail,
} = require("../services/database.service");
const { logger } = require("../services/logger.service");
const {
  isDateAfterThisMonth,
  getStartOfMonth,
  getEndOfMonth,
  ISOtoDate,
} = require("../services/date.service");

const getTimesheet = async (req, res, next) => {
  const date = ISOtoDate(req?.query?.date);
  const email = req?.auth?.payload?.email;
  if (isDateAfterThisMonth(new Date(), date)) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }

  try {
    const timesheets = await selectTimesheetByEmail(
      email,
      getStartOfMonth(date),
      getEndOfMonth(date)
    );
    res.status(200).json(timesheets);
  } catch (error) {
    logger.error(error);
    next(new Error("Internal Server Error"));
  }
};

const setTimesheet = async (req, res, next) => {
  const updatedRows = req?.body;
  const email = req?.auth?.payload?.email;
  try {
    await updateTimesheetByEmail(updatedRows, email);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    next(new Error("Internal Server Error"));
  }
};

exports.getTimesheet = getTimesheet;
exports.setTimesheet = setTimesheet;
