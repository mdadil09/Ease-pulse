const dateAndTime = require("date-and-time");

function parseDate(dateString) {
  const pattern = dateAndTime.compile("DD/MM/YYYY HH:mm:ss");
  return dateAndTime.parse(dateString, pattern);
}

function formatDate(date) {
  return dateAndTime.format(date, "DD/MM/YYYY HH:mm:ss");
}

module.exports = { parseDate, formatDate };
