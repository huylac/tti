angular.module('tti.controllers', [])

.controller('AppCtrl', ['$scope','$state','$ionicTabsDelegate','currentAuth','Auth', 'CONST',
        function($scope, $state, $ionicTabsDelegate, currentAuth, Auth, CONST) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //    $ionicTabsDelegate.selectedIndex(1);
  //
  //});

    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {

        if (authData) {
            $scope.authData = authData;
            var ref = new Firebase(CONST.DB_ROOT_REF);

            var userInfo = {provider: authData.provider};

            switch (authData.provider) {
                case 'password':
                    userInfo.name = authData.password.email.replace(/@.*/, '');
                    userInfo.email = authData.password.email;
                    userInfo.profileImg = authData.password.profileImageURL;
                    break;
                case 'facebook':
                    userInfo.name = authData.facebook.displayName;
                    userInfo.email = authData.facebook.email;
                    userInfo.profileImg = authData.facebook.profileImageURL;
                    break;
            }

            ref.child("users").child(authData.uid).once("value", function(snapShot) {
                if (!snapShot.exists()) {
                    console.log("check-----" + snapShot.ref());
                    snapShot.ref().set(userInfo);
                }
            })
            $scope.userInfo = userInfo;
        }

    });

    $scope.logout = function() {
        $scope.auth.$unauth();
        $state.go('login');
    }


}])

.controller('FeedCtrl', ['$scope','currentAuth', function($scope, currentAuth) {
    console.log("voooooooooo");

}])
.controller('ExploreCtrl', ['$scope','currentAuth', function($scope, currentAuth) {


}])
.controller('NotificationCtrl', ['$scope','currentAuth', function($scope, currentAuth) {


}])
.controller('AccountCtrl', ['$scope','currentAuth', function($scope, currentAuth) {


}])

//.controller('PlaylistCtrl', ['currentAuth', function($scope, $stateParams, currentAuth) {
//}])

.controller('LoginCtrl', function($scope, Auth, $state, $cordovaOauth) {
    $scope.loginData = {};
    $scope.doLogin = function() {

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        Auth.$authWithPassword({
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }).then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            $state.go('tab.feed');
        }).catch(function(error) {
            console.log(error);
        });


    };
    $scope.doFbLogin = function() {

        $cordovaOauth.facebook("500433103451209", ["email"]).then(function(result) {
            Auth.$authWithOAuthToken("facebook", result.access_token).then(function(authData) {
                console.log(JSON.stringify(authData));
                $state.go('tab.feed');
            }, function(error) {
                console.error("ERROR: " + error);
            });
        }, function(error) {
            console.log("ERROR: " + error);
        });
    };
})

.controller('RegistryCtrl', function($scope, Auth, $state) {
    $scope.loginData = {};
    $scope.doRegistry = function() {

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        Auth.$createUser({
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }).then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            Auth.$authWithPassword({
                email: $scope.loginData.email,
                password: $scope.loginData.password
            }).then(function(authData) {
                $state.go('tab.feed');

            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error);
        });
    };
});