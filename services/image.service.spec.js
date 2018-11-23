describe('Image service', function() {

  const imageService = require('./image.service'),
        imageMap = imageService.imageMap,
        returnHeaderImage = imageService.returnHeaderImage;

  it('should have method to return weekly header image', function() {
    expect(returnHeaderImage()).toBeDefined();
  });

  describe('return header image method', function() {

    it('should return right image', function() {

      let testDate = new Date(2018, 00, 06);
  
      expect(returnHeaderImage(testDate).name).toEqual('amsterdam');
  
    });
  });
});