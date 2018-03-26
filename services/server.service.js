/**
 *
 */
module.exports.returnBaseUrl = function() {
  
  if (process.env.NODE_ENV === 'production') {
    return 'http://jorgevalle.herokuapp.com';
  } else {
    return 'http://localhost:3000';
  }
};