<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// Confirm username and password
$app->post("/", function () use ($app, $conn) {
    $params =  $app->request->getBody();
    $paramsDecode = json_decode($params, true);

    $email = $paramsDecode['email'];
    $password = $paramsDecode['password'];

    $rows = array();
    $result = $conn->query("SELECT * FROM tbl16_Users_206 where email = '$email' and password = '$password'");

    $num_rows = $result->num_rows;
    echo $num_rows;

    mysqli_free_result($result);
    mysqli_close($conn);
});

$app->run();
?>