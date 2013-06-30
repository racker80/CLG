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
App.controller("GuidesController",function(e,t,n,r,i,s,o,u){var a=function(){i.getGuides().success(function(r){t.guides=r;i.getGuide(n.guideSlug).success(function(e){t.guide=e;t.book=n.bookSlug;t.chapter=n.chapterSlug});e.moreContent||(e.moreContent=[]);s.getContent().success(function(t){e.moreContent=t})})};a();e.addGuide=function(){i.addGuide(e.form);a()};e.deleteGuide=function(e){i.deleteGuide(e);a()};e.saveGuide=function(){e.guide.id=e.guide._id.$id;i.saveGuide(e.guide)};e.addBook=function(){i.addBook(e.form);i.saveGuide(e.guide)};e.deleteBook=function(t){i.deleteBook(t);i.saveGuide(e.guide)};e.copyBook=function(t){u.copyBook(e.guide.books[t])};e.pasteBook=function(){i.addBook(u.copiedItem);i.saveGuide(e.guide)};e.addChapter=function(){i.addChapter(e.form);i.saveGuide(e.guide)};e.deleteChapter=function(t){i.deleteChapter(t);i.saveGuide(e.guide)};e.saveChapter=function(){i.saveGuide(e.guide)};e.copyChapter=function(t,n){u.copyChapter(e.guide.books[t].chapters[n])};e.pasteChapter=function(t){i.addChapter(u.copiedItem);i.saveGuide(e.guide)};e.$on("copiedChapter",function(){console.log("you've copied chapter:"+u.copiedItem.title)});e.$on("copiedBook",function(){console.log("you've copied book:"+u.copiedItem.title)});e.createNewPage=function(){s.createNewPage(e.form).success(function(t){i.addPageRef({id:t.$id.$id});i.saveGuide(e.guide)})};e.deletePage=function(e){};e.deletePageRef=function(t){i.deletePageRef(t);i.saveGuide(e.guide)};e.addPageRef=function(t){i.addPageRef({id:t});i.saveGuide(e.guide)};e.savePage=function(){s.savePage(e.page)};e.addCode=function(){e.page.code||(e.page.code=[]);e.page.code.push(e.addCodeForm);e.addCodeForm="";s.savePage(e.page)};e.indexUp=function(n){var r=t.guide.books,s=n-1;r.splice(s,0,r.splice(n,1)[0]);i.saveGuide(e.guide)};e.indexDown=function(n){var r=t.guide.books,s=n+1;r.splice(s,0,r.splice(n,1)[0]);i.saveGuide(e.guide)};e.indexPageUp=function(t){var r=e.guide.books[n.bookSlug].chapters[n.chapterSlug].pages,s=t-1;r.splice(s,0,r.splice(t,1)[0]);i.saveGuide(e.guide)};e.indexPageDown=function(t){var r=e.guide.books[n.bookSlug].chapters[n.chapterSlug].pages,s=t+1;r.splice(s,0,r.splice(t,1)[0]);i.saveGuide(e.guide)}});App.controller("PageDetailController",function(e,t,n,r,i,s){var o=function(){i.getGuide(r.guideSlug).success(function(n){t.guide=n;e.book=r.bookSlug;e.chapter=r.chapterSlug;var i={ref:"content",id:e.guide.books[r.bookSlug].chapters[r.chapterSlug].pages[r.pageIndex].id};s.getPage(i).success(function(t){e.page=t})})};o();e.savePage=function(){s.savePage(e.page)};e.addCode=function(){if(!e.page.code){console.log("empty");e.page.code=[]}e.page.code.push(e.addCodeForm);console.log(e.page.code);s.savePage(e.page)}});