'use strict';

const dateService = require('../services/date.service');

// Dictionary that maps week number to seasonally-appropriate phot
const imageMap = {
  1: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  2: {
    name: 'yale-library',
    description: 'The interior of Beinecke Library in Yale University'
  },
  3: {
    name: 'yale-hallway',
    description: 'A hallway in Sterling Memorial Library in Yale University'
  },
  4: {
   name: 'yale-courtyard',
   description: 'One of the many beautiful courtyards at Yale University' 
  },
  5: {
    name: 'new-york-stock-exchange',
    description: 'The NYSE, as seen from Wall St.'
  },
  6: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  7: {
    name: 'graz-mountain',
    description: 'View of highway and mountains near Graz'
  },
  8: {
    name: 'bridgeport-beach',
    description: "A view from St.Mary's by the Sea, in Bridgeport"
  },
  9: {
    name: 'krk-marina',
    description: 'Looking towards Krk old town, from the marina' 
  },
  10: {
    name: 'krk-beach',
    description: 'Looking out towards the Adriatic, from a beach in Krk'
  },
  11: {
    name: 'yale-footpath',
    description: 'A footpath near Malone Engineering Center, in Yale'
  },
  12: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  13: {
    name: 'yale-library',
    description: 'The interior of Beinecke Library in Yale University'
  },
  14: {
    name: 'yale-hallway',
    description: 'A hallway in Sterling Memorial Library in Yale University'
  },
  15: {
   name: 'yale-courtyard',
   description: 'One of the many beautiful courtyards at Yale University' 
  },
  16: {
    name: 'new-york-stock-exchange',
    description: 'The NYSE, as seen from Wall St.'
  },
  17: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  18: {
    name: 'graz-mountain',
    description: 'View of highway and mountains near Graz'
  },
  19: {
    name: 'bridgeport-beach',
    description: "A view from St.Mary's by the Sea, in Bridgeport"
  },
  20: {
    name: 'krk-marina',
    description: 'Looking towards Krk old town, from the marina' 
  },
  21: {
    name: 'krk-beach',
    description: 'Looking out towards the Adriatic, from a beach in Krk'
  },
  22: {
    name: 'yale-footpath',
    description: 'A footpath near Malone Engineering Center, in Yale'
  },
  23: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  24: {
    name: 'yale-library',
    description: 'The interior of Beinecke Library in Yale University'
  },
  25: {
    name: 'yale-hallway',
    description: 'A hallway in Sterling Memorial Library in Yale University'
  },
  26: {
   name: 'yale-courtyard',
   description: 'One of the many beautiful courtyards at Yale University' 
  },
  27: {
    name: 'new-york-stock-exchange',
    description: 'The NYSE, as seen from Wall St.'
  },
  28: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  29: {
    name: 'graz-mountain',
    description: 'View of highway and mountains near Graz'
  },
  30: {
    name: 'bridgeport-beach',
    description: "A view from St.Mary's by the Sea, in Bridgeport"
  },
  31: {
    name: 'krk-marina',
    description: 'Looking towards Krk old town, from the marina' 
  },
  32: {
    name: 'krk-beach',
    description: 'Looking out towards the Adriatic, from a beach in Krk'
  },
  33: {
    name: 'yale-footpath',
    description: 'A footpath near Malone Engineering Center, in Yale'
  },
  34: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  35: {
    name: 'yale-library',
    description: 'The interior of Beinecke Library in Yale University'
  },
  36: {
    name: 'yale-hallway',
    description: 'A hallway in Sterling Memorial Library in Yale University'
  },
  37: {
   name: 'yale-courtyard',
   description: 'One of the many beautiful courtyards at Yale University' 
  },
  38: {
    name: 'new-york-stock-exchange',
    description: 'The NYSE, as seen from Wall St.'
  },
  39: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  40: {
    name: 'graz-mountain',
    description: 'View of highway and mountains near Graz'
  },
  41: {
    name: 'bridgeport-beach',
    description: "A view from St.Mary's by the Sea, in Bridgeport"
  },
  42: {
    name: 'krk-marina',
    description: 'Looking towards Krk old town, from the marina' 
  },
  43: {
    name: 'krk-beach',
    description: 'Looking out towards the Adriatic, from a beach in Krk'
  },
  44: {
    name: 'yale-footpath',
    description: 'A footpath near Malone Engineering Center, in Yale'
  },
  45: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  46: {
    name: 'yale-library',
    description: 'The interior of Beinecke Library in Yale University'
  },
  47: {
    name: 'yale-hallway',
    description: 'A hallway in Sterling Memorial Library in Yale University'
  },
  48: {
   name: 'yale-courtyard',
   description: 'One of the many beautiful courtyards at Yale University' 
  },
  49: {
    name: 'new-york-stock-exchange',
    description: 'The NYSE, as seen from Wall St.'
  },
  50: {
    name: 'yale-courtyard',
    description: 'One of the many beautiful courtyards at Yale University'
  },
  51: {
    name: 'graz-mountain',
    description: 'View of highway and mountains near Graz'
  },
  52: {
    name: 'bridgeport-beach',
    description: "A view from St.Mary's by the Sea, in Bridgeport"
  },
  53: {
    name: 'krk-marina',
    description: 'Looking towards Krk old town, from the marina' 
  }
};

/**
 * Maps a week number to a given image, and returns the dictionary entry for it
 * @since 4.0.0
 * @returns {object} - A header image object, with filename and description for image
 */
module.exports.returnHeaderImage = function(date) {

  const currentWeek = dateService.getWeekNumber(date);

  return imageMap[currentWeek] || imageMap[1];

};