'use strict';

/**
 * Returns the right Mongo connection string, depending on environment
 */
module.exports.iconizeTag = function(tag) {

    let map = {
      'Javascript': 'i.mdi.mdi-language-javascript',
      'HTML': 'i.mdi.mdi-language-html',
      'CSS': 'i.mdi.mdi-language-css'
    };

    return map.tag;

};