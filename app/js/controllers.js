App.controller('MainController', function($scope, $rootScope, $routeParams, $location, $http, GuideModel, PageModel, SharedServices) {
	

	$rootScope.guides = {};
	
	$http.get('app/api/get-guides.php').success(function(data){
		$rootScope.guides = data;

		SharedServices.setGuide($rootScope.guides[$routeParams.guideIndex]);
		
		$rootScope.$broadcast('setGuides')
	});

	$http.get('app/api/get-content.php', {}).success(function(data){
		$rootScope.contents = data;

		$rootScope.$broadcast('setContents');
	});

	/*
	Should we include location switching here, or in
	the guide controller?
	*/



});






App.controller('PageController', function($scope, $rootScope, $routeParams, $location, $http, Utils, SharedServices, GuideModel) {
	var ref = {
		ref:'content',
		id: $scope.page.id
	}             

	$http.get('app/api/get-page.php', {params:ref}).success(function(data){
		$scope.page = data;
		//$scope.page.content = Utils.makeMarkdown($scope.page.content);
	});
	
	var guide = SharedServices.guide();

	$scope.pageUp = function(bookIndex, chapterIndex) {
		var guide = this.guide;

		var parent = guide.books[bookIndex].chapters[chapterIndex].pages;

		var index = $scope.$index;
		var newPos = index-1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide(this.guide);

	}
	$scope.pageDown = function(bookIndex, chapterIndex) {
		var guide = this.guide;

		var parent = guide.books[bookIndex].chapters[chapterIndex].pages;

		var index = $scope.$index;
		var newPos = index+1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide(this.guide);

	}

});


App.controller('ContentController', function($scope, $rootScope, $routeParams, $location, $http, Utils, SharedServices, GuideModel, PageModel){
		// $http.get('app/api/get-content.php', {}).success(function(data){
		// 	$scope.contents = data;
		// 	//$scope.page.content = Utils.makeMarkdown($scope.page.content);

		// 	// angular.forEach($scope.contents, function(content) {
				
		// 	// });

		// });
		
		$scope.$on('setContents', function() {
			
		});
		

		$scope.page = [];

		$scope.savePage = function(page) {
			PageModel.savePage(page);
		}
		$scope.newPage = function(page) {
			var page = {
				title:page.title
			};
			
			PageModel.createNewPage(angular.toJson(page)).success(function(data){
				$scope.contents.push(page);


			});
		}
});



