<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Edit an event
$app->post("/", function () use ($app, $conn) {
    $params =  $app->request->getBody();
    $paramsDecode = json_decode($params, true);

    $id = $paramsDecode['id'];
    $performer = $paramsDecode['performer'];
    $date = $paramsDecode['date'];
    $time = $paramsDecode['time'];
    $venue = $paramsDecode['venue'];
    $price = $paramsDecode['price'];
    $img = $paramsDecode['img'];
    $website = $paramsDecode['website'];
    $buyTickets = $paramsDecode['buyTickets'];
    $contect = $paramsDecode['contect'];

    $rows = array();
    $conn->query("UPDATE tbl16_Events_206
                    SET
                    performer = '$performer',
                    date = '$date',
                    time = '$time',
                    venue = '$venue',
                    price = '$price',
                    imgurl = '$img',
                    website = '$website',
                    buyTickets = '$buyTickets',
                    content = '$content'
                    WHERE 'id' = '$id'");

    error_log($date . " Query Update Event Good \n", 3, "php.log");

    $app->response()->header("Content-Type", "application/json");
    $response = array("id"=>$id, "performer"=>$performer);
    echo json_encode($response);
    mysqli_close($conn);
});

$app->run();
?>