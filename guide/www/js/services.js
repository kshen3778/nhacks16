angular.module('app.services', [])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://resplendent-inferno-1830.firebaseio.com");
  return $firebaseAuth(usersRef);
})

.factory("users", function($firebaseArray) {
  var itemsRef = new Firebase("https://resplendent-inferno-1830.firebaseio.com/users");
  return $firebaseArray(itemsRef);
})

.factory("reqs", function($firebaseArray) {
  var itemsRef = new Firebase("https://resplendent-inferno-1830.firebaseio.com/reqs");
  return $firebaseArray(itemsRef);
})

.factory("authData", function(Auth, $ionicPopup){
  var authData = {};
  authData.isLoggedIn = function(){
    var aData = Auth.$getAuth();
    if(aData){
      return true;
    }
    return false;
  };
  
  authData.logOut = function(){
    Auth.$unauth();  
  };
  
  authData.getUserId = function(){
    var aData = Auth.$getAuth();
    return aData.uid;
  };
  
  authData.showError = function(error) {
   var alertPopup = $ionicPopup.alert({
     title: 'Error!',
     template: error
   });
 };
  
  return authData;

})