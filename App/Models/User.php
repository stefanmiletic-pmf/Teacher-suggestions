<?php
namespace App\Models;

use PDO;
use \App\Token;
use \App\Mail;
use \App\Config;
use \App\Queries;
use \Core\View;
use \App\Pagination;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use \App\UploadImage;

/**
 * Example user model
 *
 * PHP version 7.0
 */
class User extends \Core\Model
{
	public static $defaultUsersPageSQL = "SELECT users.id, users.name, users.fullName, users.email, departments.name as department, profile_images.path as profile_image_path, users.is_active as status, users.cabinetName, UNIX_TIMESTAMP(users.createdAt) as createdAt FROM users LEFT JOIN departments ON users.department_id = departments.id LEFT JOIN profile_images ON profile_images.user_id = users.id INNER JOIN admins ON users.id != admins.user_id";
	
	
	public $errors = [];
	
	
    public function __construct($data = [])
    {
		foreach($data as $key => $value){
			$this->$key = $value;
		};
	}


    public function save()	{
		
		$this->validate();
		
		if (empty($this->errors)) {
			
			// bcrypt algorithm at the time of writing
			$password_hash = password_hash($this->password, PASSWORD_DEFAULT);
		
			$token = new Token();
			$hashed_token = $token->getHash();
			$this->activation_token = $token->getValue();
		
						
			$db = static::getDB();
			$db->beginTransaction();
			
				
				try {
					
						
					$sql = 'INSERT INTO users (name, fullName, email, password_hash, activation_hash, department_id, cabinetName)
					VALUES (:name, :fullName, :email, :password_hash, :activation_hash, :department_id, :cabinetName )';
						
						$stmt = $db->prepare($sql);
					
			
						$stmt->bindValue(':name', $this->name, PDO::PARAM_STR);
						$stmt->bindValue(':fullName', $this->fullName, PDO::PARAM_STR);
						$stmt->bindValue(':email', $this->email, PDO::PARAM_STR);
						$stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
						$stmt->bindValue(':activation_hash', $hashed_token, PDO::PARAM_STR);
						$stmt->bindValue(':department_id', $this->department_id, PDO::PARAM_INT);
						$stmt->bindValue(':cabinetName', $this->cabinetName, PDO::PARAM_STR);
			
					
						$stmt->execute();
						
						
						$lastIdSaved = $db->lastInsertId();
						$rowCount = $stmt->rowCount();
						
				
						
								#var_dump("uopste");
						if ( $rowCount !== 0 ) {
							$response = $this->uploadFile($db, $lastIdSaved);
							if ( $response['action'] ) {
								
								#var_dump("JESTE");
								
								$db->commit();
								return true;
								
							} else {
								
								
								#var_dump("nije");
								$db->rollback();
								
								$this->errors[] = $reponse['response'];
								return false;
							}
						}



						return $rowCount;
					  

				} catch (PDOException $e) {
					  $db->rollback();
					  
					  
					$this->errors[] = "Serverska greška: čuvanje korisnika [save][1].";
					  return false;
				}
				
				
				
			
			
			
		} 
		return false;
	}	
	
	protected function validate($ignorePassword=false) {
		
		if (!isset($this->name) || $this->name == ''){
			$this->errors[] = 'Nedostaje ime.';
		}
		
		if (!isset($this->fullName) || $this->fullName == ''){
			$this->errors[] = 'Nedostaje puno ime.';
		} else {
			if (strlen($this->fullName) < 6){
				$this->errors[] = 'Puno ime krace od 6 karaktera';
			}
		}
		
		
		
		
		if (filter_var($this->email, FILTER_VALIDATE_EMAIL) == false){
			$this->errors[] = 'Nevalidna adresa.';
		}
		
		if (static::emailExists($this->email, $this->id ?? null)){
			$this->errors[] = 'Zauzeta adresa.';
		}
		
		
		if (isset($this->password) ) {
			
			if (strlen($this->password) < 6){
				$this->errors[] = 'Sifra kraca od 6 karaktera';
			}
			
		} else if ( !$ignorePassword ) {
			$this->errors[] = 'Nedostaje sifra.';
		}
		
		
		if ( !isset($this->department_id )  ) {
			
			$this->errors[] = 'Nedostaje departman.';
		}
		
		if ( !isset($this->cabinetName )  ) {
			
			$this->errors[] = 'Nedostaje kabinet.';
		}
		
		$uploadFileResponse = UploadImage::validateImage();
		if ( !$uploadFileResponse['action'] ) {
			$this->errors[] = $uploadFileResponse['response'];
		}
		
		
		

	}
	
	
	
	public static function emailExists($email, $ignore_id = null) {
				
				
		$user = static::findByEmail($email);
		
		if($user) {
			
			if ( $user->id != $ignore_id) {
				return true;
			}
			
		}
		
		return false;
		
	}
	
	
	public static function findByEmail($email) {
		
			
			$sql = 'SELECT users.*, admins.user_id as admin_id, departments.name as department, profile_images.path as profile_image_path
			FROM users
			LEFT JOIN admins ON users.id = admins.user_id
			LEFT JOIN departments ON users.department_id = departments.id
			LEFT JOIN profile_images ON profile_images.user_id = users.id
			WHERE users.email= :email';
			
			$db = static::getDB();
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':email', $email, PDO::PARAM_STR);
			$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		
			$stmt->execute();



			return $stmt->fetch();

		
		
		
		
	}
	
	public static function findById($id) {
		
		
			$sql = 'SELECT users.*, admins.user_id as admin_id, departments.name as department, profile_images.path as profile_image_path
			FROM users
			LEFT JOIN admins ON users.id = admins.user_id
			LEFT JOIN departments ON users.department_id = departments.id
			LEFT JOIN profile_images ON profile_images.user_id = users.id
			WHERE users.id= :id';
			
			
			$db = static::getDB();
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':id', $id, PDO::PARAM_INT);
			$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		
			$stmt->execute();



			return $stmt->fetch();

		
		
		
		
	}
	public static function findByPasswordReset($token) {
		
		$token = new Token($token);
		$hashed_token = $token->getHash();
		
		
			
		$sql = 'SELECT * FROM users
		WHERE password_reset_hash = :token_hash';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':token_hash', $hashed_token, PDO::PARAM_STR);
	
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
	
		$stmt->execute();


		$user = $stmt->fetch();
		
		if ( $user ) {
	
	
			if ( strtotime($user->password_reset_expires_at) > time() ) {
				return $user;
			}
			
		} else 
			return false;

		
		
		
		
	}
	
	public static function countUsersFeedsWithFullName($fullName) {
		
		$totalRowsSql = 'SELECT COUNT(*) as total_rows
							FROM users
							WHERE users.fullName like :criteria';
		
		$db = static::getDB();
		$stmt = $db->prepare($totalRowsSql);
		
		$stmt->bindValue(':criteria', "$fullName%", PDO::PARAM_STR);
		
		
		$stmt->execute();
		$total_rows_obj = null;
		
		if ( $total_rows_obj  = $stmt->fetch(PDO::FETCH_OBJ ) )
			return $total_rows_obj->total_rows;
		else 
			return 0;
		
	}
	
	public static function findUsersByFullName(&$pagination, $fullName) {
		
			
		$limitOptions = Pagination::paginationCalc(static::countUsersFeedsWithFullName($fullName), $pagination);
		
		
		if ( $pagination->total_pages == 0 ) 
			return;
		
		
		
		$offset = $limitOptions["offset"];
		$limit = $limitOptions["limit"];
		
		
		$sql = "SELECT users.id, users.fullName, profile_images.path as profile_image_path
				FROM users
				LEFT JOIN profile_images ON users.id = profile_images.user_id
                WHERE users.fullName like :criteria
				LIMIT $offset,$limit";
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':criteria', "$fullName%", PDO::PARAM_STR);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		if ( $stmt->execute() ){
			
			$arr = [];
			while($userWith = $stmt->fetch()){
				$arr[] = $userWith;
			}
			return $arr;
		}
		else
			return false;
		
	}



	public static function authenticate($email, $password) {
		
		$user = static::findByEmail($email);
		
		
		if ($user && $user->is_active) {
			
			if(password_verify($password, $user->password_hash)) {
				return $user;
			}
			
		}
		
		return false;
		
	}
	
	
	public function rememberLogin() {
		
		
		$token = new Token();
		$hashed_token = $token->getHash();
		
		$this->remember_token = $token->getValue();
		
		$this->expiry_timestamp = time() + 60 * 60 *  24 *30; // 30 dana
		
		
		$db = static::getDB();
		$db->beginTransaction();
		
		try {
			
				
				$sql = 'INSERT INTO remembered_logins (token_hash, user_id, expires_at) VALUES (:token_hash, :user_id, :expires_at)';
				
				$stmt = $db->prepare($sql);
				
				$stmt->bindValue(':token_hash', $hashed_token, PDO::PARAM_STR);
				$stmt->bindValue(':user_id', $this->id, PDO::PARAM_INT);
				$stmt->bindValue(':expires_at', date('Y-m-d H:i:s', $this->expiry_timestamp), PDO::PARAM_STR);
					
			
				$stmt->execute();

			  $db->commit();

			  return true;

		} catch (PDOException $e) {
			  $db->rollback();
			  return false;
		}
		
		
		
	}

	
	
	public static function sendPasswordReset($email) {
		
		$user = static::findByEmail($email);
		if($user) {
			if($user->startPasswordReset()) {
				$user->sendPasswordResetEmail();
			}
		}
		
	}
	public function startPasswordReset() {
		
		$token = new Token();
		$hashed_token = $token->getHash();
		$this->password_reset_token = $token->getValue();
		
		$expiry_timestamp = time() + 60 * 60 * 2; // 2 sata 
		
		$db = static::getDB();
		$db->beginTransaction();
		
		try {
			
				$sql = 'UPDATE users
				SET password_reset_hash = :token_hash,
					password_reset_expires_at = :expires_at
				WHERE id = :id';
				
				$stmt = $db->prepare($sql);
				
		
				$stmt->bindValue(':token_hash', $hashed_token, PDO::PARAM_STR);
				$stmt->bindValue(':expires_at', date('Y-m-d H:i:s', $expiry_timestamp), PDO::PARAM_STR);
				$stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
			
			
				$stmt->execute();

			  $db->commit();

			  return true;

		} catch (PDOException $e) {
			  $db->rollback();
			  return false;
		}
		
		
		
	}
	protected function sendPasswordResetEmail() {
		$url = "http://" . $_SERVER['HTTP_HOST'] . '/password/reset/' . $this->password_reset_token;
		
	
		
		if ( \App\Config::SEND_MAIL ){
			$text = View::getTemplate('Password/reset_email.txt', ['url' => $url]);
			$html = View::getTemplate('Password/reset_email.html', ['url' => $url]);
			
			Mail::send($this->email, "Promena sifre.", $text, $html);
		
		
		}
	}
	
	
	
	public function sendActivationEmail() {
		$url = "http://" . $_SERVER['HTTP_HOST'] . '/signup/activate/' . $this->activation_token;
		
		
		if ( \App\Config::SEND_MAIL ){
			
	
			$text = View::getTemplate('Signup/activation_email.txt', ['url' => $url]);
			$html = View::getTemplate('Signup/activation_email.html', ['url' => $url]);
			Mail::send($this->email, "Aktivacija.", $text, $html);
			
		}
		
	}
	public static function activate($value) {
		
		$token = new Token($value);
		$hashed_token = $token->getHash();
		
				
		$db = static::getDB();
		$db->beginTransaction();
		
		try {
			
				$sql = 'UPDATE users
				SET is_active = 1,
					activation_hash = null
				WHERE activation_hash = :hashed_token';
				
				$stmt = $db->prepare($sql);
			
				$stmt->bindValue(':hashed_token', $hashed_token, PDO::PARAM_STR);
			
				$stmt->execute();

			  $db->commit();

			  return $stmt->rowCount();

		} catch (PDOException $e) {
			  $db->rollback();
			  return false;
		}
		
		
		
		
	}
	

	
	
	public function resetPassword($password) {
		
		$this->password = $password;
		$this->validate();
		
		
		if (empty($this->errors)) {
			
            $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
			
			$db = static::getDB();
			$db->beginTransaction();
			
			try {
				
					$sql = 'UPDATE users
                    SET password_hash = :password_hash,
                        password_reset_hash = NULL,
                        password_reset_expires_at = NULL
                    WHERE id = :id';
					
					$stmt = $db->prepare($sql);
					$stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
					$stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
						
				
					$stmt->execute();

				  $db->commit();

				  return $stmt->rowCount();

			} catch (PDOException $e) {
				  $db->rollback();
				  return false;
			}
		} else 
			return false;
		
		
	}
	
	
	
	

	
	public function updateProfile() {
		
		$oldImagePath = $this->profile_image_path;
		
		
		#//var_dump($this);
		$this->name = $_POST['name'];
		$this->fullName = $_POST['fullName'];
        $this->email = $_POST['email'];

        if ($_POST['password'] != '') {
            $this->password = $_POST['password'];
        }
		
		
        $this->department_id = $_POST['department_id'];
        $this->cabinetName = $_POST['cabinetName'];

        $this->validate(true);

		
		
        if (empty($this->errors)) {
			
			$db = static::getDB();
			$db->beginTransaction();
			
			try {
				
					$sql = 'UPDATE users
                    SET name = :name,
						fullName = :fullName,
                        email = :email,
						department_id = :department_id,
						cabinetName = :cabinetName';
						
						
					 if (isset($this->password)) {
						$sql .= ', password_hash = :password_hash';
					}

					$sql .= " WHERE id = :id";
					
					
					$stmt = $db->prepare($sql);
					
					
					$stmt->bindValue(':name', $this->name, PDO::PARAM_STR);
					$stmt->bindValue(':fullName', $this->fullName, PDO::PARAM_STR);
					$stmt->bindValue(':email', $this->email, PDO::PARAM_STR);
					$stmt->bindValue(':department_id', $this->department_id, PDO::PARAM_INT);
					$stmt->bindValue(':cabinetName', $this->cabinetName, PDO::PARAM_STR);
					$stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
				
					if (isset($this->password)) {
						$password_hash = password_hash($this->password, PASSWORD_DEFAULT);
						$stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
					}
				
					$stmt->execute();
					
					$response = $this->changePicture($db, $this->id, $oldImagePath);
					if ( $response['action'] ) {
						
						$db->commit();
						return true;
						
					}
					
					
					
					$db->rollback();
					$this->errors[] = $response['response'];
					return false;



			} catch (PDOException $e) {
				  $db->rollback();
				  return false;
			}
			
			
			
			
		} else 
			return false;
		
		
		
		
		
	}
	
	
	public function isAdmin() {
		return $this->admin_id ? true : false;
	}
	
	

	
	// protected static function countUserRows() {
		
		// $totalRowsSql = 'SELECT COUNT(*) as total_rows
				// FROM users
                // INNER JOIN admins ON users.id != admins.user_id';
		
		// $db = static::getDB();
		
		// $stmt = $db->prepare($totalRowsSql);
		
		// $stmt->execute();
		// $total_rows_obj = null;
		
		// if ( $total_rows_obj  = $stmt->fetch(PDO::FETCH_OBJ ) )
			// return $total_rows_obj->total_rows;
		// else 
			// return 0;
		
	// }


	public static function countUserRowswithParams() {
		
		$sql = 'SELECT COUNT(*) as total_rows
				FROM users
                INNER JOIN admins ON users.id != admins.user_id ';
		
		$extraSql = array();
		
		foreach ($_GET as $key => $value) {
			if ( isset(Queries::$whereCallbacks[$key]) ) {
				call_user_func_array(Queries::$whereCallbacks[$key], [&$extraSql]);
			}
		}
		
		Queries::addWhereClause($sql, $extraSql);
	
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		
		
		Queries::bindValues($extraSql, $stmt);
		
		
		$stmt->execute();
		$total_rows_obj = null;
		
		if ( $total_rows_obj  = $stmt->fetch(PDO::FETCH_OBJ ) )
			return $total_rows_obj->total_rows;
		else 
			return 0;
		
	}
	


	
	#
	public function findUsersPage(&$pagination) {
		
		$_SESSION['LAST_PARAMS'] = [];
		$_SESSION['LAST_SQL'] = "";
		
		$limitOptions = Pagination::paginationCalc(static::countUserRowswithParams(), $pagination);
		
		if ( $pagination->total_pages == 0 ) {
			return;
			
		}
		
		
		$offset = $limitOptions["offset"];
		$limit = $limitOptions["limit"];
		
		
		$sql = User::$defaultUsersPageSQL;
		
		
		
		$extraSql = array();
		
		foreach ($_GET as $key => $value) {
			if ( isset(Queries::$whereCallbacks[$key]) ) {
				call_user_func_array(Queries::$whereCallbacks[$key], [&$extraSql, true]);
			}
		}
		
		Queries::addWhereClause($sql, $extraSql);
		
		
		
		$sqlOrderBy = array();
		
		foreach ($_GET as $key => $value) {
			
			if ( isset(Queries::$orderByCallbacks[$key]) ) {
				call_user_func_array(Queries::$orderByCallbacks[$key], [&$sqlOrderBy]);
			}
		}
		
		
		Queries::addOrderByClause($sql, $sqlOrderBy);
		
		
		
		
		$_SESSION['LAST_SQL'] = $sql;
		
		
		$sql .= " LIMIT $offset,$limit";
		
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		
		
		Queries::bindValues($extraSql, $stmt);
		
		
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		$stmt->execute();
		
		$arr = [];
		while($user = $stmt->fetch()){
			$arr[] = $user;
		}
		
		
		return $arr;
		
		
	}	
	

	
	

	public static function findDepartments() {
		
		$sql = "SELECT * from departments";
		
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		$stmt->execute();
		
		$arr = [];
		while($dep = $stmt->fetch()){
			$arr[] = $dep;
		}
		
		return $arr;
		
		
	}
	
	public static function countDepartments() {
		
		
		$sql = "SELECT count(*) as dep_count
				FROM departments";
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		$stmt->execute();
		
		return $stmt->fetch()->dep_count;
		
	}
	
	
	public static function findDepartmentsGroupBy() {
		
		$sql = "SELECT count(*) as dep_count, departments.name
				FROM users
                INNER JOIN departments ON users.department_id = departments.id
				GROUP BY departments.name";
		
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		$stmt->execute();
		
		$arr = [];
		while($dep = $stmt->fetch()){
			$arr[] = $dep;
		}
		
		return $arr;
		
		
	}
	

	public static function findCabinets() {
		
		$sql = "SELECT cabinetName
				from users
				WHERE cabinetName != 'adminCabinet'
				GROUP BY cabinetName";
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		$stmt->execute();
		
		$arr = [];
		while($cabinet = $stmt->fetch()){
			$arr[] = $cabinet;
		}
		
		return $arr;
		
		
	}
	
	
	
	public function publishFeed($title, $body) {
		
		
		
		$db = static::getDB();
		$db->beginTransaction();
			
			try {
					
					$sql = 'INSERT INTO feeds (user_id, title, body) VALUES (:user_id, :title, :body)';
					
					$stmt = $db->prepare($sql);
					
					
					$stmt->bindValue(':user_id', $this->id, PDO::PARAM_INT);
					$stmt->bindValue(':title', $title, PDO::PARAM_STR);
					$stmt->bindValue(':body', $body, PDO::PARAM_STR);
		
				
					$stmt->execute();
					
					$feed_id = $db->lastInsertId();
					
					$db->commit();
					
					return [
						'action' =>true,
						'feed_id' => $feed_id
					];
						
					
					
		
				  

			} catch (PDOException $e) {
				$db->rollback();
				  return [
						'action' =>false,
						'feed_id' => '-1'
					];;
			}
			
		
		
		
		
		
		
		
		
	}


	public function deleteUserWithID($id) {
		
			
			
		
			
		
						
			$db = static::getDB();
			$db->beginTransaction();
				
			try {
				
					
				$sql = 'DELETE FROM users 
						WHERE id = :id';
					
					$stmt = $db->prepare($sql);
				
					$stmt->bindValue(':id', $id, PDO::PARAM_INT);
		
				
					$stmt->execute();

				  $db->commit();

				  return $stmt->rowCount();

			} catch (PDOException $e) {
				  $db->rollback();
				  return false;
			}
			
			
			
			
			
	}
	
	private static $m_map = array(
				"Name" => "Ime",
				"Full Name" => "Puno ime",
				"Email" => "Mejl",
				"Department" => "Departman",
				"Status" => "Aktivan",
				"Cabinet Name" => "Kabinet",
				"Created At" => "Datum kreiranja");
				
	private static function translateToSerbian($res) {
		return static::$m_map[$res];
		
	}

	private static function filterExcelData(&$data) {
		
		if ( empty($data) )
			return;
		
		$total = [];
		
		
		$dataExcel = [];
		$skip = [];
		
		$row = $data[0];
		
		if (isset($row)) {
			
			
			$new_data_row = [];
			foreach($row as $key=>$value) {
				
				if ( strcmp($key, "id") === 0 ) {
						$skip[$key] = true;
						continue;
					
				}
				if ( strcmp($key, "profile_image_path") === 0 ) {
						$skip[$key] = true;
						continue;
					
				}
			
				preg_match_all('/((?:^|[A-Z])[a-z]+)/',$key,$matches);
				
				if ( !empty($matches) ) {
				
					$matches[0][0] = ucfirst($matches[0][0]);
					$res = join( " ", $matches[0]);
					
					$res = User::translateToSerbian($res);
					
					array_push($new_data_row, $res);
				
				}
				
			}
			
			if ( !empty($new_data_row)) {
				array_push($dataExcel, $new_data_row);
			}
			
			
			
			
		}
		
		$counter = 0;
		
		do {
			$row = $data[$counter];
			
			
			$new_data_row = [];
			foreach($row as $key=>$value) {
			
				if ( isset($skip[$key]) )			
					continue;
				
				if ( strcmp($key, "createdAt") === 0 ) {
					array_push($new_data_row, date('d/m/Y', $value));
				} else
					array_push($new_data_row, $value);
			
			}
			
			if ( !empty($new_data_row)) {
				array_push($dataExcel, $new_data_row);
			}
			
			
			
			
			$counter +=1 ;
		} while( $counter < count($data) );
		
		
		return $dataExcel;
		
	}

	
	private static function setupSpreadsheet($spreadsheet) {
		
		
		$spreadsheet->getProperties()
			->setTitle("Korisnicki izvestaj");
		
	}

	private static function populateSheet($data) {
		
		
        $spreadsheet = new Spreadsheet(); // instantiate Spreadsheet
		User::setupSpreadsheet($spreadsheet);
		
		#$spreadsheet->setTitle("Korisnicki izvestaj");

        $sheet = $spreadsheet->getActiveSheet();
        // manually set table data value
		
		$next_char = 65;
		$next_number = 1;
		
		
		
		for ( $i = 0 ; $i < count($data); ++$i) {
			
			$row = $data[$i];
			
			
			foreach ($row as $key => $value) {
				
				$char = chr($next_char);
				
				$sheet->setCellValue( $char . strval($next_number), $value ); 
				$sheet->getColumnDimension($char)->setAutoSize(true);
				
				$next_char +=1;
				
				
			}
			
			
			$next_number +=1;
			
			$next_char = 65;
			
			
			

		}
		
		#$char = chr($next_char);
       # $sheet->getStyle("A1:G10")->getAlignment()->setHorizontal('center');
		
		
		 $styleArray = [
			'borders' => [
				'allBorders' => [
					'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
					'color' => ['argb' => '00000000'],
				],
			],
		];


		

		$last_char = chr(64 + count($data[0]));
		$last_number = strval($next_number-1);
		
		$sheet->getStyle('A1:'. $last_char . $last_number)->applyFromArray($styleArray);
		
		return  $spreadsheet;
		
	}
	
    public static function exportToPdf($data) {
		
		
		$data = User::filterExcelData($data);
		$spreadsheet = User::populateSheet($data);
		
	   
		#header('Content-Disposition: attachment; filename="KorisnickiIzvestaj.pdf"');
		$writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Mpdf');
 
        #$writer->save('php://output');	
		
		ob_start();
        $writer->save('php://output');	
		$xlsData = ob_get_contents();
		ob_end_clean();

		echo json_encode(array(
				'op' => 'ok',
				'file' => "data:application/pdf;base64,".base64_encode($xlsData)
			));
		
		
    }
	
	
    public static function exportToExcel($data) {
		
		
		$data = User::filterExcelData($data);
		$spreadsheet = User::populateSheet($data);
		
		
        $writer = new Xlsx($spreadsheet);
	   
				
		ob_start();
        $writer->save('php://output');	
		$xlsData = ob_get_contents();
		ob_end_clean();

		echo json_encode(array(
				'op' => 'ok',
				'file' => "data:application/vnd.ms-excel;base64,".base64_encode($xlsData)
			));
		
	}
	
	public static function executeLastQuery() {
		
		
		$sql = $_SESSION['LAST_SQL'];
		$params = $_SESSION['LAST_PARAMS'];
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		
		foreach($params as $key => $value) {
					$stmt->bindValue(":".$key, $value["value"], $value["type"]);
		}
		
		
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		$stmt->execute();
		
		$arr = [];
		while($row = $stmt->fetch()){
			$arr[] = $row;
		}
		
		return $arr;
		
		
		
	}
	
	public function uploadFile($db, $id) {
		
		
		$imagePath = UploadImage::$defaultImageAvatar;
		
		if ( isset($_FILES["profileImage"]) ) {
			if ( isset($_FILES["profileImage"]["name"]) && $_FILES["profileImage"]["name"] !== '') {

				var_dump("settovan");
				$imagePath = UploadImage::formatFilePath();
				
			} 
		}
		
		
		
		
		// $db = static::getDB();
		// $db->beginTransaction();
					#var_dump("nesto0");
			
			try {
				
				$sql = "INSERT INTO profile_images(user_id, path) VALUES ($id, :imagePath)";
					
					$stmt = $db->prepare($sql);
					$stmt->bindValue(':imagePath', $imagePath, PDO::PARAM_STR);
		#
					#var_dump("nesto1");
				
					$stmt->execute();
					
					#var_dump("nesto2");
					if ( isset($_FILES["profileImage"]) ) {
						
						if ( isset($_FILES["profileImage"]["name"])  && $_FILES["profileImage"]["name"] !== '' ) {
							return UploadImage::isReady();
						} 
						
					} 
		
					

				  return [
						'action'=>true,
						'response'=>null
					];
				  

			} catch (PDOException $e) {
				   return [
						'action'=>false,
						'response'=>"Serverska greška: čuvanje korisnika [uploadFile][1]."
					];
			}
				
		
	}
	
	public function changePicture($db, $id, $oldImagePath) {
		
		
		if ( !isset($_FILES["profileImage"]) || empty($_FILES["profileImage"]['name']) ) {
			
			  return [
				'action'=>true,
				'response'=>null
			];
		}
		
		if ( strcmp($oldImagePath, $_FILES["profileImage"]['name']) === 0 ){
			
			  return [
				'action'=>true,
				'response'=>null
			];
			
		}
		
		
		
		$newImagePath = UploadImage::formatFilePath();
		
		
		
			
		try { 
			
			$sql = "UPDATE 
					profile_images
					SET path = :imagePath
					WHERE user_id = $id";
				
				//var_dump($sql);
				
				$stmt = $db->prepare($sql);
				$stmt->bindValue(':imagePath', $newImagePath, PDO::PARAM_STR);
	
			
				$stmt->execute();
				
				$isReadyToUploadImage = UploadImage::isReadyToChangeImage($oldImagePath, $newImagePath);
				
				return $isReadyToUploadImage;
					
			  

		} catch (PDOException $e) {
			  return [
				'action'=>false,
				'response'=>"Serverska greška: [changePicture][1]."
			];
		}
				
		
	}
	
	
	
	

}
