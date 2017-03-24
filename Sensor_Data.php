<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Sensor_Data
 *
 * @author Benedikt
 */
class Sensor_Data {

    //put your code here
    var $id;
    var $pos_layer;
    var $pos_id;
    var $name;
    var $last_call;
    var $data_type_1;
    var $data_type_2;
    var $data_values;
    var $ip;
    var $msg;
    function Sensor_Data() {
        $this->data_values = [];
        $this->last_call = date("Y-m-d H:i:s", time());
    }

}

class Return_Obj {

    //put your code here
    var $message;
    var $data;
    var $value_types;

    function Return_Obj() {
        $this->message = array();
        $this->data = array();
        $this->value_types = array();
    }

    function convertDataToArray() {
        $this->data = array_values($this->data);
    }

}

function log_js($value) {
    global $data;
    array_push($data->message, $value);
}

class Data_Point {

    var $value_1;
    var $value_2;
    var $measured_on;
    var $valuetype;

}

class Data_Type {

    var $unit;
    var $name;

}

class ValueType {

    var $key;
    var $alias;

}

$data = new Return_Obj();

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
$conn->set_charset("utf-8");

function getSensors($condition) {
    global $conn;
    global $data;
    if (empty($condition)) {
        $condition = "0=0";
    }
    $sql = "SELECT sensors.id, sensors.name, position_layer , position_id, type_1.unit as unit_1, type_1.name as name_1,  type_2.unit as unit_2, type_2.name as name_2,ip, msg FROM einbaum.sensors 
LEFT JOIN einbaum.sensor_types as type_1 ON  sensors.key_type_1=type_1.id 
LEFT JOIN einbaum.sensor_types as type_2 ON  sensors.key_type_2=type_2.id
WHERE $condition";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sensor = new Sensor_Data();
            $type_1 = new Data_Type();
            $type_1->name = $row["name_1"];
            $type_1->unit = $row["unit_1"];

            $type_2 = new Data_Type();
            $type_2->name = $row["name_2"];
            $type_2->unit = $row["unit_2"];

            $sensor->data_type_1 = $type_1;
            $sensor->data_type_2 = $type_2;
            $sensor->id = $row["id"];
            $sensor->name = $row["name"];
            $sensor->pos_layer = $row["position_layer"];
            $sensor->pos_id = $row["position_id"];
            $sensor->ip = $row["ip"];
            $sensor->msg = $row["msg"];
            $data->data[$sensor->id] = $sensor;
        }
    } else {
        log_js("No sensors found");
    }
}
