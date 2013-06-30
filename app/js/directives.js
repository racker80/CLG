App.directive('clgAddPage', function(SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {

		scope.addPage = function() {
			var page = scope.form;
			var guide = SharedServices.guide();

			PageModel.createNewPage(page).success(function(data){
				guide.books[scope.bookIndex].chapters[scope.chapterIndex].pages.push({id:data.$id.$id});

				//SAVE THE GUIDE
				GuideModel.saveGuide(guide);

				scope.form = {};		

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
			scope.form.pages = [];
			var chapter = scope.form;
			var guide = SharedServices.guide();

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
			scope.form.chapters = [];
			var book = scope.form;
			var guide = SharedServices.guide();

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
								console.log(scope.editorContent)

				PageModel.savePage(scope.editorContent);
			} else {
				GuideModel.saveGuide(SharedServices.guide());
								console.log('saved guidemodel')

			}	
			
		}
		scope.$watch('editorContent.content', function(editorContent) {
			console.log(scope.editorType);
			scope.previewContent = Utils.makeMarkdown(editorContent);
		});

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












