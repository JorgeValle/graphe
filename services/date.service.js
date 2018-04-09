'use strict';

/**
 * 
 */
module.exports.prettify = function(dateString) {

  let date = new Date(dateString),
      d = date.getDate(dateString),
      monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
      ],
      m = monthNames[date.getMonth()],
      y = date.getFullYear();
  
  return `${m} ${d}, ${y}`;

}