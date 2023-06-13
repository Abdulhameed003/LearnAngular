(function(){
'use strict';

angular.module('LunchCheck', [])

.controller('lunchController', lunchController);

lunchController.$inject = ['$scope']
function lunchController($scope){
    $scope.lunchMenu = "";
    $scope.checkResult = "";
    $scope.status = "";

    $scope.checkLunchCapacity = function () {

        if($scope.lunchMenu == "" || $scope.lunchMenu.length <= 0){
            $scope.checkResult = "Please enter data first";
            $scope.status = "error";
            return;
        }

        var menuList = $scope.lunchMenu.split(',');

        var menuCount = getMenuCount(menuList);

        if(menuCount === 0 ){
            $scope.checkResult = "Please enter some dishes seperated with a comma eg Rice, Beans, Tomatoes ";
            $scope.status = "error";
        }else if(menuCount >= 1 && menuCount <= 3){
            $scope.checkResult = "Enjoy!";
            $scope.status = "success";
        }else{
            $scope.checkResult = "Too much!";
            $scope.status = "success";
        }
    };

    function getMenuCount(menuList){
        var counter = 0;
        menuList.forEach(menu=> {
            if(menu.trim().length >= 1){
                counter += 1;
            }
        });

        return counter;
    }
}
})();