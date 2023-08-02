(function(){
'use strict';

angular.module('albumApp', [])
.controller('albumController', AlbumController)
.service('albumService', AlbumService)
.constant('ApiBaseURL', "https://jsonplaceholder.typicode.com");

AlbumController.$inject = ['albumService'];
function AlbumController(albumService){
    var ctrl = this;
   
    var promise = albumService.getAlbums();

    promise.then(function(response){
        ctrl.albums = response.data;
    })
    .catch(function(error){
        console.log("an erro has ocured");
    });

    ctrl.getAlbumById = function(id){
        var promise = albumService.getAlbumById(id);

        promise.then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error.data);
        });
    };

};

AlbumService.$inject = ['$http','ApiBaseURL'];
function AlbumService($http, ApiBaseURL){
    var service = this;

    service.getAlbums = function() {
        var response = $http({
           method: 'GET',
           url:(ApiBaseURL + "/albums")
        });

        return response; // returns a promise
    }

    service.getAlbumById = function(id){
        var response = $http({
            method : "GET",
            url : (ApiBaseURL + "/albums/"),
            params : {
                id : id
            }
        });

        return response; //returns a promise
    }
};
})();