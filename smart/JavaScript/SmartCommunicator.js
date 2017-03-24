var isWriting = false;
var ledFileName = "LedFile.txt";
var sensorFileName = "SensorFile.txt";
var ledHandle = [];
var ledNumber = 5;
var sensorHandle = [];
var ledRealVals = [];
var ledListTemplate = '<li><div>{{name}}<div id="{{handle}}">-</div> </div><div><button id="{{buttonName}}" onclick="changeOut({{number}})">Schalte Um</button></div></li>';
var sensorListTemplate = '<li><div>{{name}}<div id="{{handle}}">-</div> </div></li>';
function changeOut(i) {
    //isWriting = true;

    ledHandle[i].status = !ledHandle[i].status;
    var text = "";
    if (ledHandle[i].status) {
        text = "1";
    } else {
        text = "0";
    }
    $.post("./php/SetLed.php", { status: text, id: i+1}, function (result) {
        document.getElementById("debug").innerHTML = "Sent:" + result;
    });
    loadValues();
    //write();
}
function showDB() {
    $.post("./php/GetTable.php", {}, function (result) {
        document.getElementById("debug").innerHTML = "Sent:" + result;
    });
}
function loadValues() {
    for (var i = 0; i < ledHandle.length; i++) {
        var out = "";
        if (!ledHandle[i].status) {
            out = "grey";
        } else {
            out = "yellow";
        }
        $('#' + ledHandle[i].handle).css('background-color', out);
        //document.getElementById().innerHTML = out;

    }
    for (var i = 0; i < sensorHandle.length; i++) {
        var out = sensorHandle[i].status + sensorHandle[i].unit;

        document.getElementById(sensorHandle[i].handle).innerHTML = out;

    }
}
function read(isOverwrite) {

    $.post("./php/GetLed.php", {}, function (result) {
       
            document.getElementById("debug").innerHTML ="Data: " + result;
            var arr = result.split("\n");

            for (i = 0; i < arr.length; i++) {
                var parts = arr[i].split(";");
                l: for (var j = 0; j < ledHandle.length; j++) {
                    var n = j + 1;
                    if (parts[0] == "led"+n) {
                        if (parts[1].charAt(0) == '1') {
                            ledHandle[j].status = true;

                        } else {
                            ledHandle[j].status = false;

                        }
                        //document.getElementById("debug").innerHTML = "Found and set to" + ledHandle[j].status + "at" + ledHandle[j].handle + "!";
                        break l;
                    }
                }


            }
            loadValues();
        
    });


    $.post("./php/GetSensors.php", {}, function (result) {

        document.getElementById("debug").innerHTML = "Data: " + result;
        var arr = result.split("\n");

        for (i = 0; i < arr.length; i++) {

            var parts = arr[i].split(";");
            l: for (var j = 0; j < sensorHandle.length; j++) {
                if (parts[0] == sensorHandle[j].handle) {
                    sensorHandle[j].status = parseFloat(parts[1]);

                }
            }

        }
        loadValues();

    });

}
function write() {
    /*var text = "";
    for (var i = 0; i < ledHandle.length; i++) {
        text = text.concat(ledHandle[i].handle + ";");
        if (ledHandle[i].status) {
            text = text.concat("1");
        } else {
            text = text.concat("0");
        }
        text = text.concat("\n");
    }
    document.getElementById("debug").innerHTML = "Sent:" + text;

    $.post("DataHandler.php", { msg: text, fileN: ledFileName }, function (result) {
        document.getElementById("debug").innerHTML = "Sent:" + result;
        isWriting = false;

        read(false);
        for (var i = 0; i < ledHandle.length; i++) {
            if (ledHandle[i].status != ledRealVals[i]) {
                ledHandle[i].status = ledRealVals[i];
                setTimeout(function () {
                    write();
                },100);
            }
        }
    });*/


}
function update() {
    read(false);
}
function refresh() {
    location.reload(true);
}
function buildLEDList(id) {
    var site = "";
    for (var i = 0; i < ledNumber; i++) {
        var val = {
            handle: ledHandle[i].handle,
            name: ledHandle[i].name,
            buttonName: "b" + i,
            number:i
        }
        $(id).append(Mustache.render(ledListTemplate, val));
        /*site = site.concat("<li>" +
            "<div>" +  +
            "<div id=" +  + ">-</div>" +
            "</div><button id=\"b" + i + "\" onclick=\"changeOut(" + i + ")\">Schalte Um</button></li>");*/
    }
    
    //document.getElementById(id).innerHTML = site;
}
function buildSensorList(id) {
    var sens = "";
    for (var i = 0; i < sensorHandle.length; i++) {
        var val = {
            handle: sensorHandle[i].handle,
            name: sensorHandle[i].name,
        }
        $(id).append(Mustache.render(sensorListTemplate, val));
        /*sens = sens.concat("<li>" +
            "<div>" + sensorHandle[i].name +
            "<div id=" + sensorHandle[i].handle + ">-</div>" +
            "</div></li>");*/
    }
    //document.getElementById(id).innerHTML = sens;
    
}
function createChanger(i) {
    return function () {
        changeOut(i);
        

    }
}
function setupButtons() {
    for (var i = 0; i < ledHandle.length; i++) {
        $('#' + ledHandle[i].handle).click(createChanger(i));
    }
}
function init(buildID) {
    document.getElementById("debug").innerHTML = "Loaded";
    for (var i = 0; i < ledNumber; i++) {
        ledHandle.push({ handle: "led" + i, status: false, name: "LED " + i });
        ledRealVals.push(false);
    }
    sensorHandle.push({ handle: "temp0", status: -1.0, name: "Temperatur 1", unit: "°C" });
    sensorHandle.push({ handle: "temp1", status: -1.0, name: "Temperatur 2", unit: "°C" });
    sensorHandle.push({ handle: "temp2", status: -1.0, name: "Temperatur 3", unit: "°C" });
    sensorHandle.push({ handle: "temp3", status: -1.0, name: "Temperatur 4", unit: "°C" });
    sensorHandle.push({ handle: "moist0", status: -1.0, name: "Feuchtigkeit 1", unit: "%" });
    var site = "";
    var ledId="led";
    var sensId = "sens";
    var t = ('<h2>Lichter</h2><ul id="{{led}}"></ul>    <h2>Sensoren</h2>    <ul id="{{sens}}"></ul>');
    var val = { led: ledId, sens: sensId };
    //var html = Mustache.render(t, val);
    read(true);
   // $(buildID).html(html);
    
    //document.getElementById(buildID).innerHTML = site;
    //buildLEDList('#' + ledId);
    setupButtons();
    //buildSensorList('#' + sensId);
    
}
window.setInterval(update, 1000);
window.setInterval(refresh, 120000);
//        <!--<li>
//            <div id="led0name">
//                LED 0:
//                <div id="led0">-</div>
//            </div>
//            <button id="b0" onclick="changeOut(0)">Change Value</button> <!-- <textarea
//    rows="1" cols="1" id="text0"></textarea>
//</li>
//<li>
//    <div id="led1name">
//        LED 1:
//                <div id="led1">-</div>
//            </div>
//            <button id="b1" onclick="changeOut(1)">Change Value</button>
//        </li>
//        <li>
//            <div>
//                Temperatur (°C):
//                <div id="temp0" />
//            </div>

//        </li>-->

