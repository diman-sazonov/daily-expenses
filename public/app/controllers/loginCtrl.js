app.controller("loginCtrl", function($scope, $rootScope, $http) {

    $scope.loading = false;

    $scope.signInParams = {
        username: "",
        password: "",
        error: false
    };

    $scope.signUpParams = {
        username: "",
        password: "",
        secondPassword: "",
        errorPasswords: false,
        errorLogin: false
    };

    $scope.params = {
        signInFormShow: true,
        signUpFormShow: false
    };
    
    $scope.signIn = function() {

        //if ($scope.signInParams.username == "admin") return;
        $scope.loading = true;

        $http.post("/signIn", {
            username: $scope.signInParams.username,
            password: $scope.signInParams.password
        }).success(function(data) {

            window.location.href = '/main';

        }).error(function(message, status_code) {

            if (status_code == 404){
                $scope.signInParams.error = true;
            }

            $scope.loading = false;

        });

    };

    $scope.signUp = function() {

        var password = $scope.signUpParams.password;
        var secondPassword = $scope.signUpParams.secondPassword;

        if (password != secondPassword) {

            $scope.signUpParams.errorPasswords = true;
            return;

        }

        $scope.loading = true;

        $http.post("/signUp", {
            username: $scope.signUpParams.username,
            password: $scope.signUpParams.password
        }).success(function(data) {

            $scope.signInParams = {};
            $scope.signUpParams = {};
            $scope.showSignInForm();
            $scope.loading = false;

        }).error(function(data, status_code) {

            if (status_code == 403) {

                $scope.signUpParams.errorLogin = true;

            }

            $scope.loading = false;

        });

    };

    $scope.showSignInForm = function() {

        $scope.params.signInFormShow = true;
        $scope.params.signUpFormShow = false;

    };

    $scope.showSignUpForm = function() {

        $scope.params.signInFormShow = false;
        $scope.params.signUpFormShow = true;

    };
    
});