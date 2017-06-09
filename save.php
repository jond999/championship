<?php
	$data = $_POST['data'];
		
	$file = "data.json";

	if(!file_exists($file))
	{
		$mode = 'x+';
		
		$filePointerResource = fopen($file, $mode);
		if(!$filePointerResource)
		{
			print("File pointer resource wasn't binded to the stream.");

			return;
		}
	}	
	
	$mode = 'w';
	
	$filePointerResource = fopen($file, $mode);

	if(!$filePointerResource)
	{
		return;
	}
	
	$fileWritten = fwrite($filePointerResource, $data);

	if(!$fileWritten)
	{
		print("File \"" . $file . "\" wasn't written.<br>");

		return;
	}

	// echo $data;
?>