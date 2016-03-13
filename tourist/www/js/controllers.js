angular.module('app.controllers', [])

.controller('navCtrl', function($scope,authData){
  $scope.isLoggedIn = authData.isLoggedIn;
})

.controller('splashCtrl', function($scope, $state, Auth, authData) {
  if(authData.isLoggedIn()){
    $state.go('login');
  }

})

.controller('signupCtrl', function($scope, $state, $ionicHistory, Auth, users, authData) {
  $scope.user = {};
  $scope.register = function(){
    Auth.$createUser({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(userData) {
      //console.log(JSON.stringify(Auth.$getAuth()));
      console.log("User " + userData.uid + " created successfully!");
      return Auth.$authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password
      });
    }).then(function(curAuth) {
      users.$add({'uid': curAuth.uid, 'name': $scope.user.name, 'surname': $scope.user.surname, 'avatar': curAuth.password.profileImageURL.slice(0,-8)+"?d=mm.png", 'email': $scope.user.email, 'phone': $scope.user.phone, 'type' : 'tourist'});
      var ref = new Firebase("https://resplendent-inferno-1830.firebaseio.com/users");
      ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key();
          var childData = childSnapshot.val();
          if(childData.uid === curAuth.uid && childData.type === 'guide'){
            authData.logOut();
            console.error("Authentication failed: User is not a tourist");
            authData.showError("Authentication Failed: User is not a tourist");
          } else {
            console.log("Logged in as:", curAuth.uid);
            $scope.user.name = "";
            $scope.user.surname = "";
            $scope.user.phone = "";
            $scope.user.email = "";
            $scope.user.password = "";
            $state.go("login");
            $ionicHistory.clearHistory();
          }
        })
      });
    }).catch(function(error) {
      console.error("Error: ", error);
      authData.showError("Registration Failed");
    });
  };
})
   
.controller('loginCtrl', function($scope, $state, $ionicHistory, Auth, authData) {
  $scope.user = {};
  $scope.isLoggedIn = authData.isLoggedIn;
  $scope.logOut = function(){
    authData.logOut();
    $state.go("splash");
    $ionicHistory.clearHistory();
  };
  
  $scope.logIn = function(){
    Auth.$authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password
    }).then(function(curAuth) {
      var ref = new Firebase("https://resplendent-inferno-1830.firebaseio.com/users");
      ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key();
          var childData = childSnapshot.val();
          if(childData.uid === curAuth.uid && childData.type === 'guide'){
            authData.logOut();
            console.error("Authentication failed: User is not a tourist");
            authData.showError("Authentication Failed: User is not a tourist");
          } else {
            console.log("Logged in as:", curAuth.uid);
            $scope.user.name = "";
            $scope.user.email = "";
            $scope.user.password = "";
            $state.go("login");
            $ionicHistory.clearHistory();
          }
        })
      });
    }).catch(function(error) {
        console.error("Authentication failed:", error);
        authData.showError("Authentication Failed");
    });
  };
  
})
   
.controller('toursCtrl', function($scope, authData) {
  $scope.isLoggedIn = authData.isLoggedIn;
})
   
.controller('tourguide2Ctrl', function($scope, authData) {
  var guides = new Array();
  var ref = new Firebase("https://resplendent-inferno-1830.firebaseio.com/users");
  ref.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      if(childData.type === 'guide'){
        guides.push(childData);
      }
    })
  })
  $scope.guides = guides;
})
   
.controller('mapCtrl', function($scope, authData) {

})
   
.controller('tourGuideSignupCtrl', function($scope) {

})
   
.controller('requestCtrl', function($scope, $state, $ionicHistory, authData, reqs, Auth) {
  $scope.request = {};
  $scope.request.uid = authData.getUserId();
  $scope.addReq = function(){
    reqs.$add($scope.request);
    console.log($scope.request);
    $scope.request.name = "";
    $scope.request.location = "";
    $scope.request.desc = "";
    $state.go('login');
    $ionicHistory.clearHistory();
  };
})
  
.controller('profileCtrl', function($scope, $state, authData, reqs, Auth){
  $scope.id = authData.getUserId();
  console.log(Auth.$getAuth());
  $scope.email = Auth.$getAuth().password.email;
  
  var ref = new Firebase("https://resplendent-inferno-1830.firebaseio.com/reqs");
  var myrequests = new Array();
  ref.once("value", function(snapshot) {
    
    snapshot.forEach(function(childSnapshot) {
      
      var key = childSnapshot.key();
     
      var childData = childSnapshot.val();
      console.log(JSON.stringify(childData));
      if(childData.uid === Auth.$getAuth().uid){
        myrequests.push(childData);
      }
    });
  });
  
  $scope.requests = myrequests;
  
  $scope.delete = function(request){
      console.log(JSON.stringify(request));
      /*var n = reqs.$indexFor(request.$id);
      console.log(n);
      var item = reqs[n];
      console.log(item);
      reqs.$remove(item).then(function(ref) {
        ref.key() === item.$id; // true
      });*/
      var index = 0;
      for(var i=0; i<myrequests.length; i++){
        if(myrequests[i].uid === request.uid){
          index = i;
          break;
        }
      }
      myrequests.splice(index, 1);
      
      $state.go('profile');
  };
})

.controller('popupCtrl',function($scope, $ionicPopup) {
 // Error
 $scope.showError = function(error) {
   var alertPopup = $ionicPopup.alert({
     title: 'Error!',
     template: error
   });
 };
});
 