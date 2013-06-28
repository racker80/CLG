<?php
header('Content-Type: application/json');
$m = new MongoClient();
$db = $m->selectDB('clg');
//content collection
$collection = new MongoCollection($db, 'guides');

//decode the json
$json = json_decode(stripslashes($_REQUEST['json']), true);

//get the guide based on the id
$guide = $collection->findOne(array("_id"=>new MongoId($json['id'])));

//get the _id in the json
$json['_id'] = $guide['_id'];

$output = $collection->save($json);

echo json_encode($output);



?>