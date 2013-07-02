
<div class="navbar">
	<div class="navbar-inner">
		<div class="container" style="width: auto;">
			<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</a>
			<a class="brand" href="#">Cloud Launch Guide</a>
			<div class="nav-collapse">
				<ul class="nav pull-right">
					<li class="dropdown active">
						<a href="#" class="dropdown-toggle">Guides  <b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a ng-click="addGuide()">New Guide</a></li>
							<li class="divider"></li>
							<li class="nav-header">All Guides</li>
							<li ng-repeat="g in guides"><a href="#/{{$index}}">{{g.title}}</a></li>
						</ul>
					</li>
					<li><a href="#">Content</a></li>
				</ul>

			</div><!-- /.nav-collapse -->
		</div>
	</div><!-- /navbar-inner -->
</div>

<div class="container-fluid">
	<div class="row-fluid">
                



<div class="span4">
	<h2>{{guide.title}}</h2>

	<clg-add-book>
		<button type="submit" class="btn btn-primary btn-small" ng-click="addBook()">Add Book</button>
	</clg-add-book>
			<a ng-click="edit(guide)">edit</a>

	<hr>

	<div class="well" ng-repeat="book in guide.books">
	<h3>{{book.title}}</h3>
	<a ng-click="deleteBook($index)">Delete</a> | 
	<a ng-click="pasteChapter($index)">Paste Chapter</a> | 
	<a ng-click="edit(book)">edit</a>

	<hr>

		<dl ng-repeat="chapter in book.chapters">
			<dt>{{chapter.title}} - <a ng-click="deleteChapter($index, $parent.$index)">Delete</a> | 
				<a ng-click="copyChapter($parent.$index, $index)">copy</a> |
				<a ng-click="edit(chapter)">edit</a>
			</dt>
			
			<dd ng-repeat="page in chapter.pages" ng-init="pageIndex=$index;">
				<span ng-controller="PageController">

					<a ng-click="pageUp($parent.$parent.$parent.$index, $parent.$parent.$index)">up</a> 
					<a ng-click="pageDown($parent.$parent.$parent.$index, $parent.$parent.$index)">Down</a> 
					{{page.title}}
					<a ng-click="deletePageRef($parent.$parent.$parent.$index, $parent.$parent.$index, $index)">delete</a>
					<!-- <div ng-bind-html-unsafe="page.content"></div> -->
				</span>
				<a ng-click="edit(page, 'page')">edit</a>

				
			</dd>
			<dd>
				
<!-- 			<button type="submit" class="btn btn-primary btn-small" ng-click="addPage($parent.$index, $index)">Add Page</button>
 -->
			<clg-add-page book-index="$parent.$index" chapter-index="$index">
				<span class="label label-info" ng-click="addPage()">+ Add Page</span>			
			</clg-add-page>
				

			</dd>
		</dl>

	<hr>

	<clg-add-chapter book-index="$index">
		<button type="submit" class="btn btn-primary btn-small" ng-click="addChapter()">Add Chapter</button>
	</clg-add-chapter>


	</div>

</div>



<div class="span8">
	<h4>Edit</h4>
	
	<clg-editor editor-content="editorContent" editor-type="editorType"></clg-editor>
</div>







	</div>
</div>