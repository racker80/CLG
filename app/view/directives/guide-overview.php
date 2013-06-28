<div class="sectionHeader">
	<h1>{{guide.title}}</h1>

	<div class="headerOptions">
					<span class="label label-info" ng-click="addBookDialog()">+ Add Book</span>	
	</div>
</div>

<ul class="overviewList">
	<li ng-repeat="book in books" data-index="{{$index}}">
	<!-- parent -->

		<div class="sectionHeader">
			<h2>{{book.title}}</h2>
			<div class="headerOptions">
				<span class="label label-info" ng-click="addChapterDialog($index)">+ Add Chapter</span>
				<span class="label label-info" ng-click="addBookDialog()">Edit Book</span>

			</div>
		</div>
		
		<hr>
		
		<!-- chapters -->
		<div id="overviewChaptersContainer" clg-guide-overview-chapters chapters="book.chapters"></div>

		<!-- /chapters -->

	<!-- /parent	 -->
	</li>
</ul>