<?php
      session_start();
      echo session_id();
?>
<!DOCTYPE html>
<head>
	<link rel="stylesheet" type="text/css" href="../style/style.css">
	<title>Chat Application Home</title>
	<script type="text/javascript" src="../js/jquery.min.js"></script>
	<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
	<script type="text/javascript">
		$(document).ready(function () {
		var myDataRef = new Firebase('https://w53ai3jyf3p.firebaseio-demo.com/');
    });
	</script>
</head>
<body>
	<h2>Welcome <span style="color:green"><?php  echo $_SESSION['userName']; ?></span></h2>
	<h2>Session Id <span><?php echo $_SESSION['user-key'];?></span></h2>
</br></br>

<div id="ChatBig">
	<div id="ChatMessages">
		</div>
	<textarea id="ChatText" name="ChatText"></textarea>
</div>
</body>
</html>