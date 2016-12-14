"use strict";

var app = angular.module("DE", ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $routeProvider
        .when('/', {
            templateUrl: '/templates/index',
            controller: 'indexCtrl'
        })
        .when('/main', {
            templateUrl: '/templates/main',
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: '/templates/login',
            controller: "loginCtrl"
        })
        .when('/expenses', {
            templateUrl: '/templates/expenses',
            controller: "expensesCtrl"
        })
        .when('/earnings', {
            templateUrl: '/templates/earnings',
            controller: "earningsCtrl"
        })
        // .when('/graphics', {
        //     templateUrl: '/templates/graphics',
        //     controller: "graphicsCtrl"
        // })
        // .when('/plans', {
        //     templateUrl: '/templates/plans',
        //     controller: "plansCtrl"
        // })
        .when('/debts', {
            templateUrl: '/templates/debts',
            controller: "debtsCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);


app.run(function($rootScope, $location, $http) {

    var USER_ROLES = {
        admin: 1,
        user: 1
    };

    var pages = {
        "/": 0,
        "/login": 0,
        "/expenses": USER_ROLES.user,
        "/earnings": USER_ROLES.user,
        // "/graphics",
        // "/plans",
        "/main": USER_ROLES.user,
        "/debts": USER_ROLES.user
    };

    $rootScope.$on("$routeChangeStart", function(event, next) {

        if (pages[next.originalPath] != $rootScope.user.rule) {

            if (!$rootScope.user.isAuth) {
                $location.path("/");
            } else {
                $location.path("/main");
            }

        }

    });

});