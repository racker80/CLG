<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');



$json = json_decode(file_get_contents("db.json"));


$pages = $json->pages;
$collection = new MongoCollection($db, 'content');
$collection->drop();
foreach($pages as $page) {

	$page->_id = new MongoId($page->id);

	$collection->insert($page, array("safe" => false));
}



$guides = $json->guides;
$collection = new MongoCollection($db, 'guides');
$collection->drop();
foreach($guides as $guide) {
	$guide->_id = new MongoId($guide->id);
	$collection->insert($guide, array("safe" => false));
}	


?>