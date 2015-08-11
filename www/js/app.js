angular.module('tti', ['ionic', 'tti.controllers', 'firebase','ngCordovaOauth','ionic.ion.headerShrink'])

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

.config(function($stateProvider, $urlRouterProvider) {

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

  //.state('app', {
  //  url: '/app',
  //  abstract: true,
  //  templateUrl: 'templates/menu.html',
  //  controller: 'AppCtrl',
  //  resolve: {
  //    // controller will not be loaded until $waitForAuth resolves
  //    // Auth refers to our $firebaseAuth wrapper in the example above
  //    'currentAuth': ['Auth', function(Auth) {
  //      // $waitForAuth returns a promise so the resolve waits for it to complete
  //      return Auth.$waitForAuth();
  //    }]
  //  }
  //})
  //
  //.state('app.search', {
  //  url: '/search',
  //  views: {
  //    'menuContent': {
  //      templateUrl: 'templates/search.html'
  //    }
  //  }
  //})
  //
  //.state('app.browse', {
  //    url: '/browse',
  //    views: {
  //      'menuContent': {
  //        templateUrl: 'templates/browse.html'
  //      }
  //    }
  //  })
  //.state('app.playlists', {
  //    url: '/playlists',
  //    views: {
  //      'menuContent': {
  //        templateUrl: 'templates/playlists.html',
  //        controller: 'PlaylistsCtrl'
  //      }
  //    },
  //    resolve: {
  //      // controller will not be loaded until $requireAuth resolves
  //      // Auth refers to our $firebaseAuth wrapper in the example above
  //      'currentAuth': ['Auth', function(Auth) {
  //        // $requireAuth returns a promise so the resolve waits for it to complete
  //        // If the promise is rejected, it will throw a $stateChangeError (see above)
  //        return Auth.$requireAuth();
  //      }]
  //    }
  //  })
  //
  //.state('app.single', {
  //  url: '/playlists/:playlistId',
  //  views: {
  //    'menuContent': {
  //      templateUrl: 'templates/playlist.html',
  //      controller: 'PlaylistCtrl'
  //    }
  //  },
  //  resolve: {
  //    // controller will not be loaded until $requireAuth resolves
  //    // Auth refers to our $firebaseAuth wrapper in the example above
  //    'currentAuth': ['Auth', function(Auth) {
  //      // $requireAuth returns a promise so the resolve waits for it to complete
  //      // If the promise is rejected, it will throw a $stateChangeError (see above)
  //      return Auth.$requireAuth();
  //    }]
  //  }
  //})

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
]);