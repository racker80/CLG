<global-nav></global-nav>


<div class="container-fluid">
	<div class="row-fluid">
        
        <h2>Guides</h2>
        <table class="table table-striped table-bordered">
            <thead>
                
            </thead>
        	<tbody>
        		<tr ng-repeat="guide in catalogue.guides">
        			<td>
        				<h3><a href="#/guide/{{$index}}">{{guide.title}}</a></h3>
        			</td>
                    <td class="options">
                        <button index-actions ng-click="deleteGuide()" target="$index" class="btn btn-small">delete</button>
                    </td>
        		</tr>
        	</tbody>
        </table>
    
    	<a class="btn btn-primary" ng-click="catalogue.newGuide(false)">+ New Guide</a>
		
    </div>
</div>