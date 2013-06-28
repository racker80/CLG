<div class="container">
	<div class="row">
		<div class="span3">
			<clg-side-nav />
		</div>
		<div class="span9">
			<h2>{{guide.title}} - {{guide.books[book].title}} - {{guide.books[book].chapters[chapter].title}}</h2>
			<p>{{guide.description}}</p>

			
			<input type="text" ng-model="page.title" />
			<br>
			<textarea ng-model="page.content" rows="15" cols="50" style="width:500px;"></textarea>
			
			<h4>Code</h4>
			<div ng-repeat="item in page.code">
				<pre>{{item}}</pre>
			</div>
			<input type="text" ng-model="addCodeForm"> <button class="btn" ng-click="addCode()">Add Code</button>

			<h4>tags</h4>
			<div ng-repeat="tag in page.tags">
				<pre>{{tag}}</pre>
			</div>
			
			<button class="btn" ng-click="savePage()">Save</button>

		</div>
	</div>

</div>