describe('Database service', function() {

  const databaseService = require('./database.service'),
        returnDbConnectionString = databaseService.returnDbConnectionString;

  it('should have method to return connection string', function() {
    expect(returnDbConnectionString()).toBeDefined();
  });

  describe('return databae connection string method', function() {

    it('should return a connection string', function() {
  
      expect(returnDbConnectionString()).toEqual(jasmine.any(String))
  
    });
  });
});