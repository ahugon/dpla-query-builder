<?
	$url_base = "http://api.dp.la/dev/items?page_size=" . $_POST["res"] . "&page=" . $_POST["page"] . "&";
	
	$url_fields = "";
	$url_dates = "";
	$url_location = "";
	$url_sortby = "";
	
	// split around "|" characters to unwrap what we did in custom.js
	$fields = explode("|", $_POST["fields"]);
	$field_values = explode("|", $_POST["field_values"]);
	$temporal = explode("|", $_POST["temporal"]);
	$dates = explode("|", $_POST["dates"]);
	$location = $_POST["location"];
	$sortby = $_POST["sortby"];
	
	// url-encode fields
	for($i = 0; $i < count($fields); $i++)
	{
		$fields[$i] = rawurlencode($fields[$i]);
		$field_values[$i] = rawurlencode($field_values[$i]);
		if($fields[$i] == "" || $field_values[$i] == "")
		{
			continue;
		}
		$url_fields .= "aggregatedCHO." . $fields[$i] . "=" . $field_values[$i] . "&";
	}
	
	// url-encode dates
	for($j = 0; $j < count($temporal); $j++)
	{
		$temporal[$j] = rawurlencode($temporal[$j]);
		$dates[$j] = rawurlencode($dates[$j]);
		if($temporal[$j] == "" || $dates[$j] == "")
		{
			continue;
		}
		$url_dates .= "aggregatedCHO.date." . $temporal[$j] . "=" . $dates[$j] . "&";
	}
	
	// url-encode location
	if($location != "")
	{
		$location = rawurlencode($location);
		$url_location .= "aggregatedCHO.spatial=" . $location . "&";
	}
	
	// url-encode sortby clause
	if($sortby != "")
	{
		$sortby = rawurlencode($sortby);
		$url_sortby .= "sort_by=aggregatedCHO." . $sortby . "&";
	}
	
	// stitch together the parts of the encoded URL to create the API request
	$url_full = $url_base . $url_fields . $url_dates . $url_location . $url_sortby;
	
	// perform the API request and catch the result
	$json_response = file_get_contents($url_full,0,null,null);
	
	// encode the result of the API call back to our waiting handler in custom.js 
	$array = array();
	$array["query"] = $url_full;
	$array["results"] = $json_response;
	echo(json_encode($array));

?>