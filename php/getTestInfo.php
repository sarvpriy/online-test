<?php

header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

$testId = $_POST['testId'];

$test = Test::find_by_id($testId);

// $testName = 'php';
if ($test->name) {
	$response['testName'] = $test->name;
	$response['total_time'] = $test->total_time;
	$response['minus_mark'] = $test->minus_mark;
	// $test->name = $testName;
	$response['testId'] = $test->id;
	$response['status'] = 1;
}else{
	$response['status'] = 0;
}

// echo $response;
echo json_encode($response);

// print_r($response);


?>