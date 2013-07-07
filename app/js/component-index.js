//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//CONTROLLER
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

App.controller('GuidesController', function($scope, $rootScope, $routeParams, $location, $http, GuideModel, PageModel, SharedServices) {
	



	//SET THE LOCAL GUIDE
	$scope.$on('guideSet', function(){
		$scope.guide = SharedServices.guide();

	});






	$scope.edit = function(item, type) {
		
		//Pass the item to shared services
		SharedServices.linkItem(item);
		//make sure the editor is vible
		SharedServices.setEditor(true);

	}

	$scope.addGuide = function() {
		var newguide = {
			title:'new guide',
			books:[]
		}
		GuideModel.saveGuide(newguide);

		var index = $rootScope.guides.length;

		$location.path('/'+index);


	}


	//+-----------------------------------------------------
	//BOOK
	//+-----------------------------------------------------
	
	// $scope.addBook = function() {
	// 	$scope.form.chapters = [];
		
	// 	//ADD A BOOK
	// 	this.guide.books.push($scope.form);
		
	// 	//SAVE THE GUIDE
	// 	GuideModel.saveGuide(this.guide);

	// 	$scope.bookForm = {};
	// }	
	$scope.deleteBook = function(index) {
		var guide = this.guide;

		//DELETE BOOK FROM GUIDE
		guide.books.splice(index, 1);

		//SAVE THE GUIDE
		GuideModel.saveGuide(guide);		
	}


	//+-----------------------------------------------------
	//CHPATER
	//+-----------------------------------------------------
	
	// $scope.addChapter = function(index) {
	// 	var guide = this.guide;
		
	// 	var chapter = {
	// 		title:'new chapter',
	// 		pages:[]
	// 	}

	// 	//ADD A CHAPTER
	// 	guide.books[index].chapters.push(chapter);

	// 	//SAVE THE GUIDE
	// 	GuideModel.saveGuide(guide);


	// }	
	$scope.deleteChapter = function(index, parentIndex) {
		var guide = this.guide;

		//DELETE BOOK FROM GUIDE
		guide.books[parentIndex].chapters.splice(index, 1);

		//SAVE THE GUIDE
		GuideModel.saveGuide(guide);		
	}

	$scope.copyChapter = function(bookIndex, chapterIndex) {
		SharedServices.copyItem(this.guide.books[bookIndex].chapters[chapterIndex]);
	}
	$scope.pasteChapter = function(bookIndex) {
		var guide = this.guide;

		guide.books[bookIndex].chapters.push(SharedServices.copiedItem());


		GuideModel.saveGuide(guide);
	}	

	$scope.pastePage = function(bookIndex, chapterIndex) {
		var guide = this.guide;

		guide.books[bookIndex].chapters[chapterIndex].pages.push(SharedServices.copiedItem());


		GuideModel.saveGuide(guide);
	}		

	//+-----------------------------------------------------
	//CHPATER
	//+-----------------------------------------------------
	
	// $scope.addPage = function(chpaterIndex, bookIndex) {
	// 	var guide = this.guide;
		
	// 	var page = {
	// 		title:'new page'
	// 	}


	// 	PageModel.createNewPage(page).success(function(data){
	// 		guide.books[bookIndex].chapters[chpaterIndex].pages.push({id:data.$id.$id, type:'page'});

	// 		//SAVE THE GUIDE
	// 		GuideModel.saveGuide(guide);
					

	// 	});

	// }	

	$scope.deletePageRef = function(bookIndex, chapterIndex, pageIndex) {
		var guide = this.guide;

		//DELETE BOOK FROM GUIDE
		guide.books[bookIndex].chapters[chapterIndex].pages.splice(pageIndex, 1);

		//SAVE THE GUIDE
		GuideModel.saveGuide(guide);	
	}



});


//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//MODEL
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

App.factory('GuideModel', function($resource, $http, $rootScope, $routeParams, $dialog, Utils){
	return {
		saveGuide: function(data) {
			if(angular.isDefined(data._id)) {
				
				data.id = data._id.$id;
			}

			return $http.get('app/api/save-guide.php', {
				params:{
					json:angular.toJson(data)
				}
			});
		},
		newGuide: function(data) {

		}
	}
});


//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//DIRECTIVES
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

App.directive('clgAddPage', function(SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.addPage = function() {
			var page = {
				title:'new page test'
			};
			var guide = SharedServices.guide();
			
			PageModel.createNewPage(angular.toJson(page)).success(function(data){
				guide.books[scope.bookIndex].chapters[scope.chapterIndex].pages.push({id:data.$id.$id, type:'page'});

				//SAVE THE GUIDE
				GuideModel.saveGuide(guide);


			});
		}

		

	}

	return {
		restrict: 'E',
		scope: {
			bookIndex:'=',
			chapterIndex:'=',
		},
		link:link,
		isolate:true
	};
});


App.directive('clgAddChapter', function(SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.addChapter = function() {
			// scope.form.pages = [];
			// var chapter = scope.form;
			var guide = SharedServices.guide();

			var chapter = {
				title:"new chapter",
				type:'chapter',
				pages:[]
			}
			guide.books[scope.bookIndex].chapters.push(chapter);

			//SAVE THE GUIDE
			GuideModel.saveGuide(guide);

			scope.form = {};		

		}

	}

	return {
		restrict: 'E',
		scope: {
			bookIndex:'=',
		},
		link:link,
		isolate:true
	};
});



App.directive('clgAddBook', function(SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.addBook = function() {
			// scope.form.chapters = [];
			// var book = scope.form;
			var guide = SharedServices.guide();

			var book = {
				title:'new book',
				type:'book',
				chapters:[]
			}
			guide.books.push(book);

			//SAVE THE GUIDE
			GuideModel.saveGuide(guide);

			scope.form = {};		

		}

	}

	return {
		restrict: 'E',
		scope: {
			bookIndex:'=',
		},
		link:link,
		isolate:true
	};
});







App.directive('clgCopyItem', function(SharedServices){
	function link(scope, element, attrs) {
		scope.copyItem = function() {
			var ref = {
				id: scope.item._id.$id,
				type:'page'
			}
			SharedServices.copyItem(ref);
			console.log(SharedServices.copiedItem())
		}

	}

	return {
		restrict: 'A',
		scope: {
			item:'=',
		},
		link:link,
		isolate:true
	};
});




