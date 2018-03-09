var express = require('express');
var router = express.Router();
var convert = require('xml-js');
var http = require("http");

/* GET users listing. */
router.get('/', function(req, res, next) {
  var datas = "";
  var httpUrls = {
    host: 'resource.data.one.gov.hk',
    path: '/td/journeytime.xml'
  };
  http.get(httpUrls, function(resxml) {
    resxml.on('data', function (chunk) {
      datas += chunk;
    });
    resxml.on('end',function(){
      var options = {compact: true, ignoreAttributes: true, ignoreComment: true, ignoreDeclaration:true};
      var result = convert.xml2js(datas, options); 
      var captureD = result.jtis_journey_list.jtis_journey_time[0].CAPTURE_DATE._text;
      var jtObj = {
        "CAPTURE_DATE" : captureD,
        "Journey_List" : []
      };
      for(i = 0 ; i < result.jtis_journey_list.jtis_journey_time.length ; i++){
        jtObj.Journey_List.push({
          "LOCATION_ID" : result.jtis_journey_list.jtis_journey_time[i].LOCATION_ID._text,
          "DESTINATION_ID" : result.jtis_journey_list.jtis_journey_time[i].DESTINATION_ID._text,
          "JOURNEY_TYPE" : result.jtis_journey_list.jtis_journey_time[i].JOURNEY_TYPE._text,
          "JOURNEY_DATA" : result.jtis_journey_list.jtis_journey_time[i].JOURNEY_DATA._text,
          "COLOUR_ID" : result.jtis_journey_list.jtis_journey_time[i].COLOUR_ID._text,
          "JOURNEY_DESC" : result.jtis_journey_list.jtis_journey_time[i].JOURNEY_DESC._text
        });
      }
      res.send("<h1>Length: " + result.jtis_journey_list.jtis_journey_time.length + " </h1><br><pre>"+JSON.stringify(jtObj,null,4)+"</pre>");
    })
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
});

module.exports = router;
