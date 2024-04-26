const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const { logger } = require("./logger.service");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const setUpEmails = async (users) => {
  users.forEach((user) => {
    sendEmails(user.email, user.dates_utc);
  });
};

const sendEmails = async (email, dates) => {
  if (!email) {
    logger.error(`Email error: email not provided.`);
    return;
  }

  if (!dates) {
    logger.error(`Email error: dates not provided. email: ${email}`);
    return;
  }

  if (dates.length === 0) {
    logger.error(`Email error: dates array is empty. email: ${email}`);
    return;
  }

  const link = `${process.env.FRONTEND_URL}/#${dates[0]?.replace(/\s/g, "-")}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Timesheet Reminder",
    text: `Please fill in your timesheet for ${formatArray(
      dates
    )}. You can fill in your timesheet at the following URL: ${link}`,
    html: `Please fill in your timesheet for ${formatArray(
      dates
    )}. <a href="${link}">Click here</a> to fill in your timesheet.`,
  };

  try {
    await sgMail.send(msg);
    logger.info(`Email successfully sent for email: ${email}`);
  } catch (error) {
    logger.error(`Email error for email: ${email} ${JSON.stringify(error)}`);
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
  setUpEmails,
};
