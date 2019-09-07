<?php

namespace App;

use PDO;
class Queries
{
	public static $whereCallbacks = array(
	
	
		'fullName' =>  ['\App\Queries','fullNameWhere'],
		'department_id' =>  ['\App\Queries','departmentIdWhere'],
		'cabinetName' =>  ['\App\Queries','cabinetWhere'],
		'status' =>  ['\App\Queries','statusWhere']
		
	
	);
	
	public static function fullNameWhere(&$extraSql, $saveToSession=null) {
		
		
			array_push($extraSql,  array(
			
				"query" => " users.fullName LIKE :fullName ",
				"key" => ":fullName",
				"value" => "". $_GET['fullName'] . "%",
				"type" => PDO::PARAM_STR
				));
				
			if ( $saveToSession )
				$_SESSION['LAST_PARAMS']["fullName"] =  array( 
						"type" => PDO::PARAM_STR,
						"value" => "". $_GET['fullName'] . "%" );
			
		
	}
	
	
	public static function  departmentIdWhere(&$extraSql, $saveToSession=null) {
		
			
			array_push($extraSql,  array(
			
				"query" => " users.department_id =  :search_dep_id ",
				"key" => ":search_dep_id",
				"value" =>  intval($_GET['department_id']),
				"type" => PDO::PARAM_INT 
				));
				
			if ( $saveToSession )
				$_SESSION['LAST_PARAMS']["search_dep_id"] =  array(
							"type" => PDO::PARAM_INT,
							"value" => intval($_GET['department_id']) );
		
	}
	
	public static function  cabinetWhere(&$extraSql, $saveToSession=null) {
		
			
			array_push($extraSql,  array(
			
				"query" => " users.cabinetName = :search_cabinetName ",
				"key" => ":search_cabinetName",
				"value" => $_GET['cabinetName'],
				"type" => PDO::PARAM_STR
				));
				
			if ( $saveToSession )
				$_SESSION['LAST_PARAMS']["search_cabinetName"] =  array(
							"type" => PDO::PARAM_STR,
							"value" => $_GET['cabinetName'] );
		
	}
	
	
	public static function  statusWhere(&$extraSql, $saveToSession=null) {
	
		
			array_push($extraSql,  array(
			
				"query" => " users.is_active = :search_status ",
				"key" => ":search_status",
				"value" => intval($_GET['status']),
				"type" => PDO::PARAM_INT
				));
				
				
			if ( $saveToSession )
				$_SESSION['LAST_PARAMS']["search_status"] =  array(
							"type" => PDO::PARAM_INT, 
							"value" => intval($_GET['status']) );
	
		
	}





	public static $orderByCallbacks = array(
	
		'orderFullName' =>  ['\App\Queries','fullNameOrder'],
		'orderEmail' =>  ['\App\Queries','emailOrder'],
		'orderCreatedAt' =>  ['\App\Queries','createdAtOrder'],
		'orderIs_active' =>  ['\App\Queries','isActiveOrder'],
		'orderDepartment_id' =>  ['\App\Queries','departmentIdOrder'],
		'orderCabinetName' =>  ['\App\Queries','cabinetOrder']
		
	
	);


	public static function fullNameOrder(&$sqlOrderBy) {
			array_push( $sqlOrderBy,"users.fullName");
	}
	
	public static function  emailOrder(&$sqlOrderBy) {
		
			array_push( $sqlOrderBy,"users.email");
		
	}
	public static function  departmentIdOrder(&$sqlOrderBy) {
		
			array_push( $sqlOrderBy,"users.department_id");
		
	}
	public static function  createdAtOrder(&$sqlOrderBy) {
			array_push( $sqlOrderBy,"users.createdAt DESC");
		
		
	}
	public static function  cabinetOrder(&$sqlOrderBy) {
			array_push( $sqlOrderBy,"users.cabinetName");
	}
	
	
	public static function  isActiveOrder(&$sqlOrderBy) {
			array_push( $sqlOrderBy,"users.is_active");
		
	}

	

	public static function bindValues($extraSql, $stmt) {
		
		if ( !empty($extraSql) ) {
			
			
			#var_dump($extraSql);
			for ($i = 0; $i < count($extraSql); $i++) {
				
				$item = $extraSql[$i];
				$stmt->bindValue($item['key'], $item['value'], $item["type"]);
				
				
			}

			
			
			
		}
		
		
	}



	
	
	public static function addOrderByClause(&$sql, $sqlOrderBy) {
		
		if ( !empty($sqlOrderBy) ) {
			
			$sql = $sql . " ORDER BY ";
			
			for ($i = 0; $i < count($sqlOrderBy)-1; $i++) {
				
				$item = $sqlOrderBy[$i];
				$sql = $sql . $item . ",";
				
			}
			
			$item = $sqlOrderBy[count($sqlOrderBy)-1];
			$sql = $sql . $item;
		
		}
		
		
	}
	
	public static function addWhereClause(&$sql, $extraSql) {
		
		if ( !empty($extraSql) ) {
			
			$sql = $sql .  " WHERE ";
			
			
			for ($i = 0; $i < count($extraSql)-1; $i++) {
				
				$item = $extraSql[$i];
				$sql = $sql . $item["query"] . " and ";
				
			}

			
				$item = $extraSql[count($extraSql)-1];
				$sql = $sql . $item["query"];
			
			
		}
		
		
		
	}


}
