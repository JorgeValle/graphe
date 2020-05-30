{

  'use strict';

  const request = require('request'),
        serverService = require('./services/server.service');
  
  const siteName = 'Graphe';
  
  /**
   * Renders the form to update content
   * @since 2.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} contentItem - The content item object that we will render
   */
  const renderUpdateForm = (req, res, contentItem, contentType) => {
    res.render('update', {
      documentTitle: `Update | ${siteName}`,
      // We parse JSON response to get properties ready for consumption in pug templates
      contentItem: JSON.parse(contentItem),
      contentType: contentType
    });
  };
  
  
  /**
   * Renders the main query for all content
   * @since 2.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} posts - The posts we will render
   * @param {object} quotes - The quotes we will render
   * @param {object} events - The events we are rendering
   */
  const renderQueryContent = (req, res, posts, quotes, events) => {
    res.render('query', {
      documentTitle: `Query | ${siteName}`,
      // We parse JSON response to get properties ready for consumption in pug templates
      posts: JSON.parse(posts),
      quotes: JSON.parse(quotes),
      events: JSON.parse(events),
    });
  };
  
  /**
   * Renders the create page
   * @since 2.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  module.exports.create = (req, res) => {
    res.render('create', { 
      documentTitle: `Create | ${siteName}`
    });
  };
  
  /**
   * Queries all content types
   * @since 2.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} posts - The blog posts we are querying
   * @param {object} events - The events we are querying
   * @param {object} quotes - The quotes we are querying
   * @param {object} days - The days we are querying
   */
  module.exports.queryAll = (req, res) => {
  
    let path = '/api/get/posts',
        fullUrl = serverService.returnBaseUrl() + path,
        requestOptions = {
          url: fullUrl,
          method: 'GET'
        };
  
    // Let's get the posts
    request(requestOptions, (err, response, posts) => {
  
      if (err) {
        console.log('Request error' + err);
      } else {
  
        let path = '/api/get/quotes',
            requestOptions = {
              url: serverService.returnBaseUrl() + path,
              method: 'GET'
            };
  
        // Now let's get the quotes
        request(requestOptions, (err, response, quotes) => {
  
          if (err) {
            renderQueryContent(req, res, posts);
          } else {
  
            let path = '/api/get/events',
                requestOptions = {
                  url: serverService.returnBaseUrl() + path,
                  method: 'GET'
                };
  
            // Now we get the events
            request(requestOptions, (err, response, events) => {
  
              if (err) {
                renderQueryContent(req, res, posts, quotes)
              } else {

                let path = '/api/get/days',
                    requestOptions = {
                      url: serverService.returnBaseUrl() + path,
                      method: 'GET'
                    };

                // Finally the days...
                request(requestOptions, (err, response, days) => {

                  if (err) {
                    renderQueryContent(req, res, post, quotes, events);
                  } else {
                    renderQueryContent(req, res, posts, quotes, events, days);
                  }
                })
              }
            });
          }
        });
      }
    });
  };
  
  /**
   * Queries the single piece of content we want to update: post, event, quote
   * @since 2.0.0
   * @param {object} req - The request object
   * @param {oject} res - The response object
   */
  module.exports.queryOne = (req, res) => {

    console.log('req.query.type', req.query.type);
    console.log('req.query.slug', req.query.slug);
  
    const contentType = req.query.type;

    let path = `/api/get/${contentType}/${req.query.slug}`,
    requestOptions = {
      url: serverService.returnBaseUrl() + path,
      method: 'GET'
    };

    request(requestOptions, (err, response, contentItem) => {
  
      if (err) {
        console.error(`Request error: ${err}`);
      } else {
        renderUpdateForm(req, res, contentItem, req.query.type);
      }
  
    });

  };

}