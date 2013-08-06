

<div class="container-fluid">
	<div class="row-fluid">
                

<div class="sidebar span2">
<a index-actions type="page" location="edit.pages" ng-click="addNew()">New Page</a>
		<ul class="indexContainer">
			<li><h3>Pages</h3></li>
			<ul class="indexChild">
				<li ng-repeat="page in catalogue.pages">
					<a href="#/content/{{page.id}}"><span  class="indexTitle" >{{page.title}}</span></a>
					<span class="btn btn-small option-delete" index-actions ng-click="deletePage()" target="page">x</span>
				</li>	
			</ul>
		</ul>


</div>



<div class="editor span10">
	<global-nav></global-nav>

	<div clg-editor></div>
</div>







	</div>
</div>