<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Post a new Event
$app->post("/", function () use ($app, $conn) {
    $params =  $app->request->getBody();
    $paramsDecode = json_decode($params, true);

    $performer = $paramsDecode['performer'];
    $date = $paramsDecode['date'];
    $time = $paramsDecode['time'];
    $venue = $paramsDecode['venue'];
    $price = $paramsDecode['price'];
    $img = $paramsDecode['img'];
    $website = $paramsDecode['website'];
    $buyTickets = $paramsDecode['buyTickets'];
    $contect = $paramsDecode['contect'];
    $numberOfClicks = 0;

    $conn->query("INSERT INTO tbl16_Events_206 (imgurl , performer ,website , buyTickets, date , time , venue ,price , numberOfClicks , content)
                  VALUES ('$img', '$performer' ,'$website', '$buyTickets', '$date' , '$time' , '$venue', '$price' , '$numberOfClicks', '$contect')");

    $id = mysqli_insert_id($conn);
    
    error_log($id . " Query New Event Insert \n", 3, "php.log");

    $app->response()->header("Content-Type", "application/json");
    $response = array("id"=>$id, "performer"=>$performer);
    echo json_encode($response);
    mysqli_close($conn);
});

$app->run();
?>