

<div class="container-fluid">
	<div class="row-fluid">
                

<div class="sidebar span2">
<a index-actions type="page" location="catalogue.edit.pages" ng-click="addNewPage()">New Page</a>
		<ul class="indexContainer">
			<li><h3>Pages</h3></li>
			<ul class="indexChild">
				<li ng-repeat="page in catalogue.pages">
					<span class="indexTitle" edit-item item="page">{{page.title}}</span>
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