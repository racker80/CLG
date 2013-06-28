<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

$guide = $collection->findOne(array("_id"=>new MongoId($_GET['guideId'])));

$bookId = $_REQUEST['bookId'];
unset($_REQUEST['guideId']);
unset($_REQUEST['bookId']);


$guide['books'][$bookId]['chapters'][] = $_REQUEST;


foreach($guide['books'] as $key=>$value) {
	if($value['title'] == $bookId) {
	}
}

$collection->save($guide);

echo json_encode($guide);

?>
