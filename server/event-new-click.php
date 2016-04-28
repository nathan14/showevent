<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Add new click to event
$app->get("/", function () use ($app, $conn) {
    $params = $app->request();
    $id = $params->get('id');

    $rows = array();
    $conn->query("UPDATE tbl16_Events_206
                            SET numberOfClicks = numberOfClicks + 1
                            WHERE id = '$id'");

    error_log($id . " Query Update clicks Good \n", 3, "php.log");

    $app->response()->header("Content-Type", "application/json");
    $response = array("id"=>$id);
    echo json_encode($response);
    mysqli_close($conn);
});

$app->run();
?>