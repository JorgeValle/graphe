'use strict';

const request = require('request'),
      // services
      serverService = require('../services/server.service'),
      dateService = require('../services/date.service'),
      imageService = require('../services/image.service');

// object for request options
let requestOptions = {
  url: serverService.returnBaseUrl(),
  method: 'GET',
  json: {}
}

let currentImage = imageService.returnHeaderImage();

console.log('currentImage: ' + currentImage);

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} responseBody 
 */
let renderQueryContent = function(req, res, posts, quotes) {
  res.render('blog', {
    documentTitle: 'Blog',
    metaDescription: 'I write about many aspects of software, but with a particular focus on JavaScript, web development and machine learning.',
    canonicalUrl: `https://jorgevalle.com${req.url}`,
    activeUrl: req.url,
    headerImage: currentImage,
    // we parse JSON response to get properties ready for consumption in pug templates
    posts: JSON.parse(posts),
    quotes: JSON.parse(quotes)
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
    metaDescription: 'The sitemap',
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
let renderTimeline = function(req, res, responseBody) {

  console.log(`response body is ${responseBody}`);

  res.render('timeline', {
    documentTitle: 'Timeline',
    metaDescription: 'A timeline view of my professional and personal life.',
    canonicalUrl: `https://jorgevalle.com${req.url}`,
    headerImage: currentImage,
    activeUrl: req.url,
    // we parse JSON response to get properties ready for consumption in pug templates
    events: JSON.parse(responseBody)
  });
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} responseBody 
 */
var renderPost = function(req, res, responseBody) {

  res.render('post', {

    // we parse JSON response to get properties ready for consumption in pug templates
    documentTitle: responseBody.content.title,
    metaDescription: responseBody.content.description.replace('<p>', '').replace('</p>', '') || '',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    headerImage: currentImage,
    title: responseBody.content.title,
    date: dateService.prettify(responseBody.date.created),
    city: responseBody.location.city,
    country: responseBody.location.country,
    index: responseBody.content.index,
    body: responseBody.content.bodies[0],
    references: responseBody.content.references
  });
};

// homepage
module.exports.homepage = function(req, res) {

  res.render('homepage', { 
    documentTitle: 'Home',
    metaDescription: 'My homepage on the world wide web.',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    headerImage: currentImage
  });
};

// thanks
module.exports.thanks = function(req, res) {
  res.render('thanks', { 
    documentTitle: 'Thank You',
    metaDescription: 'Thanks for signing up.',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    headerImage: currentImage,
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
 * Queries all the posts
 * @param {*} req 
 * @param {*} res 
 */
module.exports.queryPostsAndQuotes = function(req, res) {

  var path = '/api/get/posts',
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'get'
      };

  // let's get the posts
  request(requestOptions, function(err, response, posts) {

    if (err) {
      console.log('Request error' + err);
    } else {

      var path = '/api/get/quotes',
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'get'
      };

      // now let's get the quotes
      request(requestOptions, function(err, response, quotes) {

        if (err) {
          renderQueryContent(req, res, posts);
        } else {
          renderQueryContent(req, res, posts, quotes);
        }

      });
    }
  });
};

/**
 * Queries all the events
 * @param {*} req 
 * @param {*} res 
 */
module.exports.queryEvents = function(req, res) {

  var requestOptions, path;
  path = '/api/get/events';

  var fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };

  request(requestOptions, function(err, response, body) {
      if (err) {
        console.log('Request error' + err);
      } else {
        console.log('Timeline was rendered');
        renderTimeline(req, res, body);
      }
  });
  
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.postBySlug = function(req, res) {

  let requestOptions,
      path = `/api/get/post/${req.params.slug}`;

  const fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET',
    json: {}
  };

  request(requestOptions, function(err, response, body) {

    if (err) {

      console.log(`Request error: ${err}`);

    } else if ( response.statusCode == '404' ) {

      res.status(404).render('404', { 
        documentTitle: 'Not Found' ,
        canonicalUrl: 'https://jorgevalle.com' + req.url,
        activeUrl: req.url
      });

    } else {
      renderPost(req, res, body);
      console.log(`res.statusCode: ${res.statusCode}`);
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