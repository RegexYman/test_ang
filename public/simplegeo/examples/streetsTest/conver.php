<?php
$servername = "localhost";
$username = "root";
$pw = "";
$dbname = "fyp";
$con = mysqli_connect($servername,$username,$pw,$dbname);
if (!$con) {
  die('Could not connect: ' . mysqli_connect_error());
}

$json = array("type" => "FeatureCollection");

$data = array(
	"geometry" => array(
		"type" => "LineString"
	),
	"type" => "Feature"
);

$count = 0;

$sql = "SELECT * FROM tsm_data JOIN tsm_info ON tsm_data.LINK_ID = tsm_info.Link_ID;";
$result = mysqli_query($con,$sql);
if(mysqli_num_rows($result)>0){
	while ($row = mysqli_fetch_assoc($result)){
		$data['geometry']['coordinates'] = array(
			array(
				(float)$row['Start_Node_Eastings'],
				(float)$row['Start_Node_Northings']
			),
			array(
				(float)$row['End_Node_Eastings'],
				(float)$row['End_Node_Northings']
			)
		);
		$data['properties'] = array(
			"ROAD_SATURATION_LEVEL" => $row['ROAD_SATURATION_LEVEL'],
			"TRAFFIC_SPEED" => $row['TRAFFIC_SPEED']
		);
		$json['features'][$count] = $data;
		$count++;
	}
} else {
	echo "no result";
}
echo json_encode($json);
mysqli_close($con);
?>