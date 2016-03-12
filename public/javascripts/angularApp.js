var app = angular.module('tour', ['ui.router']);

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};
  
  //save the login token into localStorage
  auth.saveToken = function(token){
    $window.localStorage['tour-token'] = token;
  };
  
  //get token from localStorage
  auth.getToken = function(){
    return $window.localStorage['tour-token'];
  };
  
  //check if user is logged in(token exists and isn't expired)
  auth.isLoggedIn = function(){
    var token = auth.getToken();
    if(token){ //check if token exists
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000; //check for expiration
    } else {
      return false; //user is logged out
    }
  };
  
  //return username of user that's logged in
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.username;
    }
  };
  
  //register the user and save the token returned
  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  
  //login the user and save the token returned
  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  
  //logout by removing token from localStorage
  auth.logOut = function(){
    $window.localStorage.removeItem('tour-token');
  };
  return auth;
}]);

//controls posts
app.controller('MainCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
       
        $scope.isLoggedIn = auth.isLoggedIn;
        
    }
]);



//controller for navbar
app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  //expose methods from auth factory
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};
  
  //calls the register method in auth factory
  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){ //if no errors, promise the user home
      $state.go('home');
    });
  };
  
  //calls the login method in auth factory
  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){ //if no errors, promise the user home
      $state.go('home');
    });
  };
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){

    //home state
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
    });

    
    //login state (accessible once logged in)
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          //if logged in then proceed to home
          $state.go('home');
        }
      }]
    });
    
    //register state (accessible once logged in)
    $stateProvider.state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

    $urlRouterProvider.otherwise('home');

}]);
