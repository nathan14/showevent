<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// Get All Events
$app->get("/", function () use ($app, $conn) {
    $rows = array();
    $result = $conn->query("SELECT * FROM tbl16_Events_206 ORDER BY date,id DESC");

    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($rows);

    mysqli_free_result($result);
    mysqli_close($conn);
});

$app->run();
?>