describe("ShoppingAppControllers", function(){
    
    var $controller;
    //var ShoppingLimitedController;
    var shoppingUnlimitedController;
    //var ShowItemDetailsController;
    //var ShowShoppingItemController;

    beforeEach(function () { // Preparing env for testing 
        angular.mock.module(function ($provide) {
            $provide.service('ShoppingServiceMock', function(){ // providing a mock service using Angular provide
                var service = this;

                service.addItem = function(item) {
                    throw new Error("Test Message");
                };

                service.getItems = function() {
                    return [{},{}];
                };

                service.removeItem = function(){
                    
                }
            });
        });
        // angular.mock.module('spinner')
        // angular.mock.module('ui.router')
        angular.mock.module('shoppingApp');
    });

   
     beforeEach(angular.mock.inject(function(_$controller_, ShoppingServiceMock) {
        $controller = _$controller_;
        
        shoppingUnlimitedController = $controller('shoppingUnlimitedController',{
           cartService: ShoppingServiceMock});
    }));

   
    it("Should set error message in controller", function() { // Act and exceute test
        shoppingUnlimitedController.addToCart({name:"q",quantity:"2"});
        expect(shoppingUnlimitedController.error).toBe("Test Message");
    });
});