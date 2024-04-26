const { logger } = require("../services/logger.service");
const {
  selectUserByEmail,
  insertUser,
  insertTimesheet,
  updatePushNotificationByEmail,
} = require("../services/database.service");
const { getTwoMonthInterval } = require("../services/date.service");

const getUser = async (req, res, next) => {
  const email = req?.auth?.payload?.email;
  const name = req?.auth?.payload?.name;
  const timezone = req?.query?.timezone;
  try {
    let user = await selectUserByEmail(email);
    if (!user) {
      const userId = await insertUser(email, name, timezone);
      await insertTimesheet(userId, getTwoMonthInterval(new Date()));
      user = await selectUserByEmail(email);
    }

    res
      .status(200)
      .json({ uuid: user.uuid, pushNotification: user.push_notification });
  } catch (error) {
    logger.error(error);
    next(new Error("Internal Server Error"));
  }
};

const setPushNotification = async (req, res, next) => {
  const email = req?.auth?.payload?.email;
  const pushNotification = req?.body?.pushNotification;
  try {
    await updatePushNotificationByEmail(email, pushNotification);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    next(new Error("Internal Server Error"));
  }
};

exports.getUser = getUser;
exports.setPushNotification = setPushNotification;
