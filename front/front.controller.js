'use strict';

const request = require('request'),
      serverService = require('../services/server.service'),
      dateService = require('../services/date.service');

// object for request options
let requestOptions = {
  url: serverService.returnBaseUrl(),
  method: 'GET',
  json: {}
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} responseBody 
 */
let renderQueryContent = function(req, res, responseBody) {
  res.render('blog', {
    documentTitle: 'Blog',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    // we parse JSON response to get properties ready for consumption in pug templates
    apiResponse: JSON.parse(responseBody)
  });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} responseBody 
 */
let renderSitemap = function(req, res, responseBody) {
  res.render('sitemap', {
    documentTitle: 'Sitemap',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    // we parse JSON response to get properties ready for consumption in pug templates
    apiResponse: JSON.parse(responseBody)
  });
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} responseBody 
 */
var renderPageByTitle = function(req, res, responseBody) {

  res.render('post', {

    // we parse JSON response to get properties ready for consumption in pug templates
    documentTitle: JSON.parse(responseBody).title + ' | JorgeValle.com' ,
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    title: JSON.parse(responseBody).title,
    alternativeTitle: JSON.parse(responseBody).alternativeTitle,
    date: dateService.prettify(JSON.parse(responseBody).publishedDate),
    lastModifiedDate: dateService.prettify(JSON.parse(responseBody).lastModifiedDate),
    bodyOne: JSON.parse(responseBody).bodyOne,
    bodyTwo: JSON.parse(responseBody).bodyTwo,
    bodyThree: JSON.parse(responseBody).bodyThree,
    bodyFour: JSON.parse(responseBody).bodyFour,
    bodyFive: JSON.parse(responseBody).bodyFive
  });
};

// homepage
module.exports.homepage = function(req, res) {
  res.render('homepage', { 
    documentTitle: 'Home',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url
  });
};


// timeline
module.exports.about = function(req, res) {
  res.render('about', { 
    documentTitle: 'About',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url
  });
};

// thanks
module.exports.thanks = function(req, res) {
  res.render('thanks', { 
    documentTitle: 'Thank You',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url
  });
};

// timeline
module.exports.timeline = function(req, res) {
  res.render('timeline', { 
    documentTitle: 'Timeline',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url
  });
};

// robots
module.exports.robots = function(req, res) {
  res.sendfile('../robots.txt'); 
};

request(requestOptions, function(err, response, body) {
  if(err) {
    console.log(err);
  } else if (response.statusCode === 200) {
    console.log('Request: 200');
  } else {
    console.log(response.statusCode);
  }
});

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.queryPosts = function(req, res) {

  var requestOptions, path;
  path = '/api/get/posts?sortby=descending';

  var fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };

  request(requestOptions, function(err, response, body) {
      if (err) {
        console.log('Request error' + err);
      } else {
        renderQueryContent(req, res, body);
      }
  });
  
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.postBySlug = function(req, res) {

  var requestOptions, path;

  path = '/api/get/post/' + req.params.slug;

  console.log(req.params.pageUrl);

  var fullUrl = serverService.returnBaseUrl() + path;

  console.log(fullUrl);

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };

  request(requestOptions, function(err, response, body) {

    if (err) {
      console.log('Request error' + err);
    } else if ( response.statusCode == '404' ) {
      res.status(404).render('404', { 
        documentTitle: 'Not Found' ,
        canonicalUrl: 'https://jorgevalle.com' + req.url,
        activeUrl: req.url
      });
    } else {
      renderPageByTitle(req, res, body);
      console.log('res.statusCode:' + res.statusCode);
    }

  });
  
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.sitemap = function(req, res) {

  var requestOptions, path;
  path = '/api/get/posts';

  var fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };

  request(requestOptions, function(err, response, body) {

    if (err) {
      console.log('Request error' + err);
    } else {
      renderSitemap(req, res, body);
    }

  });
};