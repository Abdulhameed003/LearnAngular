(function (){
    'use strict;'

    angular.module('shoppingApp')
    .controller('shoppingUnlimitedController',ShoppingUnlimitedController)
    .controller('shoppingLimitedController',ShoppingLimitedController)
    .controller('addShoppingItemController', AddShoppingItemController)
    .controller('showShoppingItemController', ShowShoppingItemController)
    .controller('showDefaultListController', ShowDefaultListController)
    .controller('showItemDetailsController', ShowItemDetailsController)
    .controller('registrationController', RegistrationController);

    ShoppingUnlimitedController.$inject = ['cartService']; // using Provider to server the shoppingService Lecture 22
    function ShoppingUnlimitedController(cartService){
        var ctrl = this;

        ctrl.items = cartService.getItems();
    
        var originalTitle = 'Unlimited Shopping list';
        ctrl.title = originalTitle + "(" + ctrl.items.length +" items )";
     
        ctrl.warning = "Cookies Detected";
    
        ctrl.addToCart = function(item){
            try {
                cartService.addItem(item);
                ctrl.title = originalTitle + "(" + ctrl.items.length +" items )";
            } catch (error) {
                ctrl.error = error.message;
            }
            
        };
    
        ctrl.removeItem = function(itemIndex){
            ctrl.lastRemoved = "The last item removed was "+ ctrl.items[itemIndex].name;
            cartService.removeItem(itemIndex)
            ctrl.title = originalTitle + "(" + ctrl.items.length +" items )";
        };
       
    };

    ShoppingLimitedController.$inject = ['shoppingServiceFactory'];
    function ShoppingLimitedController(shoppingServiceFactory){
        var ctrl = this;

        var cartServices = shoppingServiceFactory(3);

        ctrl.items = cartServices.getItems();
        ctrl.title = 'Limited Shopping list of 3 items Max';

        ctrl.addToCart = function(item){
            try {
                cartServices.addItem(item);
            } catch (error) {
                ctrl.error = error.message;
            }
        }

        ctrl.removeItem = function(itemIndex){
            cartServices.removeItem(itemIndex)
        };

    };

    AddShoppingItemController.$inject = ['shoppingDecoratorService'];
    function AddShoppingItemController(shoppingDecoratorService){
        var itemAdder = this;

        itemAdder.addToCart = function(item){
            shoppingDecoratorService.addItem(item);
        };
        
    };

    ShowShoppingItemController.$inject = ['shoppingDecoratorService'];
    function ShowShoppingItemController(shoppingDecoratorService){
        var ctrl = this;

        ctrl.items = shoppingDecoratorService.getItems();

        ctrl.removeItem = function(itemIndex){
            shoppingDecoratorService.removeItem(itemIndex);
        }
    };

    // this controller is used with the resolve prop in the ui-router module
    // defaultItems is passed from the route state and resolved before displaying the state 
    ShowDefaultListController.$inject = ['items'];
    function ShowDefaultListController(items){
        var list = this;
        
        list.items = items;

        // list.$onInit = function(){
        //     shoppingDecoratorService.getDefaultItems()
        //     .then(function(result){
        //         list.items = result;
        //     });
        // }
    };

    ShowItemDetailsController.$inject = ['$stateParams','items']
    function ShowItemDetailsController($stateParams,items){
        var itemDetail = this;
        var item = items[$stateParams.itemId];

        itemDetail.name = item.name;
        itemDetail.quantity = item.quantity;
        itemDetail.description = item.description;
    }

    function RegistrationController(){
        var reg = this;

        reg.user = {
            userName: "",
            email: "",
            phone: ""
        };

        reg.submit = function() {
            reg.completed = true;
        };

    };

})();