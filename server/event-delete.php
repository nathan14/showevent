<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Delete an event
$app->post("/", function () use ($app, $conn) {
    $params =  $app->request->getBody();
    $paramsDecode = json_decode($params, true);

    $id = $paramsDecode['id'];

    $conn->query("DELETE FROM tbl16_Events_206 WHERE ID = '$id'");

    $app->response()->header("Content-Type", "application/json");
    echo json_encode( "$id" +" Record deleted");
    mysqli_close($conn);
});

$app->run();
?>