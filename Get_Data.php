<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include_once './Sensor_Data.php';
$data = new Return_Obj();
$sensor_id = 1;
if (isset($_GET["id"])) {
    $sensor_id = $_GET["id"];
}
$servername = "localhost";
$username = "root";
$password = "einbaum";
$dbname = "einbaum";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

getSensors("sensors.id=$sensor_id");

$sql_val = "SELECT * FROM sensor_values WHERE sensor_values.key_sensor=$sensor_id and is_average=0";
if ($conn->multi_query($sql_val)) {
    do {
        $result_val = $conn->store_result();
        if ($result_val != FALSE) {
            if ($result_val->num_rows > 0) {
                while ($row = $result_val->fetch_assoc()) {
                    $sensor_id = $row["key_sensor"];
                    $sensor = $data->data[$sensor_id];
                    $datapoint = new Data_Point();
                    $datapoint->value_1 = $row["value_1"];

                    $datapoint->value_2 = $row["value_2"];
                    $datapoint->measured_on = $row["measured_on"];
                    array_push($sensor->data_values, $datapoint);
                }
            } else {
                log_js("No values found!");
            }
            $result_val->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    log_js("Error on SQL for values");
}
$data->convertDataToArray();
echo json_encode($data);
$conn->close();
