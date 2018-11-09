'use strict';

const dateService = require('../services/date.service');

/**
 * 
 */
module.exports.returnHeaderImage = function() {

  let currentWeek = dateService.getWeekNumber(new Date());

  console.log('currentWeek: ' + currentWeek);

  let imageDictionary = {
    1: 'amsterdam',
    2: 'yale-library',
    3: 'yale-hallway',
    4: 'yale-courtyard',
    5: 'new-york-stock-exchange',
    6: 'amsterdam-train',
    7: 'graz-mountain',
    8: 'bridgeport-beach',
    9: 'krk-marina',
    10: 'krk-beach',
    11: 'yale-footpath',
    12: 'amsterdam',
    13: 'yale-library',
    14: 'yale-hallway',
    15: 'yale-courtyard',
    16: 'new-york-stock-exchange',
    17: 'amsterdam-train',
    18: 'graz-mountain',
    19: 'bridgeport-beach',
    20: 'krk-marina',
    21: 'krk-beach',
    22: 'yale-footpath',
    23: 'amsterdam',
    24: 'yale-library',
    25: 'yale-hallway',
    26: 'yale-courtyard',
    27: 'new-york-stock-exchange',
    28: 'amsterdam-train',
    29: 'graz-mountain',
    30: 'bridgeport-beach',
    31: 'krk-marina',
    32: 'krk-beach',
    33: 'yale-footpath',
    34: 'amsterdam',
    35: 'yale-library',
    36: 'yale-hallway',
    37: 'yale-courtyard',
    38: 'new-york-stock-exchange',
    39: 'amsterdam-train',
    40: 'graz-mountain',
    41: 'bridgeport-beach',
    42: 'krk-marina',
    43: 'krk-beach',
    44: 'yale-footpath',
    45: 'amsterdam',
    46: 'yale-library',
    47: 'yale-hallway',
    48: 'yale-courtyard',
    49: 'new-york-stock-exchange',
    50: 'amsterdam-train',
    51: 'graz-mountain',
    52: 'bridgeport-beach'
  };

  return imageDictionary[currentWeek] || 'graz-mountain';

};