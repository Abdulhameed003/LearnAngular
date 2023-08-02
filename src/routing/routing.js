(function() {
'use strict;'

    angular.module('shoppingApp')
    .config(RouterConfig);

    RouterConfig.$inject =['$stateProvider', '$urlRouterProvider']
    function RouterConfig($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'src/shoppingApp/templates/home.template.html'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'src/shoppingApp/templates/registration-form.template.html',
            controller: 'registrationController as reg'
        })
        .state('shop',{
            url: '/shop',
            templateUrl: 'src/shoppingApp/templates/shop.template.html'
        })
        .state('main-list',{
            url: '/product-list',
            templateUrl: 'src/shoppingApp/templates/main-list.template.html',
            controller: 'showDefaultListController as list', // providing controller within a route to control the template
            resolve: {
                items: ['shoppingDecoratorService', function(shoppingDecoratorService){
                    return shoppingDecoratorService.getDefaultItems();
                }]
            }// this allows the router to resolve getting the data before showing the page
        })
        .state('main-list.item-details', {
            // url: '/item-details/{itemId}',
            templateUrl: 'src/shoppingApp/templates/item-details.template.html',
            controller: 'showItemDetailsController as itemDetail',
            params: {
                itemId: null
            }
        });
    }
})();