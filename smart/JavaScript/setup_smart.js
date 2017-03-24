var ledNumber=5;
var gAPIkey="AIzaSyDTXAWAUK6wgApgxZaF0AXeVwMSKMSAwnc";
var planetAPIkey="Basic " + btoa("93170799cf0d4e28a7b406628803c98c" + ":");
var setPoint="no";
var setAddr="no";
function createDB() {
    $.post("../php/CreateDB.php", {ledNumber:ledNumber}, function (result) {
        document.getElementById("debug").innerHTML = "Sent:" + result;
    });
}
function showDB() {
    $.post("../php/GetTable.php", {}, function (result) {
        document.getElementById("db").innerHTML = result;
    });
}
function searchPos(){
	var pos=$("#position").val();
	//alert(pos);
	var geocoder = new google.maps.Geocoder();
	
    geocoder.geocode( { 'address': pos}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var coo=results[0].geometry.location;
        setSatImage("sat","POINT ("+coo.lng()+" "+coo.lat()+")");
        setAddr=pos;
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}
function setSatImage(id) {
	setSatImage(id, "POINT(-116.3672 40.7140)")
}
function setSatImage(id,point) {
	setPoint=point;
    //alert(point);
    var inter = point;
    var params = {
        order_by: 'acquired desc',
        count: 10,
        intersects: inter
    };
    $.ajax({
        url: "https://api.planet.com/v0/scenes/ortho/",
        data: params,
        headers: {
            "Authorization": planetAPIkey
        },
        success: function (data) {
        	//alert(JSON.stringify(data,null,4))
            //var obj=;
            //var src = data.features.links.self;
        	 $("#" + id).html("<h3>Results</h3>");
            for (var i = 0; i < data.features.length; i++) {

               $("#" + id).append(" <a href="+data.features[i].properties.links.full+"> <img src=" + data.features[i].properties.links.thumbnail + " width=100 height=100  /></a>");
            }
            if(data.features.length==0){
            	 $("#" + id).append("<div>No results aviable (yet?) for "+point+"</div>")
            }
            //$("#" + id).append(" <div id=\"collapsible\"><h2>test:</h2><div>" + obj+"</div></div>");
            //$("#collapsible").accordion();
        },
    });
    //
   
}
function setupLoc(){
	if(setPoint!="no"){
		$.post("../php/SetLoc.php", {loc:setPoint,addr:setAddr}, function (result) {
	        document.getElementById("debug").innerHTML = result;
	    });
	}
    
}