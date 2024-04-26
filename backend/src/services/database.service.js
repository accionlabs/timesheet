const mysql = require("mysql2/promise");

let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_DB,
    password: process.env.DATABASE_PASSWORD,
  });
} catch (error) {
  throw error;
}

const selectUserByEmail = async (email) => {
  let connection = null;
  try {
    connection = await pool.getConnection();

    const sql =
      "select `uuid`, `push_notification` from `Users` where `email` = ?";
    const [rows, fields] = await connection.execute(sql, [email]);
    if (rows.length === 0) {
      return null;
    }

    await connection.release();

    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const insertTimesheet = async (userId, dates) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const rows = dates.map((date) => [
      userId,
      date?.date_utc,
      date?.leave,
      date?.holiday,
      date?.holiday_reason,
      date?.leave || date?.holiday,
    ]);

    const timesheetsSql =
      "insert into `Timesheets` (`user_id`, `date_utc`, `leave`, `holiday`, `holiday_reason`, `complete`) values ?";
    await connection.query(timesheetsSql, [rows]);
    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const insertUser = async (email, name, timezone) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sql =
      "insert into `Users` (`name`, `email`, `timezone`) values (?, ?, ?)";
    const values = [name, email, timezone];
    const [results, fields] = await connection.execute(sql, values);

    await connection.commit();
    await connection.release();

    return results.insertId;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const selectTimesheetByEmail = async (email, startOfMonth, endOfMonth) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const sql =
      "select `id`, `date_utc` as `date`, `present`, `leave`, `holiday`, `holiday_reason`, `notes`, `locked` from `Timesheets` where `date_utc` between ? and ? and `user_id` = (select `id` from `Users` where `email` = ?)";
    const values = [startOfMonth, endOfMonth, email];
    const [rows, fields] = await connection.execute(sql, values);
    await connection.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const selectTimesheetByUserId = async (userId, startOfMonth, endOfMonth) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const sql =
      "select `id`, `date_utc` as `date`, `present`, `leave`, `holiday`, `holiday_reason`, `notes`, `locked` from `Timesheets` where `date_utc` between ? and ? and `user_id` = ?";
    const values = [startOfMonth, endOfMonth, userId];
    const [rows, fields] = await connection.execute(sql, values);
    await connection.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const updateTimesheetByEmail = async (updatedRows, email) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sql =
      "update `Timesheets` set `present` = ?, `leave` = ?, `holiday` = ?, `notes` = ?, `complete` = ? where `id` = ? and `user_id` = (select `id` from `Users` where `email` = ?)";

    for (let row of updatedRows) {
      const values = [
        row.present,
        row.leave,
        row.holiday,
        row.notes,
        row.present || row.leave || row.holiday,
        row.id,
        email,
      ];
      await connection.execute(sql, values);
    }

    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const selectUsers = async () => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const sql = "select `id` from `Users`";
    const [rows, fields] = await connection.execute(sql);
    await connection.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const updatePushNotificationByEmail = async (email, pushNotification) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const sql = "update `Users` set `push_notification` = ? where `email` = ?";
    const values = [pushNotification, email];
    await connection.execute(sql, values);
    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const updateLockBeforeDate = async (date) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const sql =
      "update `Timesheets` set `locked` = 1 where `locked` = 0 and `date_utc` < ?";
    const values = [date];
    await connection.execute(sql, values);
    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

const selectTimesheetByComplete = async (startDate, endDate) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const sql =
      "with UnfinishedUsers as (select `user_id`, GROUP_CONCAT(`date_utc` ORDER BY `date_utc` ASC SEPARATOR ',') as `dates_utc` from Timesheets where `complete`= 0 and `date_utc` between ? and ? group by `user_id`) select `email`, `uuid`, `dates_utc` from UnfinishedUsers inner join Users on (UnfinishedUsers.user_id = Users.id)";
    const values = [startDate, endDate];
    const [rows, fields] = await connection.execute(sql, values);
    await connection.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
};

module.exports = {
  insertUser,
  insertTimesheet,
  selectTimesheetByEmail,
  updateTimesheetByEmail,
  selectUserByEmail,
  selectUsers,
  updatePushNotificationByEmail,
  updateLockBeforeDate,
  selectTimesheetByUserId,
  selectTimesheetByComplete,
};
