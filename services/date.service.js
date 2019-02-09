{

  'use strict';

  /**
   * Returns a human-readable date string from a JavaScript date
   * @since 3.0.0
   * @param {date} date - The JS date to make pretty
   * @returns {string} - The prettyfied date
   */
  module.exports.prettify = function(date = new Date()) {

    const dateCopy = new Date(date),
          monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'
          ];

    let day = dateCopy.getDate(),
        month = monthNames[dateCopy.getMonth()],
        year = dateCopy.getFullYear();
    
    return `${month} ${day}, ${year}`;

  }

  /**
   * Returns the week number from
   * @since 4.0.0
   * @param {date} dateString - The date we want to return yearly week number for
   * @returns {number} - The number of the week in the year, from 1 to 52, of the passed date
   */
  module.exports.getWeekNumber = function(date = new Date()) {

    // Copy date so don't modify original
    let dateCopy = new Date(date);

    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    dateCopy.setUTCDate(dateCopy.getUTCDate() + 4 - (dateCopy.getUTCDay() || 7));

    // Get first day of year
    let yearStart = new Date(Date.UTC(dateCopy.getUTCFullYear(), 0, 1)),
        // Calculate full weeks to nearest Thursday
        weekNo = Math.ceil((((dateCopy - yearStart) / 86400000) + 1) / 7);

    // Week number
    return weekNo;

  }
}