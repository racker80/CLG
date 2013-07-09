// 

//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//MODEL
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

// App.factory('GuideModel', function($http, SharedServices){
// 	return {
// 		saveGuide: function(data) {
// 			// if(angular.isDefined(data._id.$id)) {
// 			// 	data.id = data._id.$id;
// 			// }

// 			var guide = SharedServices.guide();
// 			console.log(guide)

// 			// if(angular.isDefined(guide._id.$id)) {
// 			// 	guide.id = guide._id.$id;
// 			// }

// 			return $http.get('app/api/save-guide.php', {
// 				params:{
// 					json:angular.toJson(guide)
// 				}
// 			});
// 		},
// 		newGuide: function(data) {

// 		}
// 	}
// });











angular.module('clg.index', [])

.constant('clgIndexConfig', {

})

.controller('clgIndexController', function ($scope, $rootScope, $routeParams, $location, $http, clgIndexConfig, GuideModel, PageModel, SharedServices) {
	//SET THE LOCAL GUIDE
	$scope.$on('guideSet', function(){
		$scope.guide = SharedServices.guide();
	});
	$scope.$on('saveGuide', function() {
		console.log($scope)
		GuideModel.saveGuide($scope.guide);
	});
})
.factory('GuideModel', function($http, SharedServices){
	return {
		saveGuide: function(data) {
			// if(angular.isDefined(data._id.$id)) {
			// 	data.id = data._id.$id;
			// }

			var guide = SharedServices.guide();
			console.log(guide)

			// if(angular.isDefined(guide._id.$id)) {
			// 	guide.id = guide._id.$id;
			// }

			return $http.get('app/api/save-guide.php', {
				params:{
					json:angular.toJson(guide)
				}
			});
		},
		newGuide: function(data) {

		}
	}
})
.directive('guideContainer', function () {
	var link = function(scope) {
	}
  return {
    restrict:'EA',
    controller:'clgIndexController',
    scope: {},
    link:link
  };
})
.directive('guideGroup', function () {
	var link = function(scope) {
	}
  return {
    restrict:'EA',
    controller:'clgIndexController',
    scope: {
    	location:'='
    },
    link:link
  };
})
.directive('guideActions', function ($rootScope, $location, SharedServices, PageModel, GuideModel) {
	var link = function(scope) {

		var types = {
			page: {
				id:{},
				type:'page',
				code:[],
				images:[],
			},
			chapter: {
				title:'new chapter',
				type:'chapter',
				pages: []
			},
			book: {
				title:'new book',
				type:'book',
				chapters:[]
			},
			guide: {
				title:'new guide',
				books:[]
			}
		}


		scope.addGuide = function() {
			$rootScope.guides.push(types.guide);

			var index = $rootScope.guides.length-1;

			SharedServices.setGuide($rootScope.guides[index]);
			GuideModel.saveGuide();

			$location.path('/'+index);



		}

		scope.addGroup = function() {
			var newGroup = types[scope.type];
			//Create a page to get the id
			if(newGroup.type == 'page') {

				//to do, learn about promises
				PageModel.createNewPage({
				title:'New Page'
				}).success(function(result){
					newGroup.id = result.$id.$id;
					scope.location.push(newGroup);

					GuideModel.saveGuide();
				});

			} else {

				scope.location.push(newGroup);
				GuideModel.saveGuide();

			}


			if(scope.edit == 'true') {
				var i = scope.location.length-1;
				//Pass the item to shared services
				SharedServices.linkItem(scope.location[i]);
				//make sure the editor is vible
				SharedServices.setEditor(true);				
			}

		}
		scope.deleteGroup = function() {
			scope.parent.splice(scope.location, 1);
			GuideModel.saveGuide();
		}
		scope.copyGroup = function() {
			SharedServices.copyItem(scope.location);
			GuideModel.saveGuide();
		}	
		scope.pasteGroup = function() {
			scope.location.push(SharedServices.copiedItem())
			GuideModel.saveGuide();

		}
		scope.editGroup = function() {
			//Pass the item to shared services
			SharedServices.linkItem(scope.location);
			//make sure the editor is vible
			SharedServices.setEditor(true);
		}				

		scope.indexUp = function() {
			index = scope.location-1;
			scope.parent.splice(index, 0, scope.parent.splice(scope.location, 1)[0]);
			GuideModel.saveGuide();

		}
		scope.indexDown = function() {
			index = scope.location+1;
			scope.parent.splice(index, 0, scope.parent.splice(scope.location, 1)[0]);
			GuideModel.saveGuide();

		}		
	}
  return {
  	restrict:'EA',
  	link:link,
    controller:'clgIndexController',
  	scope: {
  		location:'=',
  		parent:'=',
  		type:'@',
  		edit:'@'
  	},
  };
})
;






































//+-------------------------------------------------------------------------------------------
// //+-------------------------------------------------------------------------------------------
// //CONTROLLER
// //+-------------------------------------------------------------------------------------------
// //+-------------------------------------------------------------------------------------------

// App.controller('GuidesController', function($scope, $rootScope, $routeParams, $location, $http, GuideModel, PageModel, SharedServices) {
	



// 	//SET THE LOCAL GUIDE
// 	$scope.$on('guideSet', function(){
// 		$scope.guide = SharedServices.guide();

// 	});






// 	$scope.edit = function(item, type) {
		
// 		//Pass the item to shared services
// 		SharedServices.linkItem(item);
// 		//make sure the editor is vible
// 		SharedServices.setEditor(true);

// 	}

// 	$scope.addGuide = function() {
// 		var newguide = {
// 			title:'new guide',
// 			books:[]
// 		}
// 		GuideModel.saveGuide(newguide);

// 		var index = $rootScope.guides.length;

// 		$location.path('/'+index);


// 	}


// 	//+-----------------------------------------------------
// 	//BOOK
// 	//+-----------------------------------------------------
	
// 	// $scope.addBook = function() {
// 	// 	$scope.form.chapters = [];
		
// 	// 	//ADD A BOOK
// 	// 	this.guide.books.push($scope.form);
		
// 	// 	//SAVE THE GUIDE
// 	// 	GuideModel.saveGuide(this.guide);

// 	// 	$scope.bookForm = {};
// 	// }	
// 	$scope.deleteBook = function(index) {
// 		var guide = this.guide;

// 		//DELETE BOOK FROM GUIDE
// 		guide.books.splice(index, 1);

// 		//SAVE THE GUIDE
// 		GuideModel.saveGuide(guide);		
// 	}


// 	//+-----------------------------------------------------
// 	//CHPATER
// 	//+-----------------------------------------------------
	
// 	// $scope.addChapter = function(index) {
// 	// 	var guide = this.guide;
		
// 	// 	var chapter = {
// 	// 		title:'new chapter',
// 	// 		pages:[]
// 	// 	}

// 	// 	//ADD A CHAPTER
// 	// 	guide.books[index].chapters.push(chapter);

// 	// 	//SAVE THE GUIDE
// 	// 	GuideModel.saveGuide(guide);


// 	// }	
// 	$scope.deleteChapter = function(index, parentIndex) {
// 		var guide = this.guide;

// 		//DELETE BOOK FROM GUIDE
// 		guide.books[parentIndex].chapters.splice(index, 1);

// 		//SAVE THE GUIDE
// 		GuideModel.saveGuide(guide);		
// 	}

// 	$scope.copyChapter = function(bookIndex, chapterIndex) {
// 		SharedServices.copyItem(this.guide.books[bookIndex].chapters[chapterIndex]);
// 	}
// 	$scope.pasteChapter = function(bookIndex) {
// 		var guide = this.guide;

// 		guide.books[bookIndex].chapters.push(SharedServices.copiedItem());


// 		GuideModel.saveGuide(guide);
// 	}	

// 	$scope.pastePage = function(bookIndex, chapterIndex) {
// 		var guide = this.guide;

// 		guide.books[bookIndex].chapters[chapterIndex].pages.push(SharedServices.copiedItem());


// 		GuideModel.saveGuide(guide);
// 	}		

// 	//+-----------------------------------------------------
// 	//CHPATER
// 	//+-----------------------------------------------------
	
// 	// $scope.addPage = function(chpaterIndex, bookIndex) {
// 	// 	var guide = this.guide;
		
// 	// 	var page = {
// 	// 		title:'new page'
// 	// 	}


// 	// 	PageModel.createNewPage(page).success(function(data){
// 	// 		guide.books[bookIndex].chapters[chpaterIndex].pages.push({id:data.$id.$id, type:'page'});

// 	// 		//SAVE THE GUIDE
// 	// 		GuideModel.saveGuide(guide);
					

// 	// 	});

// 	// }	

// 	$scope.deletePageRef = function(bookIndex, chapterIndex, pageIndex) {
// 		var guide = this.guide;

// 		//DELETE BOOK FROM GUIDE
// 		guide.books[bookIndex].chapters[chapterIndex].pages.splice(pageIndex, 1);

// 		//SAVE THE GUIDE
// 		GuideModel.saveGuide(guide);	
// 	}



// });




















//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//DIRECTIVES
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

// App.directive('clgAddPage', function(SharedServices, PageModel, GuideModel){
// 	function link(scope, element, attrs) {

// 		scope.addPage = function() {
// 			var page = {
// 				title:'new page test'
// 			};
// 			var guide = SharedServices.guide();
			
// 			PageModel.createNewPage(angular.toJson(page)).success(function(data){
// 				guide.books[scope.bookIndex].chapters[scope.chapterIndex].pages.push({id:data.$id.$id, type:'page'});

// 				//SAVE THE GUIDE
// 				GuideModel.saveGuide(guide);


// 			});
// 		}

		

// 	}

// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bookIndex:'=',
// 			chapterIndex:'=',
// 		},
// 		link:link,
// 		isolate:true
// 	};
// });


// App.directive('clgAddChapter', function(SharedServices, PageModel, GuideModel){
// 	function link(scope, element, attrs) {

// 		scope.addChapter = function() {
// 			// scope.form.pages = [];
// 			// var chapter = scope.form;
// 			var guide = SharedServices.guide();

// 			var chapter = {
// 				title:"new chapter",
// 				type:'chapter',
// 				pages:[]
// 			}
// 			guide.books[scope.bookIndex].chapters.push(chapter);

// 			//SAVE THE GUIDE
// 			GuideModel.saveGuide(guide);

// 			scope.form = {};		

// 		}

// 	}

// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bookIndex:'=',
// 		},
// 		link:link,
// 		isolate:true
// 	};
// });



// App.directive('clgAddBook', function(SharedServices, PageModel, GuideModel){
// 	function link(scope, element, attrs) {

// 		scope.addBook = function() {
// 			// scope.form.chapters = [];
// 			// var book = scope.form;
// 			var guide = SharedServices.guide();

// 			var book = {
// 				title:'new book',
// 				type:'book',
// 				chapters:[]
// 			}
// 			guide.books.push(book);

// 			//SAVE THE GUIDE
// 			GuideModel.saveGuide(guide);

// 			scope.form = {};		

// 		}

// 	}

// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bookIndex:'=',
// 		},
// 		link:link,
// 		isolate:true
// 	};
// });







// App.directive('clgCopyItem', function(SharedServices){
// 	function link(scope, element, attrs) {
// 		scope.copyItem = function() {
// 			var ref = {
// 				id: scope.item._id.$id,
// 				type:'page'
// 			}
// 			SharedServices.copyItem(ref);
// 			console.log(SharedServices.copiedItem())
// 		}

// 	}

// 	return {
// 		restrict: 'A',
// 		scope: {
// 			item:'=',
// 		},
// 		link:link,
// 		isolate:true
// 	};
// });





