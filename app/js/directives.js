App.directive('clgAddPage', function(SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.addPage = function() {
			var page = {
				title:'new page'
			};
			var guide = SharedServices.guide();

			PageModel.createNewPage(page).success(function(data){
				guide.books[scope.bookIndex].chapters[scope.chapterIndex].pages.push({id:data.$id.$id});

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










App.directive('clgEditor', function(Utils, SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.save = function() {
			if(scope.editorType == 'page') {
				PageModel.savePage(scope.editorContent);
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

	return {
		restrict: 'E',
		scope: {
			editorContent:'=',
			editorType:'=',
		},
		link:link,
		isolate:true,
		templateUrl:'app/view/directives/editor.php'
	};
});












