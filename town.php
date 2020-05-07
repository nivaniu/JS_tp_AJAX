<?php
if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
    $uri = 'https://';
} else {
    $uri = 'http://';
}
$uri .= $_SERVER['HTTP_HOST'];
//	phpinfo();
$suggestArray = unserialize(file_get_contents("towns.txt"));
if (array_key_exists('s', $_GET) && $_GET['s'] != null && trim($_GET['s']) !== "" && strlen($_GET['s']) > 1) {
    $search = htmlspecialchars(htmlentities($_GET['s']));
    $suggestAnswer = array();
    $suggestAnswerStarting = array();
    foreach ($suggestArray as $arr) {
        if (stripos($arr, $search)) {
            array_push($suggestAnswer, $arr);
        } else if (strtolower(substr($arr, 0, strlen($search))) === strtolower($search)) {
            array_push($suggestAnswerStarting, substr($arr, strlen($search), strlen($arr)));
        }
    }
    array_multisort(array_map('strlen', $suggestAnswerStarting), $suggestAnswerStarting);
    for ($i = 0; $i < sizeof($suggestAnswerStarting); $i++) {
        $suggestAnswerStarting[$i] = $search . $suggestAnswerStarting[$i];
    }
    sort($suggestAnswer, SORT_REGULAR);
    $output = array_merge($suggestAnswerStarting, $suggestAnswer);
//    echo implode("|", $output);
    echo json_encode($output);
}
