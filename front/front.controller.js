const request = require('request'),
      serverService = require('../services/server.service');

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

request(requestOptions, function(err, response, body) {
  if(err) {
    console.log(err);
  } else if (response.statusCode === 200) {
    console.log('Request: 200');
  } else {
    console.log(response.statusCode);
  }
});


/* GET page by title */
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
        console.log("Request error" + err);
      } else {
        renderQueryContent(req, res, body);
      }
  });
  
};

/* GET page by title */
module.exports.postsByUrl = function(req, res) {

  var requestOptions, path;
  path = '/api/get/posts?sortby=descending';

  var fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };

  request(requestOptions, function(err, response, body) {

      if (err) {
        console.log("Request error" + err);
      } else {
        renderQueryContent(req, res, body);
      }
  });
  
};

/* GET page by title */
module.exports.sitemap = function(req, res) {

  var requestOptions, path;
  path = '/api/pages?sortby=descending';

  var fullUrl = serverService.returnBaseUrl() + path;

  requestOptions = {
    url: fullUrl,
    method: 'GET'
  };
  request(requestOptions, function(err, response, body) {

      if (err) {
        console.log("Request error" + err);
      } else {
        renderSitemap(req, res, body);
      }

  });
};