var app = angular.module('Grade', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'LoginCtrl'
    })
    .when('/register', {
        templateUrl: 'partials/register.html'
    })
    .when('/uploadGrade', {
        templateUrl: 'partials/uploadGrade.html'
    })
    .when('/viewGrade/:username', {
        templateUrl: 'partials/viewGrade.html',
        controller: 'ViewCtrl'
    })
    .when('/editGrade/:username', {
        templateUrl: 'partials/editGrade.html',
        controller: 'EditCtrl'
    })
    .otherwise({
        redirectTo: '/'
    })
}]);

app.controller('LoginCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.validate = function() {
            $scope.username = $scope.username == undefined ? "" : $scope.username;
            if (($scope.username).trim() == "") {
                $scope.message = "Username cannot be empty!";
                return;
            }
            var correctPassword = "";
            var Account = $resource('/api/accounts/:username');
            Account.get({username: $scope.username}, function(account) {
                correctPassword = account.password;
                if ($scope.password == correctPassword) {
                    $location.path('/viewGrade/' + $scope.username);
                }
                else {
                    $scope.message = "Wrong credential!";
                }
            });
        }
    }
]);

app.controller('ViewCtrl', ['$scope', '$resource', '$routeParams',
    function($scope, $resource, $routeParams) {
        var Account = $resource('/api/accounts/:username');
        Account.get({username: $routeParams.username}, function(account) {
            $scope.account = account;
            if ($scope.account.hw1 == -1) {
                $scope.account.hw1 = "--";
            }
            if ($scope.account.hw2 == -1) {
                $scope.account.hw2 = "--";
            }
            if ($scope.account.hw3 == -1) {
                $scope.account.hw3 = "--";
            }
            if ($scope.account.hw4 == -1) {
                $scope.account.hw4 = "--";
            }
            if ($scope.account.hw5 == -1) {
                $scope.account.hw5 = "--";
            }
            if ($scope.account.hw6 == -1) {
                $scope.account.hw6 = "--";
            }
            if ($scope.account.q1 == -1) {
                $scope.account.q1 = "--";
            }
            if ($scope.account.q2 == -1) {
                $scope.account.q2 = "--";
            }
            if ($scope.account.q3 == -1) {
                $scope.account.q3 = "--";
            }
            if ($scope.account.q4 == -1) {
                $scope.account.q4 = "--";
            }
            if ($scope.account.q5 == -1) {
                $scope.account.q5 = "--";
            }
            if ($scope.account.q6 == -1) {
                $scope.account.q6 = "--";
            }
            if ($scope.account.q7 == -1) {
                $scope.account.q7 = "--";
            }
            if ($scope.account.q8 == -1) {
                $scope.account.q8 = "--";
            }
            if ($scope.account.q9 == -1) {
                $scope.account.q9 = "--";
            }
            if ($scope.account.q10 == -1) {
                $scope.account.q10 = "--";
            }
            if ($scope.account.midterm == -1) {
                $scope.account.midterm = "--";
            }
            if ($scope.account.final == -1) {
                $scope.account.final = "--";
            }
            document.getElementById("predict").innerHTML = account.predict;
            if (account.predict == "2") {
                document.getElementById("predict").innerHTML = "Good";
                document.getElementById("predict").setAttribute("color", "green");
            } else if (account.predict == "1") {
                document.getElementById("predict").innerHTML = "OK";
                document.getElementById("predict").setAttribute("color", "#ecc400");
            } else {
                document.getElementById("predict").innerHTML = "High-risk";
                document.getElementById("predict").setAttribute("color", "red");
            }
            $scope.available = (80).toFixed(2);
            $scope.total = ((account.hw1 + account.hw2 + account.hw3) / 300.0 * 55 + (account.q1 + account.q2 + account.q3) / 3.0 + account.midterm).toFixed(2);
        });
    }
]);

app.controller('EditCtrl', ['$scope', '$resource', '$location', '$routeParams', 
    function($scope, $resource, $location, $routeParams) {
        var Account = $resource('/api/accounts/:username');
        Account.get({username: $routeParams.username}, function(account) {
            $scope.account = account;
        });
        $scope.update = function() {
            Account.save($scope.account, function() {
                $location.path('/viewGrade/' + $routeParams.username);
            });
        }
    }
]);
