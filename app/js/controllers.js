// function PhoneListCtrl($scope, $http, Guides) {

// 	$scope.phones = Guides.query();



// 	$scope.setImage = function(imageUrl) {
// 		$scope.mainImageUrl = imageUrl;
// 	}

// 	$scope.testtest = function() {
// 		alert('test')
// 	}

// 	$scope.addGuide = function() {
// 		console.log($scope.form);

// 		$http.get('app/api/add-guide.php', {
// 			params:$scope.form
// 		}).success(function(data) {
// 			console.log('success?');
// 		});

// 	}

// }

// function PhoneDetailCtrl($scope, $routeParams, $http, Guides) {
// 	$scope.phone = $http.get('/app/api/', {params:$routeParams});


// 	console.log($scope.phone);


// }


App.controller('GuidesController', function($scope, $rootScope, $routeParams, $location, GuideModel, PageModel, UtilFactory, sharedServices) {
	var update = function() {
		GuideModel.getGuides().success(function(data){
			$rootScope.guides = data;

			$rootScope.guide = $rootScope.guides[$routeParams.guideSlug];

			// 	GuideModel.getGuide(slug).success(function(data){
			// 		sharedServices.currentGuide(data);

			// 		$rootScope.guide = data;
			// 		$rootScope.book = $routeParams.bookSlug;
			// 		$rootScope.chapter = $routeParams.chapterSlug;



			// // angular.forEach(l, function(value, key) {
			// // 	console.log(value)
			// // });
					
			// 	});
			
				if(!$scope.moreContent) {
					$scope.moreContent = [];
				}
				PageModel.getContent().success(function(data){
					$scope.moreContent = data;
				});			
			
		});

		    $scope.$watch('guide', function(guide) {
		      if(guide) {
		        angular.forEach(guide.books, function(book) {

		            //loop each chapter
		            angular.forEach(book.chapters, function(chapter) {
		                
		                // loop each page
		                angular.forEach(chapter.pages, function(page) {
		                	UtilFactory.getPageFromId(page.id, 'content').success(function(data){
		                		if(!$rootScope.pages) {
		                			$rootScope.pages = [];
		                		}
		                		var id = data._id.$id;

		                		$rootScope.pages[id] = data;
		                	page.contnet = data;

		                	});
							$rootScope.$broadcast('pageReady');


		                });

		            });

		        });

		      }//if guide

		  });


	}
	update();

	

	//$scope.update = function() {}
	//+-----------------------------------------------------
	//GUIDE
	//+-----------------------------------------------------

	$scope.addGuide = function() {
		
		GuideModel.addGuide($scope.form);

		update();
	}

	$scope.deleteGuide = function(id){
		GuideModel.deleteGuide(id);

		update();
	}

	$scope.saveGuide = function() {
		$scope.guide.id = $scope.guide._id.$id;
		GuideModel.saveGuide($scope.guide);
	}


	//+-----------------------------------------------------
	//BOOK
	//+-----------------------------------------------------

	$scope.addBook = function() {
		GuideModel.addBook($scope.form);
		GuideModel.saveGuide($scope.guide);
	}

	$scope.deleteBook = function(index) {
		GuideModel.deleteBook(index);
		GuideModel.saveGuide($scope.guide);
	}
	$scope.copyBook = function(book) {
		sharedServices.copyBook($scope.guide.books[book]);
	}
	$scope.pasteBook = function() {
		GuideModel.addBook(sharedServices.copiedItem);
		GuideModel.saveGuide($scope.guide);
	}
	//+-----------------------------------------------------
	//CHAPTER
	//+-----------------------------------------------------
	$scope.addChapter = function() {
		GuideModel.addChapter($scope.form);
		GuideModel.saveGuide($scope.guide);
	}

	$scope.deleteChapter = function(index) {
		GuideModel.deleteChapter(index);
		GuideModel.saveGuide($scope.guide);
		
	}
	$scope.saveChapter = function() {
		GuideModel.saveGuide($scope.guide);
	}
	$scope.copyChapter = function(book, chapter) {
		sharedServices.copyChapter($scope.guide.books[book].chapters[chapter]);
	}
	$scope.pasteChapter = function(book) {
		GuideModel.addChapter(sharedServices.copiedItem);
		GuideModel.saveGuide($scope.guide);
	}


	$scope.$on('copiedChapter', function() {
		console.log('you\'ve copied chapter:' + sharedServices.copiedItem.title)
		
	});
	$scope.$on('copiedBook', function() {
		console.log('you\'ve copied book:' + sharedServices.copiedItem.title)
		
	});



	//+-----------------------------------------------------
	//PAGE
	//+-----------------------------------------------------

	$scope.createNewPage = function() {
	
		PageModel.createNewPage($scope.form).success(function(result) {

			GuideModel.addPageRef({
				id:result.$id.$id
			});
			
			GuideModel.saveGuide($scope.guide);
		});

		
	}



	$scope.deletePage = function(pageIndex) {
		
	}
	
	$scope.deletePageRef = function(index) {
		
		GuideModel.deletePageRef(index);
		GuideModel.saveGuide($scope.guide);
		
	}	

	
	$scope.addPageRef = function(id) {

		GuideModel.addPageRef({
			id:id
		});
		
		GuideModel.saveGuide($scope.guide);

	}



	$scope.savePage = function() {
		PageModel.savePage($scope.page);
	}

	$scope.addCode = function() {
		if(!$scope.page.code) {
			$scope.page.code = [];
		}
		$scope.page.code.push($scope.addCodeForm);
		$scope.addCodeForm = "";

		PageModel.savePage($scope.page);

	}	



	$scope.indexUp = function(index) {

		var parent = $rootScope.guide.books;
		var newPos = index-1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide($scope.guide);

	}
	$scope.indexDown = function(index) {
		var parent = $rootScope.guide.books;
		var newPos = index+1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide($scope.guide);

	}

	$scope.indexPageUp = function(index) {

		var parent = $scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages;
		var newPos = index-1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide($scope.guide);

	}
	$scope.indexPageDown = function(index) {
		var parent = $scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages;
		var newPos = index+1;

		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

		GuideModel.saveGuide($scope.guide);

	}		


});


App.controller('PageDetailController', function($scope, $rootScope, $location, $routeParams, GuideModel, PageModel) {
	var update = function() {
		GuideModel.getGuide($routeParams.guideSlug).success(function(data){
			$rootScope.guide = data;

			$scope.book = $routeParams.bookSlug;

			$scope.chapter = $routeParams.chapterSlug;

			var ref = {
				ref:'content',
				id: $scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages[$routeParams.pageIndex].id
			}
			PageModel.getPage(ref).success(function(data) {
				$scope.page = data;
				
			});

		});
	}
	update();

	$scope.savePage = function() {
		PageModel.savePage($scope.page);
	}

	$scope.addCode = function() {
		if(!$scope.page.code) {
			console.log('empty')
			$scope.page.code = [];

		}
		$scope.page.code.push($scope.addCodeForm);
		
		console.log($scope.page.code);

		PageModel.savePage($scope.page);

	}
	


});




// App.controller('GuideDetailController', function($scope, $rootScope, $routeParams, GuideModel, BookModel, UtilFactory) {


// 	var update = function() {
// 		GuideModel.getGuide($routeParams.guideSlug).success(function(data){
// 			$rootScope.guide = data;

// 			console.log($rootScope)
// 		});
// 	}
// 	update();


// 	$scope.addBook = function() {
		
// 		if(!$scope.guide.books) {
// 			$scope.guide.books = [];
// 		}

// 		$scope.guide.books.push($scope.form);

// 		GuideModel.saveGuide($scope.guide);

// 	}

// 	$scope.deleteBook = function(bookId) {

// 		$scope.guide.books.splice(bookId, 1);
// 		 GuideModel.saveGuide($scope.guide);

// 	}

// 	$scope.indexUp = function(index) {

// 		var parent = $rootScope.guide.books;
// 		var newPos = index-1;

// 		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

// 		GuideModel.saveGuide($scope.guide);

// 	}
// 	$scope.indexDown = function(index) {
// 		var parent = $rootScope.guide.books;
// 		var newPos = index+1;

// 		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

// 		GuideModel.saveGuide($scope.guide);

// 	}

// });


// App.controller('BookDetailController', function($scope, $rootScope, $location, $routeParams, GuideModel, BookModel, ChapterModel) {

// 	var update = function() {
// 		GuideModel.getGuide($routeParams.guideSlug).success(function(data){
// 			$rootScope.guide = data;
// 			$scope.book = $routeParams.bookSlug;
// 		});
// 	}
// 	update();

// 	$scope.addChapter = function() {
		
// 		if(!$scope.guide.books[$routeParams.bookSlug].chapters) {
// 			$scope.guide.books[$routeParams.bookSlug].chapters = [];
// 		}

// 		$scope.guide.books[$routeParams.bookSlug].chapters.push($scope.form);
// 		GuideModel.saveGuide($scope.guide);
// 	}

// 	$scope.deleteChapter = function(chapterId) {

// 		$scope.guide.books[$routeParams.bookSlug].chapters.splice(chapterId, 1);
// 		GuideModel.saveGuide($scope.guide);
		
// 	}
// });


// App.controller('ChapterDetailController', function($scope, $rootScope, $location, $routeParams, GuideModel, BookModel, ChapterModel, PageModel) {

// 	var update = function() {
// 		GuideModel.getGuide($routeParams.guideSlug).success(function(data){
// 			$scope.guide = data;

// 			//console.log($scope.guide);

// 			$scope.book = $routeParams.bookSlug;

// 			$scope.chapter = $routeParams.chapterSlug;

// 			//updatePages();

// 		});

// 		PageModel.getContent().success(function(data){
// 			$scope.moreContent = data;
// 		});
// 	}
// 	update();

	

// 	$scope.formatContent = function(text) {
// 		$scope.chapterContent = $scope.guide.books[0].title;
// 		console.log(text)

// 	}

// 	$scope.createNewPage = function() {
	
// 		PageModel.createNewPage($scope.form).success(function(result) {

// 			if(!$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages) {
// 				$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages = [];
// 			}


// 			$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages.push(result.$id.$id);

// 			GuideModel.saveGuide($scope.guide);
// 		});

		
// 	}

// 	$scope.saveChapter = function() {
// 		GuideModel.saveGuide($scope.guide);
// 	}

// 	$scope.deletePage = function(pageIndex) {

// 		// var params = {
// 		// 	guideId: $scope.guide._id.$id,
// 		// 	bookId: $scope.book.bookId,
// 		// 	chapterId: $scope.chapter.chapterId,
// 		// 	pageId: $scope.pages[pageIndex]._id.$id,
// 		// 	pageIndex: pageIndex
// 		// };

// 		// PageModel.deletePage(params).success(function(result) {
// 		// 	$scope.pages.splice(pageIndex, 1);
// 		// });

		
// 	}
	
// 	$scope.deletePageRef = function(pageIndex) {
		
// 		$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages.splice(pageIndex, 1);
// 		GuideModel.saveGuide($scope.guide);
		
// 	}	

	
// 	$scope.addPageRef = function(contentId) {

// 			if(!$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages) {
// 				$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages = [];
// 			}

// 			$scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages.push(contentId);

// 			GuideModel.saveGuide($scope.guide);

// 	}


// 	$scope.indexUp = function(index) {

// 		var parent = $scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages;
// 		var newPos = index-1;

// 		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

// 		GuideModel.saveGuide($scope.guide);

// 	}
// 	$scope.indexDown = function(index) {
// 		var parent = $scope.guide.books[$routeParams.bookSlug].chapters[$routeParams.chapterSlug].pages;
// 		var newPos = index+1;

// 		parent.splice(newPos, 0, parent.splice(index, 1)[0]);

// 		GuideModel.saveGuide($scope.guide);

// 	}	

// });




