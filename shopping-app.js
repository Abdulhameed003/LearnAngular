(function(){
'use strict';
angular.module('shoppingApp', [])
.controller('addShoppingItems', AddShoppingItems)
.controller('showShoppingItems', ShowShoppingItems)
.controller('shoppingListUnlimited', ShoppingListUnlimited)
.controller('shoppingListLimited', ShoppingListLimited)
.factory('shoppingServiceFactory', ShoppingServiceFactory) //creating shopping service with different parameters
.service('shoppingService', ShoppingService) // single instance of shoppingserie shared across controllers
.service('shoppingDecoratorService', ShoppingDecoratorService)
.service('weightLossService', WeightLossService) //a service that implements asynchronous program.
.component('shoppingListItem', {
    templateUrl : 'shoppingList.html',
    controller : 'shoppingControllerInComponent as list',
    bindings : {
        items : '<', // < - one way binding and = - bi-directional binding
        title : '@', // constant binding or single binding
        onRemove : '&' // a reference binding 
    },
    transclude: true
}) 
.component('itemInput',{
    templateUrl : 'itemInput.html',
    controller: ShoppingInputController,
    bindings: {
        onAddItem: '&'
    }
})
.component('spinnerLoader',{
    templateUrl: 'spinner.html',
    controller: SpinnerLoaderController,
})
.controller('shoppingControllerInComponent',ShoppingControllerInComponent); // using controller inside a directives


function ShoppingInputController(){
    var $ctrl = this;

    $ctrl.name = "";
    $ctrl.quantity =""

    $ctrl.add = function(item){
        $ctrl.onAddItem({item:item});
    };
}

ShoppingControllerInComponent.$inject =['$rootScope','$element', '$q', 'weightLossService']
function ShoppingControllerInComponent($rootScope, $element, $q, weightLossService){
    var list = this;
    var totalItem;

    list.containsCookie = function(){
        for(var i = 0; i < list.items.length; i++){
            var name = list.items[i].name;
            if(name.toLowerCase().indexOf("cookie") !== -1){
                return true;
            }
        }
    };

    //lifCycle Methods onInit
    list.$onInit == function(){
        totalItem = 0;
    };

    //lifCycle Methods doCheck to hook in to lifecycle even to check if binded obj has changed
    list.$doCheck = function(){
        if(list.items.length !== totalItem){
            totalItem = list.items.length;

            $rootScope.$broadcast('shoppinglist:processing', {on: true});

            var promises = [];
            for (var index = 0; index < list.items.length; index++) {
               promises.push(weightLossService.checkName(list.items[index].name));
            }

            $q.all(promises)
            .then(function(result){
                //Remove cookie warning
                var warningElement = $element.find("div.error");
                warningElement.slideUp(900);
            })
            .catch(function(result){
                //Show cookie warning
                list.warning = result.message;
                var warningElement = $element.find("div.error");
                warningElement.slideDown(900);
            })
            .finally(function(){
                $rootScope.$broadcast('shoppinglist:processing',{on: false})
            })
         }
    };
    
};

SpinnerLoaderController.$inject =  ['$rootScope']
function SpinnerLoaderController($rootScope){
    var $ctrl = this;

    //passing this handler to a variable returns a deregisted handler which is important to deregister becos we used the rootScope
    var cancelListener = $rootScope.$on('shoppinglist:processing', function(event, data){
        if(data.on){
            $ctrl.showSpinner = true;
        }else{
            $ctrl.showSpinner = false;
        }
    });

    $ctrl.$onDestroy = function(){
        cancelListener();
    }
}
//This iss the link defined for the ShoppingListDirectives so we can maniplate the DOM using Libraries like Jquery

AddShoppingItems.$inject = ['shoppingDecoratorService']
function AddShoppingItems(shoppingDecoratorService){
    var itemAdder = this;

    itemAdder.addToCart = function(item){
        shoppingDecoratorService.addItem(item);
    };
    
};

ShowShoppingItems.$inject = ['shoppingDecoratorService']
function ShowShoppingItems(shoppingDecoratorService){
    var showItems = this;

    showItems.items = shoppingDecoratorService.getItems();

    showItems.removeItem = function(itemIndex){
        shoppingDecoratorService.removeItem(itemIndex);
    }
};

ShoppingListLimited.$inject = ['shoppingServiceFactory']
function ShoppingListLimited(shoppingServiceFactory){
    var listLimited = this;

    var cartServices = shoppingServiceFactory(3);

    listLimited.items = cartServices.getItems();
    listLimited.title = 'Limited Shopping list of 3 items Max';
    //listLimited.item ={name:"",quantity:""};
  

    listLimited.addToCart = function(item){
        try {
            cartServices.addItem(item);
        } catch (error) {
            listLimited.errorMessage = error.message;
        }
    }

    listLimited.removeItem = function(itemIndex){
        cartServices.removeItem(itemIndex)
    };

};

ShoppingListUnlimited.$inject = ['shoppingServiceFactory']
function ShoppingListUnlimited (shoppingServiceFactory){
    var listUnlimited = this;

    var cartServices = shoppingServiceFactory();
    
    listUnlimited.items = cartServices.getItems();

    var originalTitle = 'Unlimited Shopping list';
    listUnlimited.title = originalTitle + "(" + listUnlimited.items.length +" items )";
 
    listUnlimited.warning = "Cookies Detected";

    listUnlimited.addToCart = function(item){
        cartServices.addItem(item);
        listUnlimited.title = originalTitle + "(" + listUnlimited.items.length +" items )";
    }

    listUnlimited.removeItem = function(itemIndex){
        listUnlimited.lastRemoved = "The last item removed was "+ listUnlimited.items[itemIndex].name;
        cartServices.removeItem(itemIndex)
        listUnlimited.title = originalTitle + "(" + listUnlimited.items.length +" items )";
    };
   
};


// The factory responsible to orchestrate a new Shopping Service when needed based on different parametes
function ShoppingServiceFactory(){
    var factory = function(maxItems){
        return new ShoppingService(maxItems);
    }

    return factory;
}

// The shopping service
function ShoppingService(maxItems = 0,$q, weightLossService){
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

//Decorator Pattern on shoppingService
ShoppingDecoratorService.$inject = ['$q','shoppingService','weightLossService']
function ShoppingDecoratorService($q, shoppingService, weightLossService){
    var service = this;

    service.getItems =function(){
        return shoppingService.getItems();
    };

    service.addItem = function(item){
        var promiseName = weightLossService.checkName(item.name);
        var promiseQuantity = weightLossService.checkQuantity(item.quantity);

        $q.all([promiseName,promiseQuantity])
        .then(function(response){
            shoppingService.addItem(item);
        })
        .catch(function(error){
            console.log(error.message);
        });
    }

    service.removeItem = function (itemIndex){
        shoppingService.removeItem(itemIndex);
    }
};

WeightLossService.$inject = ['$q','$timeout'];
function WeightLossService($q, $timeout){
    var service = this;

    service.checkName = function(name){
        var deferred = $q.defer();

        var result = {
            message : ""
        };

        $timeout(function (){
            if(name.toLowerCase().indexOf("cookie") === -1){
                deferred.resolve(result);
            }else{
                result.message = "You need to watch your weight cookies are bad ideas for weight loss.";
                deferred.reject(result);
            }
        },3000);

        return deferred.promise;
    };

    service.checkQuantity = function(quantity){
        var deferred = $q.defer();

        var result = {
            message : ""
        };

        $timeout(function() {
            if(quantity < 6){
                deferred.resolve(result);
            }else{
                result.message = "C'mon That a lot! We are on a diet.";
                deferred.reject(result);
            }
        },1000);

        return deferred.promise;
    }
};

})();