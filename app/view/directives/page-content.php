<div class="well">
		<h3>{{title}}</h3>

		<div ng-bind-html-unsafe="content"></div>


		<span ng-click="deletePageRef($index)" style="cursor:pointer;">delete</span>

		<div ng-click="indexPageUp($index)" style="cursor:pointer;">Index up</div>
		<div ng-click="indexPageDown($index)" style="cursor:pointer;">Index Down</div>

		<a href="#/guides/{{guide.slug}}/books/{{book}}/chapters/{{chapter}}/pages/{{$index}}">Edit</a>
</div>