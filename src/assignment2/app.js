(function() {
'use strict';

angular.module('ShoppingCart',[])
.controller('shoppingCartController', ShoppingCartController)
.service('shoppingService', ShoppingService);

ShoppingCartController.$inject = ['shoppingService'];
function ShoppingCartController(shoppingService){
    var shopCart = this;

    shopCart.buy = function(itemIndex){
        shoppingService.buy(itemIndex);
    };

    shopCart.toBuyList =  shoppingService.getItemsToBuy();

    shopCart.boughtList = shoppingService.getItemBought();
};

function ShoppingService(){
    var service = this;

    var itemsToBuy = [ 
        {name: "Bread", quantity:"50"},
        {name: "Cookies", quantity:"20"},
        {name: "Nutella", quantity:"10"},
        {name: "Suasages", quantity:"30"},
        {name: "Wine", quantity:"5"}
    ];

    var itemsBought = [];

    service.buy = function(itemIndex){
        var item = itemsToBuy[itemIndex];

        itemsBought.push(item);
        itemsToBuy.splice(itemIndex,1);
    };

    service.getItemsToBuy = function(){
        return itemsToBuy;
    };

    service.getItemBought = function(){
        return itemsBought;
    }
};

})();