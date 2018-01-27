
(function () {
    var app = angular.module('app', ["ngRoute", "angular-jwt"]);

    app.config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: './templates/main.html',
            controller: 'MainController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/login', {
            templateUrl: './templates/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/facebook/:token', {
            templateUrl: './templates/facebook.html',
            controller: 'FacebookController',
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        });

        $routeProvider.otherwise('/');
    });

    app.controller('MainController', MainController);
    function MainController($location, $window, $http, jwtHelper, $scope) {

        var vm = this;
        vm.title = "MainController";
        vm.user = null;

        vm.logout = function () {
            delete $window.localStorage.token;
            delete $window.localStorage.city;
            vm.user = null;
            vm.businesses = [];
            $location.path('/');
        }

        vm.attend = function (bar) {
            $http.put('/api/location/addUser/' + bar._id, { user: vm.user }).then(function (res) {
                vm.findBars(bar.city);
            }, function (err) {
                console.log(err);
            });
        }

        vm.cancel = function (bar) {
            $http.put('/api/location/leave/' + bar._id, { user: vm.user }).then(function (res) {
                vm.findBars(bar.city);
            }, function (err) {
                console.log(err);
            });
        }

        vm.findBars = function (city) {
            $window.localStorage.city=vm.city;
            $http.get('/api/location/' + city).then(function (res) {
                vm.businesses = res.data.businesses || res.data.jsonBody.businesses;
            }, function (err) { 
                console.log(err); 
            });
        }
        if ($window.localStorage.token) {
            var token = $window.localStorage.token;
            vm.user=jwtHelper.decodeToken(token);
            if($window.localStorage.city !==undefined && $window.localStorage.city!==null){
            vm.findBars($window.localStorage.city);
        }
        }

    }

    app.controller('FacebookController', FacebookController);
    function FacebookController($location, $window, $http, $routeParams, jwtHelper) {
        var vm = this;
        vm.title = "FacebookController";
        vm.error = '';

        vm.facebook = function () {
            if (jwtHelper.decodeToken($routeParams.token)) {
                $window.localStorage.token = $routeParams.token;
                $location.path('/');
            }
            else {
                alert('An error has occurred');
                $location.path('/')
            }
        }
        vm.facebook();
    }
}());
