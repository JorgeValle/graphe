describe('Front controller', function() {

  const request = require('request'),
        serverService = require('../services/server.service'),
        frontController = require('./front.controller'),
        homepage = frontController.homepage,
        thanks = frontController.thanks,
        robots = frontController.robots,
        queryPostsAndQuotes = frontController.queryPostsAndQuotes,
        queryEvents = frontController.queryEvents,
        postBySlug = frontController.postBySlug,
        sitemap = frontController.sitemap;

  let baseUrl = serverService.returnBaseUrl();

  it('should have method to retrieve homepage', function() {
    expect(homepage).toBeDefined();
  });

  it('should have method to retrieve thanks page', function() {
    expect(thanks).toBeDefined();
  });

  it('should have method to retrieve robots.txt', function() {
    expect(robots).toBeDefined();
  });

  it('should have method to query posts and quotes', function() {
    expect(queryPostsAndQuotes).toBeDefined();
  });
  
  it('should have method to query events', function() {
    expect(queryEvents).toBeDefined();
  });

  it('should have method to query post by slug', function() {
    expect(postBySlug).toBeDefined();
  });

  it('should have method to render sitemap', function() {
    expect(sitemap).toBeDefined();
  });
});