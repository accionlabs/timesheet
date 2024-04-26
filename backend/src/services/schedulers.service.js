const { CronJob } = require("cron");

const {
  getDaysOfMonth,
  getDaysOfNextMonth,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfNextMonth,
  getEndOfNextMonth,
  getEndOfDay,
} = require("./date.service");
const {
  selectUsers,
  insertTimesheet,
  selectTimesheetByUserId,
  updateLockBeforeDate,
  selectTimesheetByComplete,
} = require("./database.service");
const { logger } = require("./logger.service");
const { produce } = require("./kafka.service");

const monthlyTimesheetCreation = new CronJob("0 0 1 * *", async function () {
  // const monthlyTimesheetCreation = new CronJob(
  // "0 */1 * * * *",
  // async function () {
  const date = new Date();
  const daysOfMonth = getDaysOfMonth(date);
  const daysOfNextMonth = getDaysOfNextMonth(date);
  try {
    const users = await selectUsers();
    for (const user of users) {
      const thisMonthTimesheet = await selectTimesheetByUserId(
        user.id,
        getStartOfMonth(date),
        getEndOfMonth(date)
      );
      if (thisMonthTimesheet.length === 0) {
        await insertTimesheet(user.id, daysOfMonth);
      }
      const nextMonthTimesheet = await selectTimesheetByUserId(
        user.id,
        getStartOfNextMonth(date),
        getEndOfNextMonth(date)
      );
      if (nextMonthTimesheet.length === 0) {
        await insertTimesheet(user.id, daysOfNextMonth);
      }
    }
    logger.info(`Monthly timesheets created: ${date.toString()}`);
  } catch (error) {
    logger.error(`Monthy timesheet job: ${error}`);
  }
});

const monthlyTimesheetLocking = new CronJob("0 0 1 * *", async function () {
  // const monthlyTimesheetLocking = new CronJob("0 */1 * * * *", async function () {
  try {
    const date = new Date();
    await updateLockBeforeDate(getStartOfMonth(date));
    logger.info(`Monthly timesheets locked: ${date.toString()}`);
  } catch (error) {
    logger.error(`Monthly timesheet locked: ${error}`);
  }
});

const dailyNotificationPreparations = new CronJob(
  "00 00 20 * * 1-5",
  // "0 */1 * * * *",
  async function () {
    try {
      const now = new Date();
      let users = await selectTimesheetByComplete(
        getStartOfMonth(now),
        getEndOfDay(now)
      );
      users = users.map((user) => ({
        ...user,
        dates_utc: user.dates_utc
          .split(",")
          .map((date) => new Date(date).toDateString()),
      }));
      await produce(users.map((user) => ({ value: JSON.stringify(user) })));
      logger.info(`Daily notifications prepared`);
    } catch (error) {
      logger.error(`Daily notifications preparations: ${error}`);
    }
  }
);

module.exports = {
  monthlyTimesheetCreation,
  monthlyTimesheetLocking,
  dailyNotificationPreparations,
};
