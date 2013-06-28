<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

if($_REQUEST['slug']) {
	$output = $collection->findOne($_REQUEST);
} else {
	foreach($collection->find($_REQUEST) as $item) : 

		$output[] = $item;

	endforeach;
}

echo json_encode($output);


?>