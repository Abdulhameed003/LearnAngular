describe('Test Shopping components', function(){
    var $componentControler;

    beforeEach(function(){
        module('shoppingApp');
        inject(function(_$componentController_){
            $componentControler = _$componentController_
        });
    })

    it('Component Controller should not contain cookie',function(){
        var bindings = { items:[{name:'item1', quantity:'1'}]};
        var $ctrl = $componentControler('shoppingListItem', 
        {$rootScope: null ,$element: null, $q: null, weightLossService: null },
        bindings);

        var cookiesInList = $ctrl.containsCookie();
        expect(cookiesInList).toBe(false);
    })

    it('Component controller should contain cookie',function(){
        var bindings = { items:[{name:'cookie', quantity:'1'}]};
        var $ctrl = $componentControler('shoppingListItem',
        {$rootScope: null ,$element: null, $q: null, weightLossService: null },
        bindings);

        var cookiesInList = $ctrl.containsCookie();
        expect(cookiesInList).toBe(true);
    })
});