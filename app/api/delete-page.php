<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');

$guideCollection = new MongoCollection($db, 'guides');
$guide = $guideCollection->findOne(array("_id"=>new MongoId($_GET['guideId'])));
unset($guide['books'][$_REQUEST['bookId']]['chapters'][$_REQUEST['chapterId']]['pages'][$_REQUEST['pageIndex']]);
$guideCollection->save($guide);


//content collection
$contentCollection = new MongoCollection($db, 'content');
$d = $contentCollection->remove(array("_id"=>new MongoId($_REQUEST['pageId'])), array("safe" => true));
echo json_encode($_REQUEST['pageId']);

?>