<a href="#/">Home</a>
<ul class="">
	<li><a href="#/guides/{{guide.slug}}">{{guide.title}}</a>
		<ul class="">
			<li ng-repeat="book in guide.books">
				<a href="#/guides/{{guide.slug}}/books/{{$index}}">{{book.title}}</a>
				<ul class="">
					<li ng-repeat="chapter in book.chapters">
						<a href="#/guides/{{guide.slug}}/books/{{$parent.$index}}/chapters/{{$index}}">{{chapter.title}}</a>
					</li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
