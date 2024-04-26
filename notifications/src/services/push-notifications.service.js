const axios = require("axios");
const dotenv = require("dotenv");

const { logger } = require("./logger.service");

dotenv.config();

const setUpPushNotifications = async (users) => {
  users.forEach((user) => {
    sendPushNotifications(user.uuid, user.dates_utc);
  });
};

const sendPushNotifications = async (external_id, dates) => {
  if (!external_id) {
    logger.error(`Push notification error: external_id not provided.`);
    return;
  }

  if (!dates) {
    logger.error(
      `Push notification error: dates not provided. external_id: ${external_id}`
    );
    return;
  }

  if (dates.length === 0) {
    logger.error(
      `Push notification error: dates array is empty. external_id: ${external_id}`
    );
    return;
  }

  const options = {
    method: "POST",
    url: "https://api.onesignal.com/notifications",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      "content-type": "application/json",
    },
    data: {
      app_id: process.env.ONESIGNAL_APP_ID,
      contents: {
        en: `Please fill in your timesheet for ${formatArray(dates)}.`,
      },
      include_aliases: {
        external_id: [external_id],
      },
      target_channel: "push",
      web_url: `${process.env.FRONTEND_URL}/#${dates[0]?.replace(/\s/g, "-")}`,
    },
  };

  try {
    await axios(options);
    logger.info(
      `Push notifications successfully sent for external_id: ${external_id}`
    );
  } catch (error) {
    logger.error(
      `Push notification error for external_id: ${external_id} ${JSON.stringify(
        error
      )}`
    );
  }
};

function formatArray(array) {
  if (array.length === 0) {
    return "";
  } else if (array.length === 1) {
    return array[0];
  } else {
    return `${array.slice(0, -1).join(", ")} and ${array[array.length - 1]}`;
  }
}

module.exports = {
  setUpPushNotifications,
};
