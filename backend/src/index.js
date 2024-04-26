const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const https = require("https");

const { usersRouter } = require("./routes/users.routes");
const { timesheetsRouter } = require("./routes/timesheets.routes");
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");

const {
  monthlyTimesheetCreation,
  monthlyTimesheetLocking,
  // dailyNotificationPreparations,
} = require("./services/schedulers.service");
const { logger } = require("./services/logger.service");

monthlyTimesheetCreation.start();
monthlyTimesheetLocking.start();
// dailyNotificationPreparations.start();

dotenv.config();

if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error("Missing required environment variables");
}

const PORT = parseInt(process.env.PORT, 10);
const app = express();
const apiRouter = express.Router();

app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

app.use(express.json());
app.set("json spaces", 2);
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN_URL,
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "../server.key")),
//   cert: fs.readFileSync(path.join(__dirname, "../server.crt")),
// };

const options = {
  key: fs.readFileSync(path.join(__dirname, "../server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../server.crt")),
};

app.get("/healthz", function (req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

app.use("/api", apiRouter);
apiRouter.use("/timesheets", timesheetsRouter);
apiRouter.use("/users", usersRouter);

app.use(errorHandler);
app.use(notFoundHandler);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

const server = https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});

//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// shut down server
const shutdown = () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
};
