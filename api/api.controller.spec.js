describe('API controller', function() {

  // Bringing in models
  require('./api.config');

  const request = require('request'),
        serverService = require('../services/server.service'),
        apiController = require('./api.controller'),
        retrieveAllPosts = apiController.retrieveAllPosts,
        retrieveAllEvents = apiController.retrieveAllEvents,
        retrieveAllQuotes = apiController.retrieveAllQuotes,
        retrievePostBySlug = apiController.retrievePostBySlug,
        createPost = apiController.createPost,
        createEvent = apiController.createEvent,
        createQuote = apiController.createQuote,
        updatePost = apiController.updatePost,
        updateEvent = apiController.updateEvent,
        updateQuote = apiController.updateQuote;

  let baseUrl = serverService.returnBaseUrl() + '/api';

  it('should have method to retrieve all posts', function() {
    expect(retrieveAllPosts).toBeDefined();
  });

  it('should have method to retrieve all events', function() {
    expect(retrieveAllEvents).toBeDefined();
  });

  it('should have method to retrieve all quotes', function() {
    expect(retrieveAllQuotes).toBeDefined();
  });

  it('should have method to retrieve post by slug', function() {
    expect(retrievePostBySlug).toBeDefined();
  });
  
  it('should have method to create post', function() {
    expect(createPost).toBeDefined();
  });

  it('should have method to create event', function() {
    expect(createEvent).toBeDefined();
  });

  it('should have method to create quote', function() {
    expect(createQuote).toBeDefined();
  });

  it('should have method to update post', function() {
    expect(updatePost).toBeDefined();
  });

  it('should have method to update event', function() {
    expect(updateEvent).toBeDefined();
  });

  it('should have method to update quote', function() {
    expect(updateQuote).toBeDefined();
  });

  describe('/get/posts', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/get/posts', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('/get/quotes', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/get/quotes', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('/get/events', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/get/events', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('/get/post/why-bitcoin-should-fail', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/get/post/why-bitcoin-should-fail', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

});