var app = angular.module('Grade', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'LoginCtrl'
    })
    .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'
    })
    .when('/profProfile', {
        templateUrl: 'partials/profProfile.html',
        controller: 'ProfileCtrl'
    })
    .when('/uploadGrade/:course', {
        templateUrl: 'partials/uploadGrade.html',
        controller: 'UploadCtrl'
    })
    .when('/viewGrade/:username', {
        templateUrl: 'partials/viewGrade.html',
        controller: 'ViewCtrl'
    })
	/*
    .when('/editGrade/:username', {
        templateUrl: 'partials/editGrade.html',
        controller: 'EditCtrl'
    })
	*/
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
				if (account.password == undefined) {
					$scope.message = "Username does not exist!";
					return;
				}
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

app.controller('RegisterCtrl', ['$scope', '$resource', '$location', 
    function($scope, $resource, $location) {
		var format = function(input) {
			return (input == undefined ? "" : input.trim());
		}
        correctCode = "";
        confirmed = false;
		usernameChecked = false;
		$scope.checkUsername = function() {
			$scope.message = "";
			$scope.username = format($scope.username);
			if ($scope.username == "") {
				$scope.message = "Username cannot be empty!";
				return;
			}
			var Account = $resource('/api/accounts/:username');
			Account.get({username: $scope.username}, function(account) {
				if (account.username != undefined) {
					$scope.message = "Username has already existed!";
					return;
				}
				else {
					$scope.message = "You can use this username";
					usernameChecked = true;
				}
			});
		}
        $scope.sendEmail = function() {
            $scope.message = "";
            $scope.email = format($scope.email);
            if (($scope.email).trim() == "") {
                $scope.message = "You have to enter your email to receive confirmation code.";
                return;
            }
            var Email = $resource('/api/accounts/register');
            Email.save({email: $scope.email}, function(data) {
                correctCode = data.code;
            });
        }
        $scope.verify = function() {
            $scope.message = "";
            if (correctCode == "") {
                $scope.message = "The confirmation code has not been generated.";
                return;
            }
            if (($scope.confirmCode).trim() == correctCode) {
                confirmed = true;
                $scope.message = "Email confirmed!";
            } else {
                $scope.message = "Incorrect code!";
            }
        }
        $scope.reset = function() {
            document.getElementById("registerForm").reset();
            $scope.message = "";
        }
        $scope.regist = function() {
			var roles = document.getElementsByName("optradio");
			var role = "";
			for(var i = 0; i < roles.length; i++) {
				if (roles[i].checked) {
					role = roles[i].value;
				}
			}
			if (role == "") {
				$scope.message = "You need to select your role.";
				return;
			}
			$scope.nuid = format($scope.nuid);
			if ($scope.nuid == "") {
				$scope.message = "NUID cannot be empty!";
				return;
			}
			else {
				var Account = $resource("/api/accounts/:nuid");
				Account.get({nuid: $scope.nuid}, function(account) {
					if (account.username != undefined) {
						$scope.message = "NUID has already existed!"
						return;
					}
				});
			}
            if (!usernameChecked) {
				$scope.message = "Your username has not been checked yet!";
				return;
			}
			if (!confirmed) {
                $scope.message = "Your email has not been confirmed yet!";
                return;
            }
			if ($scope.password == undefined || $scope.password == "") {
				$scope.message = "Password cannot be empty!";
				return;
			}
            if ($scope.password != $scope.rpassword) {
                $scope.message = "Password does not match!";
                return;
            }
			var account = {
				"Full name": $scope.fullname,
				"Role": role,
				"NUID": $scope.nuid,
				"Email": $scope.email,
				"Username": $scope.username,
				"Password": $scope.password
			};
			var Accounts = $resource('/api/accounts');
			Accounts.save(account, function() {
				alert("You have successfully registered!\nYou will be redirected to the login page.");
	            $location.path("/");
			});
        }
    }
]);

app.controller('ProfileCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        var Model = $resource('/api/models');
        Model.save(function(data) {
            console.log(data.text);
        });
        $scope.upload = function() {
            $location.path('/uploadGrade/' + $scope.course);
        }
    }
]);

app.controller('UploadCtrl', ['$scope', '$routeParams', 
    function($scope, $routeParams) {
        var str = $routeParams.course;
        $scope.course = str.toUpperCase();
    }
]);

app.controller('ViewCtrl', ['$scope', '$resource', '$routeParams',
    function($scope, $resource, $routeParams) {
        var Account = $resource('/api/accounts/:username');
        Account.get({username: $routeParams.username}, function(account) {
            var Params = $resource('/api/models');
            Params.get(function(data) {
                console.log(data.params.split(","));
            });
            $scope.account = account;
            if ($scope.account.hw1 == -1) {
                $scope.account["hw1"] = "--";
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
