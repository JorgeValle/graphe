describe('Date service', function() {

  const dateService = require('./date.service'),
        prettify = dateService.prettify,
        getWeekNumber = dateService.getWeekNumber;

  it('should have method to prettify date', function() {
    expect(prettify()).toBeDefined();
  });

  it('should have method to return correct yearly week number', function() {
    expect(getWeekNumber()).toBeDefined();
  });

  describe('prettify method', function() {

    it('should correctly format date', function() {

      let testDate = new Date(2018, 00, 01);
  
      expect(prettify(testDate)).toEqual('January 1, 2018');
  
    });
  });

  describe('get week number method', function() {

    it('should return correct week number', function() {

      let testDate = new Date(2018, 00, 06);
  
      expect(getWeekNumber(testDate)).toEqual(1);
  
    });
  });
});