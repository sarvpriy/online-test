<?php


header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

$testId = $_POST['testId'];
// $testId = 1;
$userId = $_POST['userId'];
// $userId = 1;
$marks = $_POST['marks'];
// $marks = 10;

if ( $_POST ) {

	$per = new Performance;

	$per->user_id = $userId;
	$per->test_id = $testId;
	$per->marks = $marks;

	if ($per->save()) {
		$response['status'] = true;
	}else{
		$response['status'] = false;
	}
}else{
	$response['status'] = false;
}

echo json_encode($response['status']);

?>