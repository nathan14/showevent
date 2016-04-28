<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Get number of clicks of Event by ID
$app->get("", function () use ($app, $conn) {
    $params = $app->request();
    $id = $params->get('id');

    $rows = array();
    $result = $conn->query("SELECT numberOfClicks FROM tbl16_Events_206 WHERE id = '$id'");

    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($rows);
    mysqli_close($conn);
});

$app->run();
?>