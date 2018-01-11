var app = angular.module('main',['ngRoute']);

app.config(function ($routeProvider,$locationProvider) {
	$routeProvider.when('/',{
		resolve: {
			check: function ($location,user) {
				if (user.isUserLoggedIn()) {
					$location.path('/dashboard');
				}
			}
		},
		templateUrl: './components/home.html',
		controller: 'homeCtrl'
	}).when('/login',{
		resolve: {
			check: function ($location,user) {
				if (user.isUserLoggedIn()) {
					$location.path('/dashboard');
				}
			}
		},
		templateUrl: './components/login.html',
		controller: 'loginCtrl'
	}).when('/register',{
		resolve: {
			check: function ($location,user) {
				if (user.isUserLoggedIn()) {
					$location.path('/dashboard');
				}
			}
		},
		templateUrl: './components/register.html',
		controller: 'registerCtrl'
	}).when('/createNewTest',{
		resolve: {
			check: function ($location,user) {
				if (!user.isUserLoggedIn()) {
					$location.path('/');
				}
			}
		},
		templateUrl: './components/newTest.html',
		controller: 'newTestCtlr'
	}).when('/dashboard',{
		resolve: {
			check: function ($location,user) {
				if (!user.isUserLoggedIn()) {
					$location.path('/');
				}
			}
		},
		templateUrl: './components/dashboard.html',
		controller: 'dashboardCtlr'
	}).when('/logout',{
		resolve: {
			deadResolve: function ($location,user) {
				user.clearData();
				$location.path('/');
			}
		}
	}).when('/addQuestion',{
		resolve: {
			check: function ($location,user) {
				if (!user.isUserLoggedIn()) {
					$location.path('/');
				}
			}
		},
		templateUrl: './components/addQuestion.html',
		controller: 'addQueCtlr'
	}).when('/question',{
		resolve: {
			check: function ($location,user) {
				if (!user.isUserLoggedIn()) {
					$location.path('/');
				}
			}
		},
		templateUrl: './components/question.html',
		controller: 'questionCtlr'
	})
	.otherwise({
		template: 'Eroor: 404'
	});
	$locationProvider.html5Mode(true);
});

app.run(function($rootScope, $route, $location){
   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
   //bind in induvidual controllers.

   $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
            // alert('Why did you use history back?');
            var r = confirm("Are you Want to Quit");
			if (r == true) {
				localStorage.removeItem('testId');
			    // txt = "You pressed OK!";
			} else {
				$location.path('/question');
			    // txt = "You pressed Cancel!";
			}
        	// $location.path('/question');
			localStorage.removeItem('testId');
        }
    });

	var windowElement = angular.element(window);
	windowElement.on('beforeunload', function (event) {
	    // do whatever you want in here before the page unloads. 
	    // the following line of code will prevent reload or navigating away.
	    event.preventDefault();       
	    alert("nveio");
	});
});


app.service('user',function ($location) {
	var username;
	var loggedIn = false;
	var id;
	var userId;
	// this.setName = function (name) {
	// 	username = name;
	// };
	this.getName = function (name) {
		return username;
	};
	this.isUserLoggedIn = function (name) {
		if (!!localStorage.getItem('login')) {
			loggedIn = true;
			var data = JSON.parse(localStorage.getItem('login'));
			username = data.username;
			id = data.id;
		}
		return loggedIn;
	};
	// this.userLoggedIn = function () {
	// 	loggedIn = true;
	// };

	this.setUserId = function (uniqueId) {
		// id = uniqueId;
		userId = uniqueId;
	};
	this.getUserId = function () {
		return userId;
	};

	this.setId = function (uniqueId) {
		id = uniqueId;
	};
	this.getId = function () {
		return id;
	};
	this.saveData = function (data) {
		username = data.user;
		id = data.id;
		userId = data.userId;
		loggedIn = true;
		localStorage.setItem('login',JSON.stringify({
			username: username,
			id: id,
			userId: userId
		}));
	};
	this.clearData = function () {
		localStorage.removeItem('login');
		username = "";
		id = "";
		loggedIn = false;
	};
	this.logout = function () {
		$location.path('/logout');	
	}
});

app.service('test',function ($http,$location) {
	var test_id;
	var test_name;
	var newTestId;
	var total_time;
	var minusMarking;
	this.setNewTestId = function ($id) {
		newTestId = $id;
	};
	this.getNewTestId = function ($id) {
		// newTestId = $id;
		return newTestId;
	};
	this.setTestId = function ($id) {
		test_id = $id;
		$http({
			url: 'http://localhost/test/php/getTestInfo.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'testId='+test_id,
		}).then(function (response) {
			if (response.data.status == 1) {
				// console.log(response.data.testName);
				test_name = response.data.testName;
				total_time = response.data.total_time;
				minusMarking = response.data.minus_mark;

				localStorage.setItem('testId',JSON.stringify({
					test_id: $id,
					test_name: test_name,
					total_time: total_time,
					minusMarking: minusMarking
				}));

			}else{
				alert('something went wrong');
				$location.path('/dashboard');
			}
		});
	};
	this.getTestId = function () {
		if (!!localStorage.getItem('testId')) {
			var data = JSON.parse(localStorage.getItem('testId'));
			test_id = data.test_id;
			test_name = data.test_name;
			total_time = data.total_time;
			minusMarking = data.minusMarking;
		}
		return test_id;
	};
	this.getTestName = function () {
		return test_name;	
	};
	this.getTestTotalTime = function () {
		return total_time;	
	};
	this.getMinusMark = function () {
		return minusMarking;	
	};
	this.allTests = function () {
		$http({
			url: 'http://localhost/test/php/getQuestion.php',
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		}).then(function (response) {
			return response.data.records;
			// console.log(response.data.records);
			// $scope.ques = response.data.records;
			// if (response.data.status == 'loggedIn') {
			// 	user.saveData(response.data);
			// 	$location.path('/dashboard');
			// }else{
			// 	alert('Incorrect credentials');
			// }
		});
	}
});

app.controller('questionCtlr',function ($scope,$location,$http,test,user,$timeout) {
	// console.log(test.getTestId());
	var totalques;
	var queIndex;
	var ques;
	var rightAns;
	var totalTime;

	$scope.minusMarking = test.getMinusMark();
	$scope.totalTime = test.getTestTotalTime();
	// console.log(test.getMinusMark());
	// console.log(test.getTestTotalTime());

	$scope.counter = 0;
	 $scope.mincounter = 0;
	 $scope.hcounter = 0;



    $scope.onTimeout = function(){
        $scope.counter++;
        if ($scope.counter == (test.getTestTotalTime())*5) {
        	console.log('10');
        	rightAns = 0;
			var i;
			for (i = 0; i < ques.length ; i++) {
				if (ques[i].userAns) {
					if (ques[i].ans == ques[i].userAns) {
						rightAns = (rightAns + 4);
						console.log(rightAns);
					}else{
						rightAns = (rightAns - 1);
						console.log(rightAns);
					}
				}
			}
			$scope.result = rightAns;
			$http({
				url: 'http://localhost/test/php/addPerformance.php',
				method: 'POST',
				data: 'testId='+test.getTestId()+'&userId='+user.getUserId()+'&marks='+rightAns,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}).then(function (response) {
				console.log(response.data);
			});
        	$location.path('/dashboard');
        }
       	if ($scope.counter == 60) {
       		$scope.counter = 0;
       		$scope.mincounter++;
       		if ($scope.mincounter == 60) {
       			$scope.mincounter = 0;
       			$scope.hcounter++;
       		}
       	}
        mytimeout = $timeout($scope.onTimeout,1000);
    }
    var mytimeout = $timeout($scope.onTimeout,1000);
    
    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

	$scope.user = user.getName();
	$scope.testName = test.getTestName();

	$scope.logout = function () {
		user.logout();
	};

	$scope.goto = function ($id) {
		// ques[0].
		// $scope.checkedOpt = false;
		$scope.que = ques[$id];
	};

	$scope.changeOPt = function ($opt,$qid) {
		ques[$qid].userAns = $opt;
	};

	$scope.showResult = function () {
		console.log('result');
		rightAns = 0;
		var i;
		for (i = 0; i < ques.length ; i++) {
			if (ques[i].userAns) {
				if (ques[i].ans == ques[i].userAns) {
					rightAns = (rightAns + 4);
					console.log(rightAns);
				}else{
					rightAns = (rightAns - 1);
					console.log(rightAns);
				}
			}
		}
		$scope.result = rightAns;
		$http({
			url: 'http://localhost/test/php/addPerformance.php',
			method: 'POST',
			data: 'testId='+test.getTestId()+'&userId='+user.getUserId()+'&marks='+rightAns,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		}).then(function (response) {
			console.log(response.data);
		});
		console.log(rightAns);
	};

	if (test.getTestId()) {
		$http({
			url: 'http://localhost/test/php/getQuestion.php',
			method: 'POST',
			data: 'testId='+test.getTestId(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		}).then(function (response) {
			ques = response.data.records;
			$scope.ques = ques;
			totalques = response.data.records.length;
			$scope.totalques = totalques;
			$scope.que = response.data.records[0];
			queIndex = response.data.records.indexOf(response.data.records[0]);
		});
	}else{

		$location.path('/dashboard');
	}
	
});

app.controller('homeCtrl',function ($scope,$location,$http,test,user) {
		$scope.myValue1 = true;
		$scope.myValue2 = false;
	$scope.goToLogin = function () {
		$scope.myValue1 = true;
		$scope.myValue2 = false;

		// $location.path('/login');
	};
	$scope.goToRegister = function () {
		$scope.myValue1 = false;
		$scope.myValue2 = true;
		// $location.path('/register');
	};
	$scope.login = function () {
		var username =  $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://localhost/test/php/login.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function (response) {
			// console.log(response.data.id);
			if (response.data.status == 'loggedIn') {
				console.log(response.data);
				user.saveData(response.data);
				// user.userLoggedIn();
				// user.setName(response.data.user);
				$location.path('/dashboard');
			}else
				alert('Incorrect credentials');
		});
	}

	$scope.register = function () {
		var username =  $scope.username;
		var email =  $scope.email;
		var phone =  $scope.phone;
		var password = $scope.password;
		var rePassword = $scope.rePassword;
		if (password == rePassword) {
			var data = 'username='+username+'&email='+email+'&phone='+phone+'&password='+password;
			console.log('register');
			$http({
				url: 'http://localhost/test/php/register.php',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: data
			}).then(function (response) {
				console.log(response.data.user_id);
				if (response.data.status == 'loggedIn') {
					user.saveData(response.data);
					$location.path('/dashboard');
				}else{
					alert('Error!');
				}
			});	
		}else{
			alert('rewrite password');
		}
	}
});

app.controller('registerCtrl',function ($scope,$http,$location,user) {
	console.log('register');
	$scope.register = function () {
		var name =  $scope.name;
		var username =  $scope.username;
		var phone =  $scope.phone;
		var password = $scope.password;
		var data = 'name='+name+'&username='+username+'&phone='+phone+'&password='+password;
		console.log('register');
		$http({
			url: 'http://localhost/test/php/register.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data
		}).then(function (response) {
			console.log(response.data.user_id);
			if (response.data.status == 'loggedIn') {
				user.saveData(response.data);
				$location.path('/dashboard');
			}else{
				alert('Incorrect credentials');
			}
		});
	}
});

app.controller('loginCtrl',function ($scope, $http,$location,user) {
	$scope.login = function () {
		var username =  $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://localhost/test/php/login.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function (response) {
			// console.log(response.data.id);
			if (response.data.status == 'loggedIn') {
				user.saveData(response.data);
				// user.userLoggedIn();
				// user.setName(response.data.user);
				$location.path('/dashboard');
			}else
				alert('Incorrect credentials');
		});

	}
}); 

app.controller('dashboardCtlr',function ($http,$scope,user,$location,test,$timeout) {
	$scope.user = user.getName();
	$scope.qShow = false;
	$scope.dash = true;


	$scope.createNewTest = function () {
		var testName = $scope.testName;
		var testTime = $scope.testTime;
		var minusMarking = $scope.minusMarking;
		// console.log($scope.testTime);
		// console.log($scope.minusMarking);
		// console.log(encodeURIComponent(testName));
		$http({
			url: 'http://localhost/test/php/newTest.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'testName='+testName+'&testTime='+testTime+'&minusMarking='+minusMarking
		}).then(function (response) {
			// console.log(response.data);
			if (response.data.status == "Success") {
				test.setNewTestId(response.data.testId);
				$location.path('/addQuestion');
			}else{
				alert('not created');
			}
		});
	}
	$scope.startTest = function ($test_id) {

		test.setTestId($test_id);
		$location.path('/question');
	};
	if (user.isUserLoggedIn()) {	
		$http({
			url: 'http://localhost/test/php/allTests.php',
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		}).then(function (response) {
			// console.log(response.data);
			$scope.tests = response.data.records;
		});
		console.log(user.getId());
		$http({
			url: 'http://localhost/test/php/getPerformance.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'userId='+user.getUserId()
		}).then(function (response) {
			$scope.performances = response.data.records;
			// console.log(response.data.records[0]);
		});
	}else{
		alert('Please login');
		$location.path('/login');
	}

	$scope.logout = function () {
		user.logout();
	};
});

app.controller('newTestCtlr',function ($scope,user,$location,$http,test) {
	$scope.createNewTest = function () {
		var testName = $scope.testName;
		console.log($scope.testName);
		console.log(encodeURIComponent(testName));
		$http({
			url: 'http://localhost/test/php/newTest.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'testName='+testName
		}).then(function (response) {
			console.log(response.data);
			if (response.data.status == "Success") {
				test.setTestId(response.data.testId);
				$location.path('/addQuestion');
			}else{
				alert('not created');
			}
		});
	}
});

app.controller('addQueCtlr',function ($scope,user,$location,$http,test) {
	$scope.user = user.getName();
	$scope.logout = function () {
		user.logout();
	};
	$scope.addNewQue = function () {
		var que = $scope.question;
		var opt1 = $scope.opt1;
		var opt2 = $scope.opt2;
		var opt3 = $scope.opt3;
		var opt4 = $scope.opt4;
		var ans = $scope.answer;
		var testId = test.getNewTestId();
		var data = 'que='+que+'&opt1='+opt1+'&opt2='+opt2+'&opt3='+opt3+'&opt4='+opt4+'&ans='+ans+'&testId='+testId;

			$http({
				url: 'http://localhost/test/php/newQuestion.php',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: data
			}).then(function (response) {

				if (response.data == 1) {
					console.log("Success");
						$scope.question = "";
						$scope.opt1 = "";
						$scope.opt2 = "";
						$scope.opt3 = "";
						$scope.opt4 = "";
						$scope.answer = "";
					alert('Success');
					// $location.path('/addQuestion');
				}else{
					// console.log("failed");
					alert('not created');
				}
		});
	}
});