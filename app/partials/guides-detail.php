<div class="container">

	<h2>{{phone.title}}</h2>
	<table class="table well">
		<tbody>
			<tr ng-repeat="p in phone">
				<td><a href="#/guides/{{p.slug}}">{{p.title}}</a></td>
			</tr>
		</tbody>
	</table>
	

</div>
