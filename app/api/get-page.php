<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');
// //content collection
// $collection = new MongoCollection($db, 'guides');

// $guide = $collection->findOne(array("_id"=>new MongoId($_GET['guideId'])));

$ref = array(
	'$ref'=>$_REQUEST['ref'],
	'$id'=>new MongoId($_REQUEST['id'])
	);

$content = $db->getDBRef($ref);

if($content == null) {

// $guideCollection = new MongoCollection($db, 'guides');
// $guide = $guideCollection->findOne(array("_id"=>new MongoId($_GET['guideId'])));
// unset($guide['books'][$_REQUEST['bookId']]['chapters'][$_REQUEST['chapterId']]['pages'][$_REQUEST['pageIndex']]);
// $guideCollection->save($guide);


}

echo json_encode($content);

?>