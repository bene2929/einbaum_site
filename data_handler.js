/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var def_timeForm = d3.timeFormat("%e.%_m. %H:%M");
var def_numForm = d3.format(".3f");
var value_types = [];
function build_site() {
    $.get("Get_Sensors.php", {}, function (data) {
        var sensors = JSON.parse(data);
        value_types = sensors.value_types;

        console.log("Sensors:");
        console.log(sensors);
        var html_graph = "<br/><select class=\"sel sel_id\" id=\"id_sel\"> ";
        var html_val_options = "<div id=\"select_val\">"
        var html_end = "</select> <select class=\"sel sel_age\" id=\"age_sel\"><option value=\"D\">Day</option><option value=\"W\">Week</option><option value=\"M\">Month</option></select></br>";
        for (var i = 0; i < sensors.data.length; i++) {
            html_graph = html_graph.concat("<option value=\"" + sensors.data[i].id + "\">" + sensors.data[i].name + "</option>");
        }
        html_graph = html_graph.concat(html_end);
        html_graph = html_graph.concat(html_val_options);
        for (i = 0; i < value_types.length; i++) {
            value_types[i].alias = value_types[i].alias.replace("{1}", sensors.data[0].data_type_1.name);
            value_types[i].alias = value_types[i].alias.replace("{2}", sensors.data[0].data_type_2.name);
            if ( value_types[i].key!=0)
                html_graph = html_graph.concat("<label>" + value_types[i].alias + "<input type=\"checkbox\" class=\"chckbx chckbx_val\" id=\"chck_" + i + "\" name=\"chck_" + i + "\"></label>");
        }
        html_graph = html_graph.concat("</div><br/>");
        $(".graph").append(html_graph);
        $(".sel").selectmenu();
        $(".chckbx").checkboxradio();
        $("#chck_0").prop('checked', true);
        $("#chck_0").button("refresh");
        $(document.body).on("change", ".chckbx_val", function (event) {
            var parent = $(event.target).parents(".graph");
            load_fromparent(parent)
        });
        $(document.body).on('selectmenuchange', '#id_sel', function (event) {
            var parent = $(event.target).parent(".graph");
            load_fromparent(parent)
        });
        $(document.body).on('selectmenuchange', '#age_sel', function (event) {
            var parent = $(event.target).parent(".graph");
            load_fromparent(parent);
        });
        $(".graph").each(function (index, e) {
            this.id = "gr_" + index;
            var graph_wrapper = d3.select("#" + this.id);
            graph_wrapper.append("svg")
                    .attr("width", "100%")
                    .attr("height", "90%")
                    .attr("id", this.id + "_svg");
            refresh_id(this.id);
        });
    });
}
function load_fromparent(parent) {

    var selector = parent
            .get(0)
            .id;
    var expires = new Date().setYear(new Date().getYear() + 10);
    var sens_id = parent.children("#id_sel").val();
    var max_age = parent.children("#age_sel").val();
    document.cookie = selector + "/sensor=" + sens_id + ";expires=" + expires + ";path=/";
    console.log(selector + "~sensor changed to:" + sens_id);
    document.cookie = selector + "/age=" + max_age + ";expires=" + expires + ";path=/";
    console.log(selector + "~date changed to:" + max_age);
    var active_types = [];
    for (var i = 0; i < value_types.length; i++) {
        var ele = $("#" + selector).find("#chck_" + i)
        var onoff = ele.is(':checked');
        document.cookie = selector + "/chck_" + i + "=" + onoff + ";expires=" + expires + ";path=/";
        if (onoff)
            active_types.push(value_types[i].key);
    }
    load(sens_id, max_age, active_types, selector + "_svg");
}
function delete_setup() {
    document.cookie = "";
}
function read() {
    build_site();
    var params = {};
}
function refresh_id(gr_id) {
    var cookie_parts = document.cookie.split(";");
    var id = getCookieVal(cookie_parts, gr_id + "/sensor");
    var time = getCookieVal(cookie_parts, gr_id + "/age");
    for (var i = 0; i < value_types.length; i++) {
        var onoff = getCookieVal(cookie_parts, gr_id + "/chck_" + i);
        $(gr_id).find("#chck_" + i).prop('checked', onoff);
        $(gr_id).find("#chck_" + i).checkboxradio("refresh");
    }
    if (id == null) {
        id = 1;
    }
    if (time == null) {
        time = 'D';
    }
    gr_id = "#" + gr_id;
    $(gr_id + " > #id_sel").val(id + "");
    $(gr_id + " > #id_sel").selectmenu("refresh");
    $(gr_id + " > #age_sel").val(time + "");
    $(gr_id + " > #age_sel").selectmenu("refresh").trigger("selectmenuchange");
}
function getCookieVal(cookies, id) {
    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=", 2);
        parts[0] = parts[0].trim();
        if (parts[0] == id) {
            return parts[1];
        }
    }
    return null;
}
function draw(sensor, svg_id, timespan) {
    var svg = d3.select("#" + svg_id);
    svg.selectAll("*").remove();
    var height = $("#" + svg_id).height();
    var pad_left = 20;
    var pad_right = 20;
    var pad_bot = 50;
    var pad_top = 20;
    var width = $("#" + svg_id).width();
    var age_min = -1;
    var age_hours = -1;
    var last_response = new Date().setTime(0);
    if (sensor.data_values.length > 0) {

        var spacer = width / 200;
        var last_response = new Date().setYear(new Date().getYear() - 10);
        for (var i = 0; i < sensor.data_values.length; i++) {
            sensor.data_values[i].measured_on = new Date(new Date(Date.parse(sensor.data_values[i].measured_on.toString() + " GMT+0100")));
            if (sensor.data_values[i].measured_on > last_response) {
                last_response = sensor.data_values[i].measured_on;
            }
            sensor.data_values[i].value_1 = parseFloat(sensor.data_values[i].value_1);
            sensor.data_values[i].value_2 = parseFloat(sensor.data_values[i].value_2);
        }
        age_min = Math.floor((new Date() - last_response) / 60000);
        age_hours = Math.floor(age_min / 60);
        age_min = age_min % 60;
        // $("#sensor_info").html("Der ausgew&aumlhlte Sensor ist in der folgenden Lage eingebaut: " + sensor.pos_layer + " mit ID " + sensor.pos_id + ", allgemeine ID " + sensor.id + ", letzte Meldung: " + last_response.toLocaleString() + " (vor " + age_hours + "h " + age_min + " min)");
        var yAxis_1_scale = d3.scaleLinear().domain([0, d3.max(sensor.data_values, function (d) {
                return parseFloat(d.value_1);
            })]).range([height - pad_top - pad_bot, pad_bot]);
        var yAxis_1 = d3.axisLeft().scale(yAxis_1_scale).ticks(7);
        svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + pad_left + ",0)")
                .call(yAxis_1);
        var yAxis_2_scale = d3.scaleLinear().domain([0, d3.max(sensor.data_values, function (d) {
                return parseFloat(d.value_2);
            })]).range([height - pad_top - pad_bot, pad_bot]);
        var yAxis_2 = d3.axisRight().scale(yAxis_2_scale).ticks(7);
        svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (width - pad_left - pad_right) + ",0)")
                .call(yAxis_2);
        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", (width - pad_right - 3 - pad_left))
                .attr("x", (-pad_top))
                .style("text-anchor", "end")
                .attr("class", "label")
                .attr("id", "m_label")
                .text(sensor.data_type_2.name + " (" + sensor.data_type_2.unit + ")");
        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", (pad_left + 12))
                .attr("x", (-pad_top))
                .style("text-anchor", "end")
                .attr("class", "label")
                .attr("id", "t_label")
                .text(sensor.data_type_1.name + " (" + sensor.data_type_1.unit + ")");
        var xAxisScale = d3.scaleTime().domain([d3.min(sensor.data_values, function (d) {
                return d.measured_on;
            }), d3.max(sensor.data_values, function (d) {
                return d.measured_on;
            })]).range([pad_left, width - pad_left - pad_right]);
        var xAxis = d3.axisBottom().scale(xAxisScale).ticks(5).tickFormat(def_timeForm);
        svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (height - pad_bot - pad_top) + ")")
                .call(xAxis);
        var line = d3.line()
                .x(function (d) {
                    return xAxisScale(d.measured_on);
                })
                .y(function (d) {
                    return yAxis_1_scale(d.value_1);
                });
        svg.append("path")
                .datum(sensor.data_values)
                .attr("class", "temp_line")
                .attr("d", line);
        line.y(function (d) {
            return yAxis_2_scale(d.value_2);
        });
        svg.append("path")
                .datum(sensor.data_values)
                .attr("class", "moist_line")
                .attr("d", line);
        svg.on("mousemove", function (d) {
            var nearest = null;
            var target = xAxisScale.invert(d3.mouse(this)[0]);
            var diff = Number.MAX_SAFE_INTEGER;
            svg.selectAll(".tooltip").remove();
            for (var i = 0; i < sensor.data_values.length; i++) {

                var new_diff = target.getTime() - sensor.data_values[i].measured_on.getTime();
                if (new_diff < 0) {
                    new_diff = new_diff * -1.0;
                }
                if ((new_diff < diff)) {
                    diff = new_diff;
                    nearest = sensor.data_values[i];
                }


            }
            var add = "";
            if (nearest.valuetype != 0) {
                add = ", " + value_types[nearest.valuetype].alias + "\n";
            }
            svg.append("text")
                    .attr("id", "tt_temp" + svg_id)
                    .text(def_numForm(nearest.value_1) + sensor.data_type_1.unit + add)
                    .attr("x", xAxisScale(nearest.measured_on))
                    .attr("y", yAxis_1_scale(nearest.value_1) - spacer)
                    .attr("class", "tt_temp tooltip");
            svg.append("text")
                    .attr("id", "tt_moist" + svg_id)
                    .text(def_numForm(nearest.value_2) + sensor.data_type_2.unit + add)
                    .attr("x", xAxisScale(nearest.measured_on))
                    .attr("y", yAxis_2_scale(nearest.value_2) - spacer)
                    .attr("class", "tt_moist tooltip");
        });
        svg.on("mouseout", function (d) {
            svg.selectAll(".tooltip").remove();
        });
    } else {
        svg.append("text").text("No data found!").attr("x", pad_left).attr("y", pad_top);
    }
    svg.append("text").text("Lage: "
            + sensor.pos_layer + " mit ID "
            + sensor.pos_id + ", allgemeine ID "
            + sensor.id + ", letzte Meldung: "
            + last_response.toLocaleString()
            + " (vor " + age_hours + "h " + age_min + " min), Nachricht:"
            + sensor.msg).attr("x", pad_left).attr("y", height - pad_bot / 2);
}
function load(id, timespan, types, svg_id) {
    console.log("loading " + id + " for h:" + timespan);
    $.get("Get_Sensor_Values.php", {age: timespan, ids_to_load: id, value_types: types}, function (all) {
        var all_data = JSON.parse(all);
        console.log(all_data);
        var sensors = all_data.data;
        if (sensors.length > 0) {
            draw(sensors[0], svg_id, timespan);
        } else {
            console.log("Error on loading sensor " + id + " with " + points_msg + " values!");
        }
    });
}

