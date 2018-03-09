var po = org.polymaps;

var color = pv.Scale.linear()
    .domain(0, 25, 33, 50)
    .range("#F00", "#930", "#FC0", "#3B0");

/*
var color = pv.Scale.linear()
    .domain("TRAFFIC BAD", "TRAFFIC AVERAGE", "TRAFFIC GOOD")
    .range("#F00", "#FC0", "#3B0");
*/
var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 22.28, lon: 114.15})
    .zoom(13)
    .zoomRange([12, 16])
    .add(po.interact());

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/999/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

map.add(po.geoJson()
    .url("streets2.json")
    .id("streets")
    .zoom(12)
    .tile(false)
  .on("load", po.stylist()
    .attr("stroke", function(d) { return color(d.properties.TRAFFIC_SPEED).color; })
    .title(function(d) { return d.properties.ROAD_SATURATION_LEVEL + ": " + d.properties.TRAFFIC_SPEED + " km/h"; })));

map.add(po.compass()
    .pan("none"));
