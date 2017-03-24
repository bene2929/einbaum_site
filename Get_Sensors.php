<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
include_once './Sensor_Data.php';
getSensors("");

$sql = "SELECT * FROM einbaum.valuetypes";
$result_val = $conn->query($sql);
if ($result_val->num_rows > 0) {
    while ($row = $result_val->fetch_assoc()) {
        $valuetype=new ValueType();
        $valuetype->alias=$row["alias"];
        $valuetype->key=$row["id"];
        array_push($data->value_types, $valuetype);
    }
} else {
    log_js("No sensors found");
}
log_js("Finished!");
$data->convertDataToArray();
echo json_encode($data);
$conn->close();

