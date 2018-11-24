describe('Server service', function() {

  const passwordService = require('./password.service'),
        returnApiPassword = passwordService.returnApiPassword;

  it('should have method to return the API password', function() {
    expect(returnApiPassword()).toBeDefined();
  });

  describe('return API password method', function() {

    it('should return a string', function() {
  
      expect(returnApiPassword()).toEqual(jasmine.any(String));

    });
  });
});