<?php


header('Access-Control-Allow-Origin: *');

include 'conn.php';

session_start();

// $response = [];

$testId = $_POST['testId'];
// $ques = Question::find_by_test_id(1)();
$ques = Question::all(array('conditions' => 'test_id ='.$testId));

// print_r($ques);
// foreach ($ques as $que) {
// 		echo $que->question;
// }

// echo $ques->name;
// print_r($ques->name);

$outp = "";
$id = 0;

foreach ($ques as $que) {
	if ($outp != "") {
    	$outp .= ",";
    }
	// echo $que->name;
    $outp .= '{"id":"'  . $id++ . '",';
    $outp .= '"userAns":"",';
    $outp .= '"question":"'  . $que->question . '",';
    $outp .= '"opt1":"'  . $que->opt1 . '",';
    $outp .= '"opt2":"'  . $que->opt2 . '",';
    $outp .= '"opt3":"'  . $que->opt3 . '",';
    $outp .= '"opt4":"'  . $que->opt4 . '",';
    $outp .= '"ans":"'  . $que->ans  . '"}';
}
$outp ='{"records":['.$outp.']}';

echo($outp);


?>