const {
  endOfMonth,
  addMonths,
  eachDayOfInterval,
  isWeekend,
  startOfMonth,
  setHours,
  parseISO,
  endOfDay,
} = require("date-fns");
const { da } = require("date-fns/locale");
const Holidays = require("date-holidays");

const holidays = new Holidays();
holidays.init("CA");

const getTwoMonthInterval = (today) => {
  return getDaysOfMonth(today).concat(getDaysOfNextMonth(today));
};

const getDaysOfMonth = (today) => {
  const startOfThisMonth = startOfMonth(today);
  const endOfNextMonth = endOfMonth(today);
  const datesToInsert = eachDayOfInterval({
    start: startOfThisMonth,
    end: endOfNextMonth,
  }).map((date) => {
    const newDate = setHours(date, 12);
    const tempHoliday = holidays.isHoliday(newDate);
    if (tempHoliday && tempHoliday[0]?.type === "public") {
      return {
        date_utc: newDate,
        leave: false,
        holiday: true,
        holiday_reason: tempHoliday[0]?.name,
      };
    }
    return {
      date_utc: newDate,
      leave: isWeekend(newDate),
      holiday: false,
      holiday_reason: null,
    };
  });
  return datesToInsert;
};

const getDaysOfNextMonth = (today) => {
  const startOfNextMonth = startOfMonth(addMonths(today, 1));
  const endOfNextMonth = endOfMonth(addMonths(today, 1));
  const datesToInsert = eachDayOfInterval({
    start: startOfNextMonth,
    end: endOfNextMonth,
  }).map((date) => {
    const newDate = setHours(date, 12);
    const tempHoliday = holidays.isHoliday(newDate);
    if (tempHoliday && tempHoliday[0]?.type === "public") {
      return {
        date_utc: newDate,
        leave: false,
        holiday: true,
        holiday_reason: tempHoliday[0]?.name,
      };
    }
    return {
      date_utc: newDate,
      leave: isWeekend(newDate),
      holiday: false,
      holiday_reason: null,
    };
  });
  return datesToInsert;
};

const isDateAfterThisMonth = (today, date) => {
  const endOfThisMonth = endOfMonth(today);
  const dateObj = new Date(date);
  return dateObj > endOfThisMonth;
};

const ISOtoDate = (ISODate) => parseISO(ISODate);

const getStartOfMonth = (date) => startOfMonth(date);
const getEndOfMonth = (date) => endOfMonth(date);
const getStartOfNextMonth = (date) => startOfMonth(addMonths(date, 1));
const getEndOfNextMonth = (date) => endOfMonth(addMonths(date, 1));
const getEndOfDay = (date) => endOfDay(date);

module.exports = {
  getTwoMonthInterval,
  isDateAfterThisMonth,
  getStartOfMonth,
  getEndOfMonth,
  getDaysOfMonth,
  getDaysOfNextMonth,
  getStartOfNextMonth,
  getEndOfNextMonth,
  ISOtoDate,
  getEndOfDay,
};
