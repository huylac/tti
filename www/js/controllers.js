var controllers = angular.module('tti.controllers', [])

controllers.controller('AppCtrl', ['$scope','$state','currentAuth','Auth', function($scope, $state, currentAuth, Auth) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
        $scope.authData = authData;
    });

    $scope.logout = function() {
        $scope.auth.$unauth();
        $state.go('login');
    }
  // Create the login modal that we will use later
 /* $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });*/



  // Perform the login action when the user submits the login form

}]);

controllers.controller('PlaylistsCtrl', ['$scope','currentAuth', function($scope, currentAuth) {

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
}]);

controllers.controller('PlaylistCtrl', ['currentAuth', function($scope, $stateParams, currentAuth) {
}]);

controllers.controller('LoginCtrl', function($scope, Auth, $state) {
    $scope.loginData = {};
    $scope.doLogin = function() {

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        Auth.$authWithPassword({
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }).then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            $state.go('app.playlists');
        }).catch(function(error) {
            console.log(error);
        });
    };
});

controllers.controller('RegistryCtrl', function($scope, Auth, $state) {
    $scope.loginData = {};
    $scope.doRegistry = function() {

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        Auth.$createUser({
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }).then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            $state.go('app.playlists');
        }).catch(function(error) {
            console.log(error);
        });
    };
});