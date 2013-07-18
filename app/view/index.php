<global-nav></global-nav>


<div class="container-fluid">
	<div class="row-fluid">
        
        <h2>Guides</h2>
        <table class="table table-striped table-bordered">
        	<tbody>
        		<tr ng-repeat="guide in catalogue.guides">
        			<td>
        				<a href="#/{{$index}}">{{guide.title}}</a>
        			</td>
        		</tr>
        	</tbody>
        </table>
    
    	<a class="btn btn-primary" ng-click="catalogue.newGuide(false)">+ New Guide</a>
		
    </div>
</div>