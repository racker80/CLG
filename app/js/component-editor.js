angular.module('clg.editor', [])

.constant('clgEditorConfig', {

})

.controller('clgEditorController', function ($scope, $rootScope, $routeParams, $location, $http, clgEditorConfig, GuideModel, PageModel, SharedServices) {
		$scope.templates = {
				none:"",
				page:"app/view/directives/page.php",
				chapter:"app/view/directives/chapter.php",
				book:"app/view/directives/book.php",
				guide:"app/view/directives/guide.php",
			};

		$scope.editorContent = {
			type:'none'
		};

		//$scope.editorContent = SharedServices.linkedItem();

		// var updateEditorContent = function(content) {
		// 	//var content = SharedServices.linkedItem();

		// 	if(content.type == "page") {
		// 		var ref = {
		// 			ref:'content',
		// 			id: content.id
		// 		}  


		// 		$http.get('app/api/get-page.php', {params:ref}).success(function(data){
		// 			$scope.editorContent = data;
		// 			//scope.previewContent = Utils.makeMarkdown(scope.editorContent.content);

		// 		});

		// 	} else {

		// 		$scope.editorContent = content;
		// 		setTimeout(function(){
		// 			$scope.$apply($scope.editorContent);

		// 		},100);

		// 	}
		// }
		// $scope.$on('linkedItem', function(){
		// 	var content = SharedServices.linkedItem();
		// 	$scope.editorTemplateUrl = templates[content.type];
		// 	updateEditorContent(content);
		// });

		// // $scope.$watch('editorContent.type', function(type){
		// // 	setTimeout(function(){
		// // 		$scope.editorTemplateUrl = templates[type];

		// // 	},100);
		// // });

		// $scope.templateUrl = function() {
		// 	var templates = {
		// 		none:"",
		// 		page:"app/view/directives/page.php",
		// 		chapter:"app/view/directives/chapter.php",
		// 		book:"app/view/directives/book.php",
		// 		guide:"app/view/directives/guide.php",
		// 	};
		// 	if(!$scope.editorContent.type) {
		// 		$scope.editorContent.type="page";
		// 	}
		// 	return templates[$scope.editorContent.type];
		// }
})
.directive('editorContainer', function(SharedServices, $templateCache){
	function link(scope, element, attrs) {
		$(element).observe(attrs.src, function(){
			console.log(attrs.src);
		})
		console.log(attrs.src)

	}

	return {
		restrict:'EA',
		compile:function(tElement, tAttrs, transclude) {
			console.log(tElement)
            var html = 'test';
            tElement.html(html);
        },
 		controller:'clgEditorController',
 		transclude:true,
 		replace:true
	};
})
.directive('editorActions', function (GuideModel, PageModel, SharedServices) {
	var link = function(scope) {
		scope.save = function() {
			console.log(scope)
			if(scope.editorContent.type == 'page') {
				PageModel.savePage(scope.editorContent);
				GuideModel.saveGuide(SharedServices.guide());

			} else {
				GuideModel.saveGuide(SharedServices.guide());
			}	
			
		}		
	}
  return {
    restrict:'EA',
    controller:'clgEditorController',
    link:link
  };
});





//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//CONTROLLER
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

App.controller('EditorController', function($scope, $rootScope, $routeParams, $location, $http, GuideModel, PageModel, SharedServices, Utils) {
	
	//set default editor state is off in shared services
	SharedServices.setEditor(false);

	//set the local show variable
	$scope.show = SharedServices.editorStatus();
	
	//UPDATE THE EDITOR STATE
	$scope.$on('editorState', function(){
		$scope.show = SharedServices.editorStatus();
	});




});


//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------
//DIRECTIVES
//+-------------------------------------------------------------------------------------------
//+-------------------------------------------------------------------------------------------

App.directive('clgEditor', function($http, Utils, SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {
			// scope.$watch('image', function() {
			// 	console.log(scope)
			// })
		scope.$on('linkedItem', function(){
			var content = SharedServices.linkedItem();
			scope.editorType = content.type;


			if(content.type == "page") {
				var ref = {
					ref:'content',
					id: content.id
				}  
				$http.get('app/api/get-page.php', {params:ref}).success(function(data){
					scope.editorContent = data;
					//scope.previewContent = Utils.makeMarkdown(scope.editorContent.content);
				});

			} else {

				scope.editorContent = content;

			}

		});

		scope.$on('fileUploaded', function() {
			if(!angular.isDefined(scope.editorContent.images)) {
				scope.editorContent.images = [];
			}

			scope.editorContent.images.push(SharedServices.copiedItem());
			PageModel.savePage(scope.editorContent);

		});


		scope.deleteImage = function(name, index) {
			$http.get('app/api/cloudfilesDelete.php', {params:{name:name}}).success(function(data){
				console.log(data);
				scope.editorContent.images.splice(index, 1);
				PageModel.savePage(scope.editorContent);
			});
		}


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
		
		//BROADCAST THAT THERE HAS BEEN A CHANGE TO CONTENT
		scope.$watch('editorContent.content', function(editorContent) {
			//BROADCAST THE CHANGE
			scope.$broadcast('editorContentUpdated');

		});

		//GENERATE MARKDOWN AND CODE
		scope.$on('editorContentUpdated', function() {
			//GENERATE THE MARKDOWN
			if(angular.isDefined(scope.editorContent)) {
				scope.previewContent = Utils.makeMarkdown(scope.editorContent.content);

				//REPLACE THE CODE
				angular.forEach(scope.editorContent.code, function(value, key) {
					scope.previewContent = scope.previewContent.replace('[code '+key+']', '<pre>'+value+'</pre>');
				});
				//REPLACE THE IMAGES
				angular.forEach(scope.editorContent.images, function(value, key) {
					scope.previewContent = scope.previewContent.replace('[image '+key+']', '<img src="'+value.url+'">');
				});				
			}
		});



	}
	return {
		restrict: 'E',
		scope: {
			editorContent:'=',
			editorType:'=',
		},
		link:link,
		templateUrl:'app/view/directives/editor.php',
		controller:'EditorController'
	};
});

App.directive('clgUploadContainer', function($rootScope, $http, Utils, SharedServices, PageModel, GuideModel){
	function link(scope, element, attrs) {
		scope.$watch('image', function(image){
			if(angular.isDefined(image)) {
				console.log(image)

				var input = {
					files:[]
				};
				
				input.files.push(image.file);
				
				var upload = new uploader(input, {
					url:'app/api/cloudFilesUpload.php',
					progress:function(ev){ console.log('progress'); },
					error:function(ev){ console.log(ev); },
					success:function(data){ 

						var data = angular.fromJson(data);

						console.log(data);

						SharedServices.copyItem(data);
						$rootScope.$broadcast('fileUploaded');

					}
				});

				upload.send();

			}
		});
	}
	return {
		restrict: 'A',
		scope: {},
		link:link,
		controller:'EditorController'
	};
});


