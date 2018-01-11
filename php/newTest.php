<?php

header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

$testName = $_POST['testName'];
$testTime = $_POST['testTime'];
$minusMarking = $_POST['minusMarking'];
// $testName = 'php';
if ($testName) {
	$test = new Test;

	$test->name = $testName;
	$test->total_time = $testTime;
	$test->minus_mark = $minusMarking;

	if ($test->save()) {
		$response['testId'] = $test->id;
		$response['status'] = 'Success';

	}else{
		$response['status'] = 'Failed';
	}
}else{
	$response['status'] = "Please Fill All Fields";
}

// echo $response;
echo json_encode($response);

// print_r($response);


?>