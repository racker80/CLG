App.directive('clgSideNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/view/directives/sidenav.php',
  };
});



App.directive('clgPageContent', function(UtilFactory) {
  

  function link(scope, element) {

      UtilFactory.getPageFromId(scope.page.id, 'content').success(function(data){
                scope.page = data;
                scope.content = UtilFactory.makeMarkdown(scope.page.content);
                scope.title = scope.page.title;

                angular.forEach(scope.page.code, function(value, key) {
                  scope.content = scope.content.replace('[code '+key+']', '<pre>'+value+'</pre>');
                });

              });


      
  }
  return {
    restrict: 'E',
    templateUrl: 'app/view/directives/page-content.php',
    link:link
    }
});




App.directive('clgFormatContent', function(UtilFactory) {
  function link(scope, elem, attributes) {

        scope.$watch('chapter', function(chapter) {
           if(chapter) {

            scope.chapterContent = UtilFactory.makeMarkdown(chapter.content);


            if(!scope.pages) { scope.pages = []; }

            angular.forEach(chapter.pages, function(value, key) {
              UtilFactory.getPageFromId(value.id, 'content').success(function(data){
                scope.pages.push(data);
              });
            });

          }
        });

      }

    function controller($scope, $element, $attrs, $location) {

    }

    return {
      restrict: 'A',
      scope: {
        chapter:'=',
      },
      link:link,
      controller: controller
    }
});




//GUIDE OVERVIEW
App.directive('clgGuideOverview', function($rootScope, UtilFactory, sharedServices, GuideModel, PageModel) {
  function link(scope, element, attr) {





    // scope.$watch('guide', function(guide) {
    //   if(guide) {
    //     scope.books = guide.books

    //     angular.forEach(guide.books, function(book) {

    //           //loop each chapter
    //            angular.forEach(book.chapters, function(chapter) {
                
    //             // loop each page
    //             angular.forEach(chapter.pages, function(page) {

                    

    //             });

    //           });

    //     });




      // }//if guide


      
    // });
    
  }
  function controller($scope, $element) {
    $scope.addBookDialog = function() {
      UtilFactory.addBookDialog();
    }
    $scope.addChapterDialog = function(bookIndex) {
      UtilFactory.addChapterDialog(bookIndex);
    }
  }

  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview.php',
    scope: {
      guide:'=',
    },
    transclude: true,
    link:link,
    controller:controller
  };
});

//CHAPTER
App.directive('clgGuideOverviewChapters', function($rootScope, UtilFactory, sharedServices, GuideModel, PageModel) {
  function link(scope, element, attributes) {

    scope.$watch('guideReady', function() {
      
    
    });
  }
  function controller($scope, $element) {

  }
  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview-chapters.php',
    scope: {
      chapters:'='
    },
    link:link,
    controller:controller
  };
});

//PAGES
App.directive('clgGuideOverviewPages', function(UtilFactory, sharedServices, GuideModel, PageModel, $rootScope) {
  function link(scope, element, attributes) {


 // angular.forEach(scope.pages, function(value, key) {
          //   console.log($rootScope.pages[value]);
          // });
          // scope.content = $rootScope.pages[scope.page.id];
        scope.$watch('pageReady', function() {
          if(scope.pages) {
            angular.forEach(scope.pages, function(value, key) {
              console.log($rootScope.pages)
              //value = $rootScope.pages[value];
            });
          }
          
        });

  }
  function controller($scope) {

  }
  return {
    restrict: 'A',
    templateUrl: 'app/view/directives/guide-overview-pages.php',
    scope: {
      pages:'=',
    },
    link:link,
    isolate:true,
    controller:controller
  };
});










// App.directive('clgPageContent', function(UtilFactory) {
//   var converter = new Showdown.converter();

//   function link(scope, element) {
//       var ref = {
//         ref:'content',
//         id: scope.page
//       }

//       UtilFactory.getPageFromId(scope.page, 'content').success(function(data){
//                 scope.page = data;
//                 scope.page.content = 
//               });

//       PageModel.getPage(ref).success(function(data) {


//         for(var i=0; i<data.code.length; i++) {
//           data.content = data.content.replace('[code '+i+']', '<pre>'+data.code[i]+'</pre>');
//         }

//         scope.pageContent = data;

//         scope.pageContent.content = converter.makeHtml(scope.pageContent.content);


//         console.log();
//       });
//   }
//   return {
//     restrict: 'E',
//     templateUrl: 'app/view/directives/page-content.php',
//     link:link
//     }
// });