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

		$c = 'content';
		$collection = new MongoCollection($db, $c);

		foreach($collection->find() as $item) : 
			$item['id'] = $item['_id'].$id;
			$item['type'] = "page";
			// $output['pages'][$item['_id'].$id] = (array)$item;
			$output['pages'][] = (array)$item;
		endforeach;	

		$c = 'guides';
		$collection = new MongoCollection($db, $c);

		foreach($collection->find() as $item) : 
			$output['guides'][] = $item;
		endforeach;

	

// // jSON URL which should be requested
// $json_url = 'http://192.237.165.197/CLG/app/api/?action=getAll';
// // jSON String for request

// // Initializing curl
// $ch = curl_init( $json_url );

// // Configuring curl options
// $options = array(
// CURLOPT_RETURNTRANSFER => true,
// CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
// );

// // Setting curl options
// curl_setopt_array( $ch, $options );
 
// // Getting results
// $output =  json_decode(curl_exec($ch)); // Getting jSON result string

	break;


//+------------------------------------------------------------------------------------
// GET Guides
//+------------------------------------------------------------------------------------
	case 'getGuides':
		$c = 'guides';
		$collection = new MongoCollection($db, $c);
		foreach($collection->find() as $item) : 
			$output[] = $item;
		endforeach;

	break;

//+------------------------------------------------------------------------------------
// GET Guides Overview
//+------------------------------------------------------------------------------------
	case 'getGuidesOverview':
		$c = 'guides';
		$collection = new MongoCollection($db, $c);
		foreach($collection->find() as $item) : 
			unset($item['children']);
			$output[] = $item;
		endforeach;

	break;	
//+------------------------------------------------------------------------------------
// GET Guide by slug
//+------------------------------------------------------------------------------------
	case 'getGuideBySlug':
		$c = 'guides';
		$collection = new MongoCollection($db, $c);
		foreach($collection->find() as $item) :
			if($item['slug'] === $_REQUEST['slug']) {
				$output = $item;
			} 
		endforeach;

	break;

//+------------------------------------------------------------------------------------
// ADD Guide
//+-----------------------------------------------------------------------------------
	case 'addGuide':
		$c = 'guides';
		$collection = new MongoCollection($db, $c);
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

		$collection->insert($json, array("safe" => false));
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
if($_REQUEST['jsonp']==true) {
	echo $_GET['callback'].'('.json_encode($output).')';
} else {
	echo json_encode($output);
}


?>