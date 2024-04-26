const express = require("express");

const { validateAccessToken } = require("../middleware/auth0.middleware");
const usersControllers = require("../controllers/users.controllers");

const usersRouter = express.Router();

usersRouter.use(validateAccessToken);

usersRouter.get("/user", usersControllers.getUser);
usersRouter.put("/push-notification", usersControllers.setPushNotification);

module.exports = {
  usersRouter,
};
