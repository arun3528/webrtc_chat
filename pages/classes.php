<?php
class user {
	private $UserId, $UserName, $UserMail, $userPassword, $SessionId;
	public function getUserId() {
		return $this->UserId;
	}
	public function setUserId($UserId) {
		$this->UserId = $UserId;
	}
	public function getUserName() {
		return $this->UserName;
	}
	public function setUserName($UserName) {
		$this->UserName = $UserName;
	}
	public function getUserMail() {
		return $this->UserMail;
	}
	public function setUserMail($UserMail) {
		$this->UserMail = $UserMail;
	}
	public function getUserPassword() {
		return $this->UserPassword;
	}
	public function setUserPassword($UserPassword) {
		$this->UserPassword = $UserPassword;
	}
	
	public function getSessionId() {
		return $this->SessionId;
	}
	
	public function setSessionId($SessionId) {
		$this->SessionId = $SessionId;
	}
	
	public function insertUser() {
		include 'conn.php';
		
		$req = $db->prepare ( "INSERT INTO users(UserId,UserMail,UserName,UserPassword) VALUES(:UserId,:UserMail,:UserName,:UserPassword)" );
		
		$req->execute ( array (
				'UserId' => $this->getUserId(),
				'UserName' => $this->getUserName(),
				'UserMail' => $this->getUserMail(),
				'UserPassword' => $this->getUserPassword()
		) );
	}
	public function UserLogin() {
		include 'conn.php';
		
		$req = $db->prepare ( "SELECT * FROM users WHERE UserMail =:UserMail AND UserPassword = :UserPassword" );
		
		$req->execute ( array (
				'UserMail' => $this->getUserMail (),
				'UserPassword' => $this->getUserPassword () 
		) );
		
		if ($req->rowCount () == 0) {
			header ( 'Location: ../index.php?error=1' );
			return false;
		} else {
			while ( $data = $req->fetch () ) {
				$this->setUserId ( $data ['UserId'] );
				$this->setUserName ( $data ['UserName'] );
				$this->setUserPassword ( $data ['UserPassword'] );
				$this->setUserMail ( $data ['UserMail'] );
				$this->setSessionId(session_id());
				
				$req = $db->prepare ( "UPDATE users SET SessionId = :SessionId WHERE UserId=:UserId" );
				
				$req->execute ( array (
						'UserId' => $this->getUserId(),
						'SessionId' => $this->getSessionId()
				) );
				
				header ( 'Location: ../pages/home1.php' );
				return true;
			}
		}
	}
}
class session {
	private $SessionId, $SessionDescription, $UserId, $target_sessionId;
	public function getSessionId() {
		return $this->SessionId;
	}
	public function setSessionId($SessionId) {
		$this->SessionId = $SessionId;
	}
	public function getSessionDescription() {
		return $this->$SessionDescription;
	}
	public function setSessionDescription($SessionDescription) {
		$this->SessionDescription = $SessionDescription;
	}
	public function getUserId() {
		return $this->UserId;
	}
	public function setUserId($UserId) {
		$this->UserId = $UserId;
	}
	public function getTargetSessionId() {
		return $this->$target_sessionId;
	}
	public function setTargetSessionId($target_sessionId) {
		$this->target_sessionId = $target_sessionId;
	}
	
	public function insertSessionData() {
			include "conn.php";

			$req=$db->prepare("INSERT INTO session(sessionId,userId,sessionDescription,targetSessionId) VALUES(:sessionId,:userId,:sessionDescription,:targetSessionId)");
		    
			
			$req->execute(array(
				"sessionDescription"=>$this->getSessionDescription(),
				"sessionId"=>$this->getSessionId(),
				"targetSessionId"=>$this->getTargetSessionId(),
				"userId"=>$this->getUserId()
				));
	}
		
	public function DisplayMessage() {
		    include 'conn.php';
		    $ChatReq=$db->prepare('SELECT * FROM chats ORDER BY ChatId DESC');
		    $ChatReq->execute();
		    
		    while ($DataChat = $ChatReq->fetch()) {
		       $UserReq=$db->prepare("SELECT * FROM users WHERE UserId=:UserId");
		       $UserReq->execute(array(
		       		'UserId'=>$DataChat['ChatUserId']
              ));
		       $DataUser = $UserReq->fetch();
		       ?>
		       <span class="UserName"><?php echo $DataUser['UserName']; ?></span> Says: </br>
		       <span class="ChatMessage"><?php echo $DataChat['ChatText']; ?></span></br>
		       <?php
		    }
		}
}
?>