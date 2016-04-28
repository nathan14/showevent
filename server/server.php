<?php
header("Access-Control-Allow-Methods: *");

require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/',
    function () {
        echo 'Show Events Server, Who is in?';
    }
);

// Get All Events
$app->get("/get-all-events.php", function () use ($app, $conn) {
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

//Get event by ID
$app->get("/get-event-by-id/:id", function ($id) use ($app, $conn) {
    $rows = array();
    $result = $conn->query("SELECT * FROM tbl16_Events_206 WHERE id = '$id'");

    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($rows);
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Post a new Event
$app->post("/post-new-event", function () use ($app, $conn) {
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
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Delete an event
$app->post("/event-delete/:id", function ($id) use ($app, $conn) {

    $conn->query("DELETE FROM tbl16_Events_206 WHERE ID = '$id'");
    $app->response()->header("Content-Type", "application/json");
    echo json_encode( "$id" +" Record deleted");
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Edit an event
$app->post("/event-edit", function () use ($app, $conn) {
    
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

    $rows = array();
    $conn->query("UPDATE tbl16_Events_206
                            SET performer = '$performer',
                            date = '$date',
                            time = '$time',
                            venue = '$venue',
                            price = '$price',
                            img = '$img',
                            website = '$website',
                            buyTickets = '$buyTickets',
                            contect = '$content'
                            WHERE id = '$id'");

    error_log($id . " Query Update Event Good \n", 3, "php.log");

    $app->response()->header("Content-Type", "application/json");
    $response = array("id"=>$id, "performer"=>$performer);
    echo json_encode($response);
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Add new click to event
$app->get("/event-new-click/:id", function ($id) use ($app, $conn) {
    $rows = array();
    $conn->query("UPDATE tbl16_Events_206
                            SET numberOfClicks = numberOfClicks + 1
                            WHERE id = '$id'");

    error_log($id . " Query Update clicks Good \n", 3, "php.log");

    $app->response()->header("Content-Type", "application/json");
    $response = array("id"=>$id);
    echo json_encode($response);
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Get number of clicks of Event by ID
$app->get("/get-event-clicks/:id", function ($id) use ($app, $conn) {
    $rows = array();
    $result = $conn->query("SELECT numberOfClicks FROM tbl16_Events_206 WHERE id = '$id'");

    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($rows);
    mysqli_free_result($result);
    mysqli_close($conn);
});

//Get the top 5 hottest events
$app->get("/get-hottest-events/", function () use ($app, $conn) {
    $rows = array();
    $result = $conn->query("SELECT * FROM tbl16_Events_206 where date >= NOW() order by numberOfClicks desc limit 5");

    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    $app->response()->header("Content-Type", "application/json");
    echo json_encode($rows);
    mysqli_free_result($result);
    mysqli_close($conn);
});

// Confirm username and password
$app->post("/authenticate-email-password/", function () use ($app, $conn) {
    
    $params =  $app->request->getBody();
    $paramsDecode = json_decode($params, true);

    $email = $paramsDecode['email'];
    $password = $paramsDecode['password'];

    $rows = array();
    $result = $conn->query("SELECT * FROM Users where email = '$email' and password = '$password'");

    $num_rows = $result->num_rows;

    echo $num_rows;
    mysqli_free_result($result);
    mysqli_close($conn);
});

$app->run();
?>