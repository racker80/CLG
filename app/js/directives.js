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


App.directive('clgNav', function(SharedServices, PageModel, GuideModel){
	return {
		restrict: 'E',
		templateUrl:'app/view/includes/globalnav.php'
	};
});






//51d332ab4d29764c2360bd4d

App.directive('clgEditor', function($http, Utils, SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.$on('linkedItem', function(){
			var content = SharedServices.linkedItem();
			
			if(content.type == "page") {
				scope.editorType = content.type;
				var ref = {
					ref:'content',
					id: content.id
				}  
				$http.get('app/api/get-page.php', {params:ref}).success(function(data){
					scope.editorContent = data;
					//$scope.page.content = Utils.makeMarkdown($scope.page.content);
				});

			} else {
				scope.editorType = content.type;

				scope.editorContent = content;

			}
			// console.log(SharedServices.linkedItem());
		});

		scope.versionPage = function() {
			var page = angular.copy(scope.editorContent);
			page.title = 'versioned page test';
			page.versionedFrom = page._id.$id;
			delete page._id;

			PageModel.createNewPage(angular.toJson(page)).success(function(data){

				console.log(data)
				var content = SharedServices.linkedItem();
				content.id = data.$id.$id;
				scope.$emit('linkedItem');
			});

		}
		scope.save = function() {
			console.log(scope)
			if(scope.editorType == 'page') {
				PageModel.savePage(scope.editorContent);
				GuideModel.saveGuide(SharedServices.guide());

			} else {
				GuideModel.saveGuide(SharedServices.guide());
			}	
			
		}
		scope.addCode = function(item) {
			if(!scope.editorContent.code) {
				scope.editorContent.code = [];
			}
			scope.editorContent.code.push(item);
			scope.addCodeFrom = null;

			PageModel.savePage(scope.editorContent);
		}
		scope.addMetaTag = function(item) {
			if(!scope.editorContent.tags) {
				scope.editorContent.tags = [];
			}
			scope.editorContent.tags.push(item);


			PageModel.savePage(scope.editorContent);
		}

		scope.addMetaOther = function(item) {
			if(!scope.editorContent.other) {
				scope.editorContent.other = [];
			}
			scope.editorContent.other.push(item);


			PageModel.savePage(scope.editorContent);
		}
		
		scope.$watch('editorContent.content', function(editorContent) {
			//BROADCAST THE CHANGE
			scope.$broadcast('editorContentUpdated');

		});
		scope.$on('editorContentUpdated', function() {
			//GENERATE THE MARKDOWN
			scope.previewContent = Utils.makeMarkdown(scope.editorContent.content);

			//REPLACE THE CODE
			angular.forEach(scope.editorContent.code, function(value, key) {
				scope.previewContent = scope.previewContent.replace('[code '+key+']', '<pre>'+value+'</pre>');
			});
		})

	}

	function controller($scope) {
		// $scope.a = SharedServices.linkedItem();

		// $scope.$on('linkedItem', function(){
		// 	console.log($scope.a);
		// });
	}

	return {
		restrict: 'E',
		scope: {
			editorContent:'=',
			editorType:'=',
		},
		link:link,
		controller:controller,
		templateUrl:'app/view/directives/editor.php'
	};
});












