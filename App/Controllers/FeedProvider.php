<?php

namespace App\Controllers;

use \App\Pagination;
use \App\Auth;
use \Core\View;
use \App\Models\Feed;
use \App\Models\User;



class FeedProvider extends Authenticated
{

    public function before()
    {
        parent::before();

        $this->user = Auth::getUser();
    }
	
	public function showAction()
    {
			View::renderTemplate('Feed/feedpanel.html', [
				"user" => $this->user
			]);
    }
	
	public function showFeedsPageAction() {
		
		
			$pagination = new Pagination('/FeedProvider/show-feeds-page');
			$feeds = Feed::findFeedsPage($pagination, $this->user->id);
			
			if (!$feeds)
				$pagination = null;
			
			echo json_encode([
				"pagination" => $pagination,
				"feeds" => $feeds
			]);
				
			
		
	}
	
	public function showUserFeedsAction() {
		
		$user_id = $_GET["id"];
		
		
		if ( !$user_id )
			echo "error";
		
		$pagination = new Pagination('/FeedProvider/show-user-feeds');
		$feeds = Feed::findFeedsWithUserId($pagination, $this->user->id, $user_id);
		
		
		if (!$feeds)
			$pagination = null;
		
		echo json_encode([
			"pagination" => $pagination,
			"feeds" => $feeds
		]);
				
		
		
		
		
		
	}
	
	public function showFeedWithIDAction() {
		
		$feed_id = $_GET["id"];
		
		
		if ( !$feed_id )
			echo "error";
		
		$feed = Feed::findFeedWithID($this->user->id, $feed_id);
		
		
		
		echo json_encode($feed);
		
		
	}
	
	
	public function addDeltaLikeAction() {
		
		if ( !isset($_POST['id']) || !isset($_POST['delta']) ) {
			echo "error";
			return;
		}
		
		$feed_id = $_POST['id'];
		$feed_like_delta = $_POST['delta'];
		
		
		if ( Feed::addLikeDelta($this->user->id, $feed_id, $feed_like_delta) ) {
			echo "success";
		}else {
			echo "error";
		}
		
	}
	
	public function searchForUserAction() {
		
		
		
		$user_fullName = $_GET['term'];
		$pagination = new Pagination('');
		$users = User::findUsersByFullName($pagination,$user_fullName);
		
		
		
		echo json_encode([
		
				'data' => $users,
				'total' => $pagination->total_rows
				]);
		
		
	}
	

    
  
}
