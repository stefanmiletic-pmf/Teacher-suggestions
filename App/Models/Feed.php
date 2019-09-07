<?php

namespace App\Models;

use PDO;
use \App\Pagination;

class Feed extends \Core\Model
{
	
	
	
	// public static function validate($title, $text) {
		
		// if ( isset($title) && isset($text) ) 
			// return true;
		
		// return false;
		
	// }
	



	public static function addLikeDelta($user_id, $feed_id, $delta) {
		
		if ( $delta != 1 and $delta != -1 )
			return false;
		
		
		if ( $delta == 1 ) {
			
			$sql = "INSERT INTO feed_likes_user_id (feed_id, user_id)
					SELECT * FROM (SELECT $feed_id, $user_id) AS tmp
					WHERE NOT EXISTS (
						SELECT * FROM feed_likes_user_id WHERE user_id = $user_id
						AND feed_id = $feed_id
					) LIMIT 1";
		} else {
			
			$sql = "DELETE FROM feed_likes_user_id
					WHERE user_id = $user_id AND feed_id = $feed_id";
		}
		
				
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		return $stmt->execute();
		
		
		
	}
	
	
	protected static function countUsersFeedsWithId($user_id) {
		
		$totalRowsSql = 'SELECT COUNT(*) as total_rows
		FROM feeds
		WHERE feeds.user_id = :user_id';
		
		$db = static::getDB();
		
		$stmt = $db->prepare($totalRowsSql);
		$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
		
		$stmt->execute();
		$total_rows_obj = null;
		
		if ( $total_rows_obj  = $stmt->fetch(PDO::FETCH_OBJ ) )
			return $total_rows_obj->total_rows;
		else 
			return 0;
		
	}
	
	
	public static function findFeedsWithUserId(&$pagination, $logged_user_id, $user_id) {
		
		$limitOptions = Pagination::paginationCalc(static::countUsersFeedsWithId($user_id), $pagination);
		
		if ( $pagination->total_pages == 0 ) 
			return;
		
		
		$offset = $limitOptions["offset"];
		$limit = $limitOptions["limit"];
		
		
		
		
		$sql = "SELECT feeds.id as feed_id, feeds.title, feeds.body, 
				UNIX_TIMESTAMP(feeds.createdAt) as createdAt, 
				users.id as user_id, users.name, users.fullName, users.email, departments.name as department, profile_images.path as profile_image_path, feed_likes.counter as liked_times, feed_likes_user_id.user_id as liked_id
				FROM feeds
				LEFT JOIN users ON feeds.user_id = users.id
				LEFT JOIN profile_images ON feeds.user_id = profile_images.user_id
				LEFT JOIN departments ON users.department_id = departments.id
				LEFT JOIN feed_likes ON feeds.id = feed_likes.feed_id
				LEFT JOIN feed_likes_user_id ON feeds.id = feed_likes_user_id.feed_id
				AND feed_likes_user_id.user_id = :logged_user_id
				WHERE feeds.user_id = :user_id
				ORDER BY feeds.createdAt DESC
				LIMIT $offset,$limit";
				
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':logged_user_id', $logged_user_id, PDO::PARAM_INT);
		$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
		
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		if ( $stmt->execute() ){
			
			$arr = [];
			while($feed = $stmt->fetch()){
				$arr[] = $feed;
			}
			return $arr;
		}
		else
			return false;
		
		
	}
	public static function findFeedWithID($user_id, $feed_id) {
		
		
		$sql = 'SELECT feeds.id as feed_id, feeds.title, feeds.body, 
				UNIX_TIMESTAMP(feeds.createdAt) as createdAt, 
				users.id as user_id, users.name, users.fullName, users.email, departments.name as department, profile_images.path as profile_image_path, feed_likes.counter as liked_times, feed_likes_user_id.user_id as liked_id
				FROM feeds
				LEFT JOIN users ON feeds.user_id = users.id
				LEFT JOIN profile_images ON feeds.user_id = profile_images.user_id
				LEFT JOIN departments ON users.department_id = departments.id
				LEFT JOIN feed_likes ON feeds.id = feed_likes.feed_id
				LEFT JOIN feed_likes_user_id ON feeds.id = feed_likes_user_id.feed_id
				AND feed_likes_user_id.user_id = :user_id
                WHERE feeds.id = :feed_id';
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
		$stmt->bindValue(':feed_id', $feed_id, PDO::PARAM_INT);
		
		$stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
		
		if ( $stmt->execute() )
			return $stmt->fetch();
		else
			return false;
		
		
		
	}


	protected static function countFeedsRows() {
		
		$totalRowsSql = 'SELECT COUNT(*) as total_rows
				FROM feeds';
		
		$db = static::getDB();
		
		$stmt = $db->prepare($totalRowsSql);
		
		$stmt->execute();
		$total_rows_obj = null;
		
		if ( $total_rows_obj  = $stmt->fetch(PDO::FETCH_OBJ ) )
			return $total_rows_obj->total_rows;
		else 
			return 0;
		
	}
	
	public static function findFeedsPage(&$pagination, $user_id) {
		
		
		$limitOptions = Pagination::paginationCalc(static::countFeedsRows(),$pagination);
		
		if ( $pagination->total_pages == 0 ) 
			return;
		
		
		$offset = $limitOptions["offset"];
		$limit = $limitOptions["limit"];
		
		
		
		$sql = "SELECT feeds.id as feed_id, feeds.title, feeds.body, 
				UNIX_TIMESTAMP(feeds.createdAt) as createdAt, 
				users.id as user_id, users.name, users.fullName, users.email, departments.name as department, profile_images.path as profile_image_path, feed_likes.counter as liked_times, feed_likes_user_id.user_id as liked_id
				FROM feeds
				LEFT JOIN users ON feeds.user_id = users.id
				LEFT JOIN profile_images ON feeds.user_id = profile_images.user_id
				LEFT JOIN departments ON users.department_id = departments.id
				LEFT JOIN feed_likes ON feeds.id = feed_likes.feed_id
				LEFT JOIN feed_likes_user_id ON feeds.id = feed_likes_user_id.feed_id
				AND feed_likes_user_id.user_id = :user_id
				ORDER BY feeds.createdAt DESC
				LIMIT $offset,$limit";
		#echo $sql;
		
		
		$db = static::getDB();
		$stmt = $db->prepare($sql);
		
		$stmt->setFetchMode(PDO::FETCH_OBJ);
		
		$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
			
		$stmt->execute();
		
		$arr = [];
		while($feed = $stmt->fetch()){
			$arr[] = $feed;
		}
		
		return $arr;
		
		
	}

	
	
	
}
