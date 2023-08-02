(function() {
'use strict;'

    angular.module('shoppingApp')
    .service('shoppingDecoratorService', ShoppingDecoratorService) // used to decorate the main service to add functionality
    .service('weightLossService', WeightLossService); //a service that implements asynchronous program.
    
   
    //Decorator Pattern on shoppingService
    ShoppingDecoratorService.$inject = ['$q','$timeout','shoppingService','weightLossService']
    function ShoppingDecoratorService($q, $timeout, shoppingService, weightLossService){
        var service = this;
        
        service.getDefaultItems = function(){
            var deferred = $q.defer();

            items = [
                {name: 'Butter', quantity: '3', description: 'Butter used for baking cookies and cakes'},
                {name: 'Sugar', quantity: '2', description: 'Sugar makes food sweet and delicious'},
                {name: 'Flour', quantity: '1', description: 'A powdery substance used to bake pastries'}
            ];

            $timeout(function(){
                deferred.resolve(items);
            }, 500)
            
            return deferred.promise;
        }

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

    //A weight loss filter service
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