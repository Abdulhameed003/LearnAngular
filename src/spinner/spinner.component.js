(function() {
'use strict;'
    
    angular.module('spinner')
    .component('spinnerLoader',{
        templateUrl: 'src/spinner/spinner.template.html',
        controller: SpinnerLoaderController,
    });

    SpinnerLoaderController.$inject =  ['$rootScope']
    function SpinnerLoaderController($rootScope){
        var $ctrl = this;

        var canceller = [];
        $ctrl.$onInit = function(){
            var cancel = $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams, options){
                $ctrl.showSpinner = true;
            });
            canceller.push(cancel);

            cancel = $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                $ctrl.showSpinner = false;
            });
            canceller.push(cancel);

            cancel = $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error){
                $ctrl.showSpinner = false;
            })
            canceller.push(cancel);
        };

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

            canceller.forEach(function(listener){
                listener();
            })
        }
    }
})();