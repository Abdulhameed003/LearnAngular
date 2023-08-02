//Testing Services and $http service
describe("Album App Service functions", function(){
    var $httpBackEnd;
    var apiBaseURL;
    var albumsService;

    beforeEach( function(){
        module('albumApp');
        inject(function($injector){
            albumsService = $injector.get('albumService');
            apiBaseURL = $injector.get('ApiBaseURL');
            $httpBackEnd = $injector.get('$httpBackend')
        });
    });

    it("getAlbums should retrun list of albums", function(){
        //mock expected result form http call
        $httpBackEnd.whenGET(apiBaseURL + "/albums").respond(['Album1','Album2']);

        //call method to test
        albumsService.getAlbums().then(function(response){
            expect(response.data).toEqual(['Album1','Album2']);
        });

        //release httpClient 
        $httpBackEnd.flush();
    });

    it("getAlbumById should return album with specified id", function(){
        $httpBackEnd.whenGET(apiBaseURL + "/albums/?id=3")
            .respond({"userId":1, "id":3, "title": "My title"});
        
        albumsService.getAlbumById(3).then(function(response){
            expect(response.data).toEqual({"userId":1, "id":3, "title": "My title"});
        });

        $httpBackEnd.flush();

    });
});