/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var value_types={};
function build_site() {
    $.get("../Get_Sensors.php", {}, function (data) {
        var data_parsed = JSON.parse(data);
        value_types = data_parsed.value_types;
        var sensors = data_parsed.data;
        var html_options = "";
        for (i = 0; i < value_types.length; i++) {
            value_types[i].alias = value_types[i].alias.replace("{1}", sensors[0].data_type_1.name);
            value_types[i].alias = value_types[i].alias.replace("{2}", sensors[0].data_type_2.name);

            html_options = html_options.concat("<label>" + value_types[i].alias + "<input type=\"radio\" class=\"rdb rdb_val\" id=\"rdb_" + i + "\" name=\"rdb\" value=\""+i+"\"></label>");
        }
        $("#download_types").html(html_options);
        $(".rdb").checkboxradio();
        
        console.log("Sensors:");
        console.log(data_parsed);
        var sensors = data_parsed.data;
        for (var i = 0; i < sensors.length; i++) {
            var html = "<div class='sensor_name'>" + sensors[i].name + " <span class='sensor_download' id='sensor_link_" + sensors[i].id + "'>Download</span> IP:" + sensors[i].ip + "</div>";
            $("#download_box").append(html);
            $("#sensor_link_" + sensors[i].id).on("click", get_click_funct(sensors[i].id));
        }
    });
}
function convert(int) {
    return int.toLocaleString().replace(".", ",");
}
function data_download(id) {
    console.log(id);
    var active_types = [];
    for (var i = 0; i < value_types.length; i++) {
        var ele = $("#rdb_" + i)
        var onoff = ele.is(':checked');
        if (onoff)
            active_types.push(value_types[i].key);
    }
    if(active_types.length==0){
        active_types=[0];
    }
    $.get("../Get_Sensor_Values.php", {age: "ALL", ids_to_load: id, value_types: active_types}, function (data) {
        var data_parsed = JSON.parse(data);
        console.log("Sensors:");
        console.log(data_parsed);
        var sensor = data_parsed.data[0];
        var data = "time;" + sensor.data_type_1.name + ";" + sensor.data_type_2.name + ";";
        for (var i = 0; i < sensor.data_values.length; i++) {
            data = data.concat("\n" + sensor.data_values[i].measured_on + ";" + convert(sensor.data_values[i].value_1) + ";" + convert(sensor.data_values[i].value_2));
        }
        // Set file name.
        fileName = "Sensor_" + sensor.name + "_" + sensor.pos_layer + "_" + sensor.pos_id + " " + new Date().toLocaleString() + ".csv";

        // Set data on blob.
        blob = new Blob([data], {type: "text/csv"});

        // Set view.
        if (blob) {
            // Read blob.
            url = window.URL.createObjectURL(blob);

            // Create link.
            a = document.createElement("a");
            // Set link on DOM.
            document.body.appendChild(a);
            // Set link's visibility.
            a.style = "display: none";
            // Set href on link.
            a.href = url;
            // Set file name on link.
            a.download = fileName;

            // Trigger click of link.
            a.click();

            // Clear.
            window.URL.revokeObjectURL(url);
        }
    });
}
function get_click_funct(id) {
    return function (event) {
        data_download(id);
    }
}

