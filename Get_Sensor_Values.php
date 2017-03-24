<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include_once './Sensor_Data.php';

//creating def-values, if they are not set
$points = 50;
if (isset($_GET["points"])) {
    $points = $_GET["points"];
}
$select_only_avg = false;
$age = "D";
$age_h = 24;
if (isset($_GET["age"])) {
    $age = $_GET["age"];
    $select_only_avg = ($age == "M") || ($age == "J");
    if ($select_only_avg) {
        $select_only_avg = "1";
    } else {
        $select_only_avg = "0";
    }
    switch ($age) {
        case "D":
            $age_h = 24;
            break;
        case "W":
            $age_h = 168;
            break;
        case "M":
            $age_h = 744;
            break;
        case "J":
            $age_h = 8760;
            break;
        case "ALL":
            $age_h = -1;
            break;
    }
}
$sensor_ids = [];
if (isset($_GET["ids_to_load"])) {
    $sensor_ids = $_GET["ids_to_load"];
}

$select_where_sensors = "";
$select_where_values = " AND";
for ($index = 0; $index < count($sensor_ids); $index++) {

    $select_where_sensors .= " sensors.id = '$sensor_ids[$index]'";
    $select_where_values .= " key_sensor='$sensor_ids[$index]' ";
    if ($index < count($sensor_ids) - 1) {
        $select_where_sensors .= " OR";
        $select_where_values .= " OR";
    }
}
$value_types = [];
if (isset($_GET["value_types"])) {
    $value_types = $_GET["value_types"];
}
$select_where_type = "";
for ($index = 0; $index < count($value_types); $index++) {

    $select_where_type .= " key_valuetype = '$value_types[$index]'";
    if ($index < count($value_types) - 1) {
        $select_where_type .= " OR";
    }
}
log_js($value_types);
if (empty($select_where_type)) {
    $select_where_type = "key_valuetype=0";
}
getSensors($select_where_sensors);
$sql_val = "";

for ($index = 0; $index < count($sensor_ids); $index++) {
    $sql_val .= "SELECT * FROM sensor_values "
            . "WHERE ((measured_on> DATE_SUB(now(), INTERVAL $age_h HOUR) OR $age_h = -1) "
            . "OR id=(SELECT id from sensor_values where key_sensor=$sensor_ids[$index] order by measured_on limit 1)) "
            . "AND key_sensor=$sensor_ids[$index] AND $select_where_type;";
}

log_js($sql_val);
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
                    $datapoint->valuetype = $row["key_valuetype"];
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

