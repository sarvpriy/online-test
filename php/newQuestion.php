<?php

header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

if ($_POST['que']) {
	$que = new Question;
	$que->question = $_POST['que'];
	$que->opt1 = $_POST['opt1'];
	$que->opt2 = $_POST['opt2'];
	$que->opt3 = $_POST['opt3'];
	$que->opt4 = $_POST['opt4'];
	$que->ans = $_POST['ans'];
	$que->test_id = $_POST['testId'];

	if ($que->save()) {
		$response['status'] = 1;

	}else{
		$response['status'] = 0;
	}
}else{
	$response['status'] = "Please Fill All Fields";
}

echo json_encode($response['status']);

// print_r($_POST);


?>