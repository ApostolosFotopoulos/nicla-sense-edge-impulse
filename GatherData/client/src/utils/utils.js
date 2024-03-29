import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);
// Valid inserted date formats
const formats = ["D/M/YYYY", "D-M-YYYY", "DD/M/YYYY", "DD-M-YYYY", "D/MM/YYYY", "D-MM-YYYY"];
const isoFormats = ["YYYY-M-D", "YYYY-MM-DD", "YYYY-M-DD", "YYYY-MM-D"];

// Change a string date to ISO8601 format
export function toIsoDayFormat(date) {
  const d = dayjs(date, formats, true);
  return `${d.get("year")}-${d.get("month") + 1}-${d.get("date")}`;
}

// Change date to display format
export function toDisplayFormat(date) {
  const d = dayjs(date, isoFormats, true);
  return `${d.get("date")}-${d.get("month") + 1}-${d.get("year")}`;
}

// Change date to D-M-YYYY format
export function toCustomFormat(date) {
  return dayjs(date).format(formats[1]);
}

//Get current date in ISO8601 format
export function getCurrentDate() {
  return dayjs(new Date(), true).toISOString(true).split("T")[0];
}
