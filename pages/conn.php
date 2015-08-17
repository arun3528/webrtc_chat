<?php
			try {
				$db = new PDO("mysql:host=localhost;dbname=webrtc","root","");
			} catch(Exception $e) {
				die("Error : ".$e->getMessage());
			}

?>