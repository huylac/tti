angular.module('tti', ['ionic', 'tti.controllers', 'firebase','ngCordovaOauth','jett.ionic.scroll.sista'])

.constant('CONST', {
      'DB_ROOT_REF': 'https://thetienich.firebaseio.com'
    })

.run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if(window.StatusBar) {
      StatusBar.overlaysWebView(false);
      StatusBar.backgroundColorByHexString('#DD2C00');
      StatusBar.styleBlackTranslucent();
    }
  });


  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
        $state.go('login');
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.style("standard");
  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle("center");

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('registry', {
    url: '/registry',
    templateUrl: 'templates/registry.html',
    controller: 'RegistryCtrl'
  })

  .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      //controller: 'AppCtrl',
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        'currentAuth': ['Auth', function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$waitForAuth();
        }]
      }
  })
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    },
    resolve: {
      // controller will not be loaded until $requireAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      'currentAuth': ['Auth', function(Auth) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireAuth();
      }]
    }
  })
  .state('tab.explore', {
    url: '/explore',
    views: {
      'tab-explore': {
        templateUrl: 'templates/tab-explore.html',
        controller: 'ExploreCtrl'
      }
    },
    resolve: {
      // controller will not be loaded until $requireAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      'currentAuth': ['Auth', function(Auth) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireAuth();
      }]
    }
  })
  .state('tab.notification', {
    url: '/notification',
    views: {
      'tab-notification': {
        templateUrl: 'templates/tab-notification.html',
        controller: 'NotificationCtrl'
      }
    },
    resolve: {
      // controller will not be loaded until $requireAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      'currentAuth': ['Auth', function(Auth) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireAuth();
      }]
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    resolve: {
      // controller will not be loaded until $requireAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      'currentAuth': ['Auth', function(Auth) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireAuth();
      }]
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

.factory('Auth', ['$firebaseAuth', 'CONST',
  function($firebaseAuth, CONST) {
    var ref = new Firebase(CONST.DB_ROOT_REF);
    return $firebaseAuth(ref);
  }
])

.directive('navBarClass', function() {
  return {
    restrict: 'A',
    compile: function(element, attrs) {

      // We need to be able to add a class the cached nav-bar
      // Which provides the background color
      var cachedNavBar = document.querySelector('.nav-bar-block[nav-bar="cached"]');
      var cachedHeaderBar = cachedNavBar.querySelector('.bar-header');

      // And also the active nav-bar
      // which provides the right class for the title
      var activeNavBar = document.querySelector('.nav-bar-block[nav-bar="active"]');
      var activeHeaderBar = activeNavBar.querySelector('.bar-header');
      var barClass = attrs.navBarClass;
      var ogColors = [];
      var colors = ['positive', 'stable', 'light', 'royal', 'dark', 'assertive', 'calm', 'energized'];
      var cleanUp = function() {
        for (var i = 0; i < colors.length; i++) {
          var currentColor = activeHeaderBar.classList.contains('bar-' + colors[i]);
          if (currentColor) {
            ogColors.push('bar-' + colors[i]);
          }
          activeHeaderBar.classList.remove('bar-' + colors[i]);
          cachedHeaderBar.classList.remove('bar-' + colors[i]);
        }
      };
      return function($scope) {
        $scope.$on('$ionicView.beforeEnter', function() {
          cleanUp();
          cachedHeaderBar.classList.add(barClass);
          activeHeaderBar.classList.add(barClass);
        });

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          for (var j = 0; j < ogColors.length; j++) {
            activeHeaderBar.classList.add(ogColors[j]);
            cachedHeaderBar.classList.add(ogColors[j]);
          }
          cachedHeaderBar.classList.remove(barClass);
          activeHeaderBar.classList.remove(barClass);
          ogColors = [];

        });
      };
    }
  };
});