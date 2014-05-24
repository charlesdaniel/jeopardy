var app = angular.module('jeopardyApp', []).config(function($sceProvider) {
	$sceProvider.enabled(false);
});

app.controller('GameboardCtrl', function($scope, $http) {
	$scope.errors = [];
	$scope.categories = {};
	$scope.questions = {};
	$scope.teams = [];
	$scope.questions_used = {};
	$scope.winloss = {};

	$scope.load_board = function(teams, categories, questions, scores, questions_used) {
		$scope.categories = categories || window.categories;
		$scope.questions = questions || window.questions;
		$scope.teams = teams || window.teams;
		$scope.scores = scores || {};
		$scope.questions_used = questions_used || {};
	};


	$scope.send_set = function(prop, val) {
		if($scope.isControls()) {
			$scope.postMessage(['send_set', prop, val || $scope[prop]]);
		}
		else {
			$scope[prop] = val;
			//$scope.$apply();
		}
	};

	$scope.isControls = function() {
		return ($scope.w_board != undefined);
	};

	$scope.resetTime = function(timeout) {
		if($scope.isControls()) {
			$scope.currentTimerVal = timeout || 30;
			$scope.send_set('currentTimerVal');
		}
	};

	$scope.pauseTime = function(pauseState) {
		$scope.timePaused = pauseState;
		$scope.send_set('timePaused');
	};

	$scope.open_question = function(category, points, timeout) {
		$scope.winloss = {};
		clearInterval($scope.currentTimer);
		if (!$scope.questions_used[category + ":" + points]) {
			$scope.current_category = category;
			$scope.current_points = points;
			$scope.current_selection = $scope.questions[category][points];
			$scope.questions_used[category + ":" + points] = true;

			$scope.resetTime(timeout);

			if($scope.isControls()) {
				$scope.postMessage(['open_question', category, points, timeout]);
			}

			$scope.currentTimer = setInterval((function($scope) {
				return function() {
					if($scope.currentTimerVal && !$scope.timePaused) {
						$scope.currentTimerVal -= 1;
					}
					if($scope.currentTimerVal <= 0) {
						$scope.close_question();
					}
					$scope.$apply();
				};
			})($scope), 1000);
		}
	};

	$scope.set_score = function(team, score) {
		if(team) {
			$scope.scores[team] = score;
			if($scope.isControls()) {
				$scope.postMessage(['set_score', team, score]);
			}
		}
	};

	$scope.change_score = function(team, delta) {
		$scope.scores[team] = (parseInt($scope.scores[team], 10) || 0) + parseInt(delta, 10);
	};

	$scope.close_question = function() {
		clearInterval($scope.currentTimer);
		$scope.current_selection = false;
		if($scope.isControls()) {
			$scope.postMessage(['close_question']);
			for(var team in $scope.winloss) {
				$scope.change_score(team, $scope.winloss[team]);
				$scope.send_set('scores');
			}
		}
	};

	$scope.open_gameboard = function() {
		$scope.w_board = window.open('gameboard.html', 'gameboard');
		if(!$scope.w_board) {
			alert("Please allow popups for this page");
		}
	};

	$scope.gameboard_opened = function() {
		if($scope.isControls()) {
			$scope.postMessage(['load_board', $scope.teams, $scope.categories, $scope.questions, $scope.scores, $scope.questions_used]);
		}
		else {
			$scope.postMessage(['gameboard_opened']);
		}
	};

	$scope.postMessage = function(message) {
		if($scope.isControls()) {
			$scope.w_board.postMessage(message, '*');
		}
		else {
			window.opener.postMessage(message, '*');
		}
	};
	$scope.receiveMessage = function(event) {
		var func = event.data.shift();
		$scope[func].apply($scope, event.data);
		$scope.$apply();
	};

	window.addEventListener("message", $scope.receiveMessage, false);
});

