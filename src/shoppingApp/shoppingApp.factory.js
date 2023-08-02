(function() {
'use strict;'

    angular.module('shoppingApp')
    .provider('cartService', ShopServiceProvider)
    .factory('shoppingServiceFactory', ShoppingServiceFactory) //creating shopping service with different parameters
    .service('shoppingService', ShoppingService) // single instance of shoppingserie shared across controllers
    .config(AppConfig);


    // configuring the app to provide shoppingService that has 10 items at all times
    AppConfig.$inject = ['cartServiceProvider']
    function AppConfig(cartServiceProvider) {
        cartServiceProvider.defaults.maxItems = 10;
    }

    //the provider allows for configuring the service during app initiallization before being used 
    //eg if we want to config a ShoppingService to have only 10 items possible we use Provider to provide
    // a service that has that requirement
    function ShopServiceProvider(){
        provider = this;

        provider.defaults ={
            maxItems: 0
        };

        provider.$get = function(){
            var service = new ShoppingService(provider.defaults.maxItems);

            return service;
        };
    };

    // The factory responsible to orchestrate a new Shopping Service when needed based on different parametes
    function ShoppingServiceFactory(){
        var factory = function(maxItems){
            return new ShoppingService(maxItems);
        }

        return factory;
    };

     // The shopping service
     function ShoppingService(maxItems = 0){
        var service  = this;

        var items = [];

        service.getItems =function(){
            return items;
        };

        service.addItem = function(newItem){
            if(maxItems === 0 || (maxItems > 0 && items.length < maxItems)){
                items.push(newItem);
            }else{
                throw new Error("Max item ("+ maxItems +") as been reached");
            }
        };

        service.removeItem = function (itemIndex){
            items.splice(itemIndex,1);
        }

    };

})();