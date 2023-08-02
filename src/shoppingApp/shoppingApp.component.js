(function () {
'use strict;'

    angular.module('shoppingApp')
    .component('shoppingListItem', {
        templateUrl : 'src/shoppingApp/templates/shopping-list.template.html',
        controller : ShoppingListController,
        controllerAs: 'list',
        bindings : {
            items : '<', // < - one way binding and = - bi-directional binding
            title : '@', // constant binding or single binding
            onRemove : '&' // a reference binding 
        },
        transclude: true
    });
    
    angular.module('shoppingApp')
    .component('itemInput',{
        templateUrl : 'src/shoppingApp/templates/item-input.template.html',
        controller: ShoppingInputController,
        bindings: {
            onAddItem: '&'
        }
    });

    function ShoppingInputController(){
        var $ctrl = this;
    
        $ctrl.name = "";
        $ctrl.quantity =""
    
        $ctrl.add = function(item){
            $ctrl.onAddItem({item:item});
        };
    }
    
    ShoppingListController.$inject =['$rootScope','$element', '$q', 'weightLossService']
    function ShoppingListController($rootScope, $element, $q, weightLossService){
        var list = this;
        var totalItem;
        
        list.containsCookie = function(){
            for(var i = 0; i < list.items.length; i++){
                var name = list.items[i].name;
                if(name.toLowerCase().indexOf("cookie") !== -1){
                    return true;
                }

                return false;
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
                    removeWarning
                })
                .catch(function(result){
                    //Show cookie warning
                    displayWarning();
                })
                .finally(function(){
                    $rootScope.$broadcast('shoppinglist:processing',{on: false})
                })
            }

        };
        
        function displayWarning(){
            var warningElement = $element.find("div.error");
            warningElement.slideDown(900);
        }

        function removeWarning(){
            var warningElement = $element.find("div.error");
            warningElement.slideUp(900);
        }
    };
    
})();