var auth = "Basic " + btoa("93170799cf0d4e28a7b406628803c98c" + ":");
function setSatImage(id) {
    
    var intersects = "POINT(-116.3672 40.7140)";
    var params = {
        order_by: 'acquired desc',
        count: 10
    };
    $.ajax({
        url: "https://api.planet.com/v0/scenes/ortho/",
        data: params,
        headers: {
            "Authorization": auth
        },
        success: function (data) {
            var obj=JSON.stringify(data,null,4);
            //var src = data.features.links.self;
            for (var i = 0; i < data.features.length; i++) {

               $("#" + id).append("<img src=" + data.features[i].properties.links.thumbnail + " width=100 height=100 />");
            }
            
            $("#" + id).append(" <div id=\"collapsible\"><h2>test:</h2><div>" + obj+"</div></div>");
            $("#collapsible").accordion();
        },
    });
    //
   
}
function start() {
    setSatImage("sat");
}