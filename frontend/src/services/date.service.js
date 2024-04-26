import { format, subMonths, addMonths } from "date-fns";

const getDateAsString = (date) => format(date, "EEEE, MMMM do, yyyy");
const getPreviousMonth = (date) => subMonths(date, 1);
const getNextMonth = (date) => addMonths(date, 1);

export default {
  getDateAsString,
  getPreviousMonth,
  getNextMonth,
};
