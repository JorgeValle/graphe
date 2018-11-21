'use strict';

/**
 * Returns a human-readable date string from a JavaScript date
 * @since 3.0.0
 * @param {date} dateString - The JS date to make pretty
 * @returns {string} - The prettyfied date
 */
module.exports.prettify = function(date) {

  const theDate = new Date(date);

  let day = theDate.getDate(date),
      monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
      ],
      month = monthNames[date.getMonth()],
      year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;

}

/**
 * Returns the week number from
 * @since 4.0.0
 * @param {date} dateString - The date we want to return yearly week number for
 * @returns {number} - The number of the week in the year, from 1 to 52, of the passed date
 */
module.exports.getWeekNumber = function(d) {

  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));

  // Get first day of year
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1)),
      // Calculate full weeks to nearest Thursday
      weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);

  // Return array of year and week number
  return [weekNo];

}