<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

$guide = $collection->findOne(array("_id"=>new MongoId($_GET['guideId'])));

unset($_REQUEST['guideId']);

$guide['books'][] = $_REQUEST;

$collection->save($guide);

echo json_encode($guide);

?>