(function(){

  'use strict';

  //*************************************
  //* here we define our app in angular *
  //*************************************

  angular.module('BlogApp', ['ui.router', 'ngSanitize']); //'ngRoute',


  angular
      .module('BlogApp')
      .config([ '$stateProvider'
              , '$urlRouterProvider'
              , routeConfig
              ]);



  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        views:{
            'createPost':{
                  templateUrl: './views/createpost.html',
                  controller: 'createPostController'
            },
            'viewPost':{
                templateUrl: './views/viewpost.html',
                controller: 'viewPostsController'
            },

        }
      })
      .state('post', {
        url: '/:post',
        views:{
            'viewSinglePost':{
                templateUrl: './views/viewsinglepost.html',
                controller: 'viewSinglePostController'
            },
        }
      });
      $urlRouterProvider.otherwise('/');
      
  }




})();


(function(){

  'use strict';

  angular
      .module('BlogApp')
      .factory('fetcher', [ '$http'
                          , '$location'
                          , '$q'
                          , fetcherFactory
                          ]);


  function fetcherFactory ( $http
                          , $location
                          , $q
                          ){


      var o = {

        createPost:   createPost,
        getPost:      getPost,
        getPosts:     getPosts,
        removePost:   removePost,
        search:       search,
        writeComment: writeComment

      }


      return o;



      function getPosts(){
          return $http.get("/rest/posts/" + $location.search().page) //HTTP GET CALL to mongodb REST API
          .then(function(res) {
            return res.data;
          });
      };

      function getPost(id){
          return $http.get("/rest/post/" + id) //HTTP GET CALL to mongodb REST API
          .then(function(res) {
            return res.data;
          });
      };

      function removePost(id){
          return $http.post("/rest/remove/", id) //HTTP GET CALL to mongodb REST API
          .then(function(res) {
            return res.data;
          });
      };

      function createPost(json){

        $http.post("/rest/create/" , json);

      }


      function writeComment(id, json){

        $http.post("/rest/comment/"+id , json);

      }

      function search(query){

        return $http.get("/rest/Search/" + query + "/" + $location.search().page) //HTTP GET CALL to mongodb REST API
          .then(function(res) {
            return res.data;
          });
      }


  }


})();



(function(){

  'use strict';

  angular
      .module('BlogApp')
      .controller('viewPostsController', 
                 [ '$scope'
                 , '$stateParams'
                 , '$http'
                 , '$location'
                 , '$sce'
                 , 'fetcher'
                 , viewPostsController //<-our controller function
                 ]);



  function viewPostsController( $scope
                         , $stateParams
                         , $http
                         , $location
                         , $sce
                         , fetcher
                        ){

    fetcher.getPosts().then(function(response){ 
      $scope.posts = response;    
    });
    
    $scope.changePage = function(number){
      $location.url("?page="+number);
      if(!$scope.search){
        $scope.posts = fetcher.getPosts();
      }
      else{
        $scope.posts = fetcher.search(query);
      }

    }

    $scope.searchQuery = function(query){
      $location.url("?page=1");
      fetcher.search(query).then(function(response){
        $scope.posts = response;
      });
      $scope.search = true;
    }

    $scope.getProperDate = function(date){
      var monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];
      var dateObj = new Date(date);
      var month = monthNames[dateObj.getMonth()]; //months from 1-12
      var day = dateObj.getDate();
      var year = dateObj.getFullYear();

      return month + " " + day + " " + year;
    }

    $scope.selectPost = function(post){

      $scope.selectedPost = post;

      $("#selectedPost").removeClass("displayNone");  
      $("#postPreview").addClass("displayNone");

    }

    $scope.goBackButton = function(){

      $("#postPreview").removeClass("displayNone");  
      $("#selectedPost").addClass("displayNone");
    }


    $scope.updateLinkView = function(html){
      //$($("figure").closest("div")).find("a").append("view file");
      $($("figure").closest("div")).each(function(){
        var link = $(this).find("a").attr("href");
        var figure = $(this).find("figure");
        $(this).find("figure").remove();
        console.log(figure);
        $(this).append('<a href="'+ link +'">' + figure.html() + '</a>')

      })
    };

    $scope.removePost = function(id){


      var pass = prompt("Please enter the admin password:", "");

        var json = {};

        if (pass != null && pass != "") {
           json.password = pass;
           json.id = id;

           fetcher.removePost(json);
         } 


    }

    //$scope.changePage(1);

    window.sc = $scope;

  }

})();


(function(){

  'use strict';

  angular
      .module('BlogApp')
      .controller('createPostController', 
                 [ '$scope'
                 , '$stateParams'
                 , '$http'
                 , 'fetcher'
                 , createPostController //<-our controller function
                 ]);



  function createPostController ( $scope
                                , $stateParams
                                , $http
                                , fetcher
                                ){

    $scope.froalaOptions = {
        toolbarButtons : ["bold", "italic", "underline", "|", "align", "image", "formatOL", "formatUL"]
    }
    $scope.postToCreate = {};

    $scope.createPost = function(){
      $scope.postToCreate.content = document.querySelector("trix-editor").value;
      $scope.postToCreate.preview = document.querySelector("trix-editor").editor.getDocument().toString();
      console.log($scope.postToCreate);
      fetcher.createPost($scope.postToCreate); //do postToCreate.something model in html
      window.location.reload();
    }

    window.sc2 = $scope;

  }


})();





(function(){

  'use strict';

  angular
      .module('BlogApp')
      .controller('viewSinglePostController', 
                 [ '$scope'
                 , '$stateParams'
                 , '$http'
                 , '$location'
                 , '$sce'
                 , 'fetcher'
                 , viewSinglePostController //<-our controller function
                 ]);



  function viewSinglePostController( $scope
                         , $stateParams
                         , $http
                         , $location
                         , $sce
                         , fetcher
                        ){


    fetcher.getPost($stateParams.post).then(function(response){ 
      $scope.post = response;    
    });
    

    $scope.writeComment = function(){
      var json ={
        body:  document.querySelector("trix-editor").value
      }
      fetcher.writeComment($stateParams.post, json);
    }

  }

})();