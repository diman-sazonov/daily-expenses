app.controller("DE_headerCtrl", function($scope, $rootScope, $http) {

    var cookie = {};

    $rootScope.user = {};

    $scope.hideUserLinks = true;

    $scope.signOut = function () {

        $http.post("/signOut").success(function() {

            for (var key in cookie) {
                if (cookie.hasOwnProperty(key)) {
                    document.cookie = key + "=" + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
                }
            }

            window.location.href = '/';
            
        });

    };

    function cookieParser() {

        var _cookie = document.cookie.split('; ');

        for (var i in _cookie) {
            if (_cookie.hasOwnProperty(i)) {
                var key = _cookie[i].split('=')[0];
                cookie[key] = decodeURIComponent(_cookie[i].split('=')[1]);
            }
        }

    }

    function init() {

        cookieParser();

        $rootScope.user.isAuth = !!cookie['isAuth'];
        $rootScope.user.username = cookie['username'];

        switch(cookie['username']) {
            case "admin":
                $rootScope.user.rule = 2;
                break;
            case undefined:
                $rootScope.user.rule = 0;
                break;
            default:
                $rootScope.user.rule = 1;
        }

    }

    init();

});