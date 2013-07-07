

App.directive('clgNav', function(SharedServices, PageModel, GuideModel, $http){
	return {
		restrict: 'E',
		templateUrl:'app/view/includes/globalnav.php',
		controller:"MainController"
	};
});


App.directive('fileUpload', function ($http, SharedServices, $rootScope) {

    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {

            	var options = {
					url:'app/api/cloudFilesUpload.php',
					progress:function(ev){ console.log('progress'); },
					error:function(ev){ console.log('error'); },
					success:function(data){ console.log(data); }
				}
				console.log(event.target);
            	var upload = new uploader(event.target, {
            		url:'app/api/cloudFilesUpload.php',
					progress:function(ev){ console.log('progress'); },
					error:function(ev){ console.log('error'); },
					success:function(data){ 

						var data = angular.fromJson(data);

						console.log(data);

						SharedServices.copyItem(data);
						$rootScope.$broadcast('fileUploaded');
					 }
				});

                upload.send();

                //iterate files since 'multiple' may be specified on the element
                // for (var i = 0;i<files.length;i++) {
                //     //emit event upward
                //     scope.$emit("fileSelected", { file: files[i] });
                //     console.log(files[i])
                // }                                       
            });
        }
    };
    
});




//51d332ab4d29764c2360bd4d









