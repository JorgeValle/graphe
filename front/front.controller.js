'use strict';

const request = require('request'),
      // services
      serverService = require('../services/server.service'),
      dateService = require('../services/date.service'),
      imageService = require('../services/image.service'),
      // vars
      currentImage = imageService.returnHeaderImage(new Date()),
      baseUrl = 'https://jorgevalle.com';

/**
 * Renders the content for the main blog page
 * @since 4.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} posts - All the posts
 * @param {object} quotes - All the quotes
 */
const renderBlogContent = function(req, res, posts, quotes) {
  res.render('blog', {
    documentTitle: 'Blog',
    metaDescription: 'I write about many aspects of software, but with a particular focus on JavaScript, web development and machine learning.',
    canonicalUrl: baseUrl + req.url,
    activeUrl: req.url,
    headerImage: currentImage,
    // we parse JSON response to get properties ready for consumption in pug templates
    posts: JSON.parse(posts),
    quotes: JSON.parse(quotes)
  });
};

/**
 * Renders the dynamic sitemap
 * @since 3.0.0
 * @param {pbject} req - The response object
 * @param {object} res - The response object
 * @param {object} allPost - All the posts we want in the sitemap
 */
const renderSitemap = function(req, res, allPosts) {
  res.render('sitemap', {
    documentTitle: 'Sitemap',
    metaDescription: 'The sitemap',
    canonicalUrl: baseUrl + req.url,
    activeUrl: req.url,
    // we parse JSON response to get properties ready for consumption in pug templates
    posts: JSON.parse(allPosts)
  });
};

/**
 * Render the timeline view
 * @since 3.0.0
 * @param {object} req - The request object
 * @param {object} res - The respose object
 * @param {object} allEvents - All the events we want displaying in the timeline
 */
const renderTimeline = function(req, res, allEvents) {
  res.render('timeline', {
    documentTitle: 'Timeline',
    metaDescription: 'A timeline view of my professional life as a software developer, and my personal life as a partner, friend, family member and BJJ practicioner.',
    canonicalUrl: baseUrl + req.url,
    headerImage: currentImage,
    activeUrl: req.url,
    // we parse JSON response to get properties ready for consumption in pug templates
    events: JSON.parse(allEvents)
  });
};


/**
 * Renders the single post content
 * @since 3.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} post - The post we are rendering
 */
const renderPost = function(req, res, post) {
  res.render('post', {
    // we parse JSON response to get properties ready for consumption in pug templates
    documentTitle: post.content.title,
    metaDescription: post.content.description.replace('<p>', '').replace('</p>', '') || '',
    canonicalUrl: 'https://jorgevalle.com' + req.url,
    activeUrl: req.url,
    headerImage: currentImage,
    title: post.content.title,
    date: dateService.prettify(post.date.created),
    city: post.location.city,
    country: post.location.country,
    index: post.content.index,
    body: post.content.bodies[0],
    references: post.content.references
  });
};

/**
 * Renders the homepage
 * @since 2.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
module.exports.homepage = function(req, res) {
  res.render('homepage', { 
    documentTitle: 'Home',
    metaDescription: 'Application developer blogging with a focus on JavaScript, web development, and machine learning. I also talk about finance, tech at large, and whatever topic I feel passionate about.',
    canonicalUrl: baseUrl + req.url,
    activeUrl: req.url,
    headerImage: currentImage
  });
};

/**
 * Renders the thanks for signing up page
 * @since 3.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
module.exports.thanks = function(req, res) {
  res.render('thanks', { 
    documentTitle: 'Thank You',
    metaDescription: "Thanks for signing up. You'll be hearing from me soon with more JavaScript, web development, and machine learning content that I hope you find useful.",
    canonicalUrl: baseUrl + req.url,
    activeUrl: req.url,
    headerImage: currentImage
  });
};

/**
 * Responds with the robots.tx file, which is a static file
 * @since 3.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
module.exports.robots = function(req, res) {
  res.sendfile('../robots.txt'); 
};

/**
 * Queries all the posts and quotes, and renders them if found
 * @since 3.0.0
 * @param {object} req - The request object 
 * @param {object} res - The response object 
 */
module.exports.queryPostsAndQuotes = function(req, res) {

  let path = '/api/get/posts',
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'get'
      };

  // Let's go get the posts
  request(requestOptions, function(err, response, posts) {

    if (err) {
      console.log('Request error' + err);
    } else {

      let path = '/api/get/quotes',
          fullUrl = serverService.returnBaseUrl() + path,
          requestOptions = {
            url: fullUrl,
            method: 'get'
          };

      // Now let's get the quotes
      request(requestOptions, function(err, response, quotes) {

        if (err) {
          renderBlogContent(req, res, posts);
        } else {
          renderBlogContent(req, res, posts, quotes);
        }

      });
    }
  });
};

/**
 * Queries all the events
 * @since 2.0.0
 * @param {object} req - The request object 
 * @param {object} res - The response object
 */
module.exports.queryEvents = function(req, res) {

  let path = '/api/get/events',
      fullUrl = serverService.returnBaseUrl() + path,
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
 * Queries for individual posts
 * @since 4.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
module.exports.postBySlug = function(req, res) {

  let path = `/api/get/post/${req.params.slug}`,
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'GET',
        json: {}
      };

  request(requestOptions, function(err, response, body) {

    if (err) {

      console.log(`Request error: ${err}`);

    } else if (response.statusCode == '404') {

      res.status(404).render('404', { 
        documentTitle: 'Not Found' ,
        canonicalUrl: 'https://jorgevalle.com' + req.url,
        activeUrl: req.url
      });

    } else {
      renderPost(req, res, body);
    }

  });
};

/**
 * Queries sitemap
 * @since 3.0.0
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
module.exports.sitemap = function(req, res) {

  let path = '/api/get/posts',
      fullUrl = serverService.returnBaseUrl() + path,
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