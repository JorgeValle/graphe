describe('Admin controller', function() {

  const request = require('request'),
        serverService = require('../services/server.service'),
        adminController = require('./admin.controller'),
        create = adminController.create,
        queryAll = adminController.queryAll,
        queryOne = adminController.queryOne;

  let baseUrl = serverService.returnBaseUrl();

  it('should have method to render create page', function() {
    expect(create).toBeDefined();
  });

  it('should have method to query all', function() {
    expect(queryAll).toBeDefined();
  });

  it('should have method to query one', function() {
    expect(queryOne).toBeDefined();
  });

  describe('/admin/create', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/admin/create', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('/admin/query', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/admin/query', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

  describe('/admin/update?post=why-bitcoin-should-fail', function() {
    it('returns status code 200', function(done) {
      request.get(baseUrl + '/admin/update?post=why-bitcoin-should-fail', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });

});