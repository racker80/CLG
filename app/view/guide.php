<global-nav></global-nav>


<div class="container-fluid">
	<div class="row-fluid">
                



<div class="span4">
	<input type="text" ng-model="catalogue.guide.title"> <button class="btn btn-primary btn-small" ng-click="catalogue.saveGuide()">save</button>
	
	<div ng-repeat="book in catalogue.guide.books">
			<div edit-item item="book">edit - {{item.title}}</div>
			<br><br><br>
			<div ng-repeat="chapter in book.chapters">
				<div edit-item item="chapter">edit - {{item.title}}</div>
				<br>
				<ul>
					<li ng-repeat="page in chapter.pages">
						<span page-content="page">
							{{page.title}}
							<span edit-item item="page">edit</span>
						</span>
					</li>
				</ul>

			</div>
		<hr>
	</div>
</div>



<div class="span8">
	<div clg-editor>

	</div>
</div>







	</div>
</div>