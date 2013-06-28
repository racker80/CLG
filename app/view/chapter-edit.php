	<div class="row-fluid">
		<div class="span3">
			<clg-side-nav />
		</div>
		<div class="span9">
			<h2>{{guide.title}} - {{guide.books[book].title}} - {{guide.books[book].chapters[chapter].title}}</h2>
			
			<textarea ng-model="guide.books[book].chapters[chapter].content" rows="15" cols="50" style="width:500px;"></textarea>
			<br>
			<button class="btn" ng-click="saveChapter()">Save</button>

			<h4>Code</h4>
			<div clg-format-content chapter="guide.books[book].chapters[chapter]" >
				<div ng-repeat="page in pages">
					<p>available code - {{page.title}}</p>
					<div ng-repeat="code in page.code"><pre>{{code}}</p></div>
				</div>
			</div>
				
				

			</div>
			

		</div>
	</div>

