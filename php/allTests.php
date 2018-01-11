<?php

// header("Access-Control-Allow-Origin: *");
// // header("Content-Type: application/json; charset=UTF-8");

// $conn = new mysqli("localhost", "root", "", "test");

// $result = $conn->query("SELECT * FROM tests");

// $outp = "";

// while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
//     if ($outp != "") {
//     	$outp .= ",";
//     }
//     $outp .= '{"id":"'  . $rs["id"] . '",';
//     $outp .= '"name":"'   . $rs["name"]        . '"}';
// }
// $outp ='{"records":['.$outp.']}';
// $conn->close();

// echo($outp);


header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

$response = [];

$tests = Test::all();

// print_r($tests);

// echo $tests;

// foreach ($tests as $r) {
// 	array_push($response, $r->name);
// };
$outp = "";

foreach ($tests as $test) {
	if ($outp != "") {
    	$outp .= ",";
    }
	// echo $test->name;
    $outp .= '{"id":"'  . $test->id . '",';
    $outp .= '"name":"'   . $test->name        . '"}';
}
$outp ='{"records":['.$outp.']}';

echo($outp);


// while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
//     if ($outp != "") {
//     	$outp .= ",";
//     }
//     $outp .= '{"id":"'  . $rs["id"] . '",';
//     $outp .= '"name":"'   . $rs["name"]        . '"}';
// }
// $outp ='{"records":['.$outp.']}';

// echo($outp);

// print_r($tests);


?>