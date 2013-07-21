<?php
header('Content-Type: application/json');

$m = new MongoClient();
$db = $m->selectDB('clg');

if($_REQUEST['collection']) {
	$c = $_REQUEST['collection'];
	$json = json_decode( stripslashes( urldecode($_REQUEST['json']) ) );

//content collection
	$collection = new MongoCollection($db, $c);
}


switch ($_REQUEST['action']) {
//+------------------------------------------------------------------------------------
// GET EVERYTHING
//+------------------------------------------------------------------------------------
	case 'getAll':
		$c = 'guides';
		$collection = new MongoCollection($db, $c);

		foreach($collection->find() as $item) : 
			$output['guides'][] = $item;
		endforeach;

		$c = 'content';
		$collection = new MongoCollection($db, $c);

		foreach($collection->find() as $item) : 
			$output['pages'][$item['id']] = (array)$item;
		endforeach;		

	break;


//+------------------------------------------------------------------------------------
// GET Guides
//+------------------------------------------------------------------------------------
	case 'getGuides':

		foreach($collection->find() as $item) : 
			$output[] = $item;
		endforeach;

	break;
//+------------------------------------------------------------------------------------
// ADD Guide
//+-----------------------------------------------------------------------------------
	case 'addGuide':

		$collection->insert($json, array("safe" => true));
		$output = $json;
	break;	
//+------------------------------------------------------------------------------------
// SAVE Guides
//+-----------------------------------------------------------------------------------
	case 'saveGuide':
		if(!$json->id) {
			$output = $collection->save($json);
		} else {
			//get the guide based on the id
			$guide = $collection->findOne(array("_id"=>new MongoId($json->id)));

			//get the _id in the json
			$json->_id = $guide['_id'];

			$collection->save($json);
			$output = $json;

		}

	break;	
//+------------------------------------------------------------------------------------
// DELETE Guides
//+-----------------------------------------------------------------------------------
	case 'deleteGuide':


	break;

//+------------------------------------------------------------------------------------
//+------------------------------------------------------------------------------------
//+------------------------------------------------------------------------------------
//+------------------------------------------------------------------------------------
//+------------------------------------------------------------------------------------


//+------------------------------------------------------------------------------------
// GET Pages
//+-----------------------------------------------------------------------------------
	case 'getPages':

		foreach($collection->find() as $item) : 
			$output[] = $item;
		endforeach;

	break;

//+------------------------------------------------------------------------------------
// GET Page
//+-----------------------------------------------------------------------------------
	case 'getPage':
	
		$ref = array(
			'$ref'=>$json->ref,
			'$id'=>new MongoId($json->id)
			);

		$output = $db->getDBRef($ref);

	break;

//+------------------------------------------------------------------------------------
// ADD Page
//+-----------------------------------------------------------------------------------
	case 'addPage':

		$collection->insert($json, array("safe" => true));
		$output = $json;
	break;

//+------------------------------------------------------------------------------------
// SAVE Page
//+-----------------------------------------------------------------------------------
	case 'savePage':
		$page = $collection->findOne(array("_id"=>new MongoId($json->id)));

		$json->_id = $page['_id'];

		$collection->save($json);

		$output = $json;
	break;

	default:
		
	break;
}

echo json_encode($output);

?>