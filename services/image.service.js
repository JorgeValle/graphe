'use strict';

const dateService = require('../services/date.service');

// Dictionary that maps week number to seasonally-appropriate phot
let imageMap = {};

imageMap[1] = imageMap[18] = imageMap[35] = imageMap[52] = {
  name: 'amsterdam-train',
  description: 'A train arrives at Schipol airport'
}

imageMap[2] = imageMap[19] = imageMap[36] = imageMap[53] = {
  name: 'yale-library',
  description: 'The interior of Beinecke Library in Yale University'
}

imageMap[3] = imageMap[20] = imageMap[37] = {
  name: 'yale-hallway',
  description: 'A hallway in Sterling Memorial Library in Yale University'
}

imageMap[4] = imageMap[21] = imageMap[38] = {
  name: 'yale-courtyard',
  description: 'One of the many beautiful courtyards at Yale University' 
}

imageMap[5] = imageMap[22] = imageMap[39] = {
  name: 'new-york-stock-exchange',
  description: 'The NYSE, as seen from Wall St.'
}

imageMap[6] = imageMap[23] = imageMap[40] = {
  name: 'yale-courtyard',
  description: 'One of the many beautiful courtyards at Yale University'
}

imageMap[7] = imageMap[24] = imageMap[41] = {
  name: 'graz-mountain',
  description: 'View of highway and mountains near Graz'
}

imageMap[8] = imageMap[25] = imageMap[42] = {
  name: 'bridgeport-beach',
  description: "A view from St.Mary's by the Sea, in Bridgeport"
}

imageMap[9] = imageMap[26] = imageMap[43] = {
  name: 'krk-bay',
  description: 'Overlooking a bay on the island of Krk, in Istria' 
}

imageMap[10] = imageMap[27] = imageMap[44] = {
  name: 'krk-beach',
  description: 'Looking out towards the Adriatic, from a beach in Krk'
}

imageMap[11] = imageMap[28] = imageMap[45] = {
  name: 'yale-footpath',
  description: 'A footpath near Malone Engineering Center, in Yale'
}

imageMap[12] = imageMap[29] = imageMap[46] = {
  name: 'trieste-caffe',
  description: 'Books, patrons and coffee in Caffè San Marco, Trieste'
}

imageMap[13] = imageMap[30] = imageMap[47] = {
  name: 'brussels-plaza',
  description: 'Life passes by at the Grand Place in Brussels'
}

imageMap[14] = imageMap[31] = imageMap[48] = {
  name: 'new-york-cathedral',
  description: `After a mass, at St.Patrick's Cathedral in Manhattan`
}

imageMap[15] = imageMap[32] = imageMap[49] = {
  name: 'rijeka-port',
  description: `Panoramic view of the port of Rijeka, Croatia's largest`
}

imageMap[16] = imageMap[33] = imageMap[50] = {
  name: 'zagreb-gric',
  description: `One of the most beautiful parks in Zagreb's Gornji Grad`
}

imageMap[17] = imageMap[34] = imageMap[51] = {
  name: 'amsterdam',
  description: `Amsterdam Centraal station and plaza`
}

/**
 * Maps a week number to a given image, and returns the dictionary entry for it
 * @since 4.0.0
 * @returns {object} - A header image object, with filename and description for image
 */
module.exports.returnHeaderImage = function(date) {

  const currentWeek = dateService.getWeekNumber(date);

  return imageMap[currentWeek] || imageMap[1];

};