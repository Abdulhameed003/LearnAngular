(function(){
'use strict';

var shoppingList1 = ['Milk','Bread','Butter','Ice cream', 'Apples','Clementine'];
var shoppingList2 = [
    {name: "Milk", quantity:3}, {name: "Bread", quantity:43}, {name:"Potatoes", quantity: 300}
];

angular.module('app', [])
.controller('firstController', firstController)
.controller('secondController', secondController)
.filter('likeToLove', LikeToLoveFilter) // used in registering custom filter.
.filter('replace', ReplaceFilter)  //used in registering custom filters;

firstController.$inject = ['$scope', '$filter','likeToLoveFilter']; // enable minification on DI
function firstController($scope, $filter, likeToLoveFilter){
    var parent = this;
    parent.value = 1;

    $scope.name = "";
    $scope.totalNameValue = 0;
    $scope.transportCost = 3.45;
    $scope.shopList1 = shoppingList1;
    $scope.shopList2  =  shoppingList2;

    $scope.addItem = function(){
        var newItem = {
            name : $scope.itemName,
            quantity: $scope.itemQuantity
        };

        $scope.shopList2.push(newItem);
    };

    $scope.displayTotalNameValue = function() {
        var totalValue = calculateNamevalue($scope.name);
        $scope.totalNameValue = totalValue;
    };

    $scope.upper = function(){
        var msg = "I like programming in Javascript";
        var upperCaseWord = $filter('uppercase')(msg);
        return msg;
    };


    $scope.likeToLove = function (){
        var msg = "I like programming in Javascript";
        msg = likeToLoveFilter(msg);
        return msg;
    }


    function calculateNamevalue(name) {
        var countName = 0;
        for(var count = 0; count < name.length; count++){
            countName += name.charCodeAt(count);
        }

        return countName;
    };
};

function secondController(){
    var child = this;
    child.value = 5;

};

function LikeToLoveFilter () {
    return function (input){
        var input = input || ""; // assign input to input or empty string
        input = input.replace("like", "love");
        input = input.replace("likes","loves")
        return input;
    }
};

function ReplaceFilter(){ //used in the frontend
    return function(input, target, replace){
        var input = input || ""; // assign input to input or empty string
        input = input.replace(target, replace);
        return input;
    }
}
})(); 