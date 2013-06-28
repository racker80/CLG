<?php
header('Content-Type: application/json');
$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'content');

$json = json_decode(stripslashes($_REQUEST['json']), true);


$page = $collection->findOne(array("_id"=>new MongoId($json['id'])));

$json['_id'] = $page['_id'];

print_r($json);
$output = $collection->save($json);

echo json_encode($output);


?>