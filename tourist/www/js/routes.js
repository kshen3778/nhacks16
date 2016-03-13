angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('splash', {
    url: '/main',
    templateUrl: 'templates/splash.html',
    controller: 'splashCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tours', {
    url: '/Tours',
    templateUrl: 'templates/tours.html',
    controller: 'toursCtrl'
  })

  .state('tourguide2', {
    url: '/tourguide',
    templateUrl: 'templates/tourguide2.html',
    controller: 'tourguide2Ctrl'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

  .state('guide-signup', {
    url: '/guide-signup',
    templateUrl: 'templates/guide-signup.html',
    controller: 'guide-signupCtrl'
  })

  .state('request', {
    url: '/request',
    templateUrl: 'templates/request.html',
    controller: 'requestCtrl'
  })

$urlRouterProvider.otherwise('/main')

  

});