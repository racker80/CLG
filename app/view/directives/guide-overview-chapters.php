		
		<ul id="overviewChapters">
			<li ng-repeat="chapter in chapters">
				<table class="table table-striped table-bordered">
					<tbody>
						<tr>
							<td>{{chapter.title}}</td>
							<td>edit</td>
						</tr>
					</tbody>
				</table>


					<!-- pages -->
					<div clg-guide-overview-pages pages="chapter.pages"></div>
					
					<!-- /pages -->

			</li>
		</ul>