<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

$guide = $collection->findOne(array("_id"=>new MongoId($_GET['guideId'])));


//$guide['books'][] = $_REQUEST;


foreach($guide['books'] as $key=>$value) {

	if($value['title'] == $_REQUEST['title']) {
		unset($guide['books'][$key]);
	}

}

$collection->save($guide);

echo json_encode($guide);

?>