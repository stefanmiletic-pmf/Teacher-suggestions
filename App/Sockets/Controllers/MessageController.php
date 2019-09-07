<?php
namespace App\Sockets\Controllers;

use App\Sockets\SERVERWS;
use App\Sockets\Models\User;
use App\Sockets\Helpers\Session;

class MessageController
{
	
	
    protected static $debugMode = true;
	
	
	
	public static function debug($message)
    {
        if (static::$debugMode)
        {
            SERVERWS::debug("MessageController:: $message\n");
        }
    }
	
	private function before($message) {
		
		static::debug('before');
		
		
		
		$auth = $message['auth'];
		
		if ( !$auth )
			'auth missing';

		$auth = 'sess_' . $auth;
		
		
		
		$rawCookie = Session::getRawSessionCookie($auth);
		
		if ( !$rawCookie ){
			
			static::debug('cookie doesnt exists');
			
			return array(
					'approved' => false,
					'why' => 'cookie doesnt exists'
				);
				
		}
				
				
			
			
		
		$cookie =  Session::unserialize($rawCookie);
		
		if ( !isset($cookie['user_id'] ) ){
			
			static::debug('user_id doesnt exists');
			
			return array(
					'approved' => false,
					'why' => 'user_id doesnt exists'
				);
				
		}
				
				
		
		
		
		
		if ( strcmp(SERVERWS::getSender()->sess, $auth) !== 0 ) {
			
			if ( strcmp(SERVERWS::getSender()->user_id, $cookie['user_id']) !== 0 ) {
				
				static::debug('cookie doesnt match and user id also');
				
				SERVERWS::reply('error', 'add', $response);
				SERVERWS::getSender()->close();
				
				return array(
					'approved' => false,
					'why' => 'cookie doesnt match and user id also'
				);
			}
			
			
			
		}
		
		
		
		return Session::validateAndUpdateLastActivity($auth, $rawCookie);
		
	}
	
	private static function validateFeedSubmit($message) {
		
		
		$feed =  $message['feed'];
		if ( !isset($feed) ){
			static::debug('Feed not set');
			
			return 'Feed not set';
		}
		
		
		$title = $feed['title'];
		if ( !isset($feed) ){
			static::debug('Title not set');
			return 'Title not set';
		}
		$body = $feed['body'];
		if ( !isset($feed) ){
			static::debug('Body not set');
			return 'Body not set';
		}
		
		return false;
		
		
	}
	
    public function actionFeedSubmit()
    {
		$message = SERVERWS::getParameter('message');
		
		$beforeResponse = static::before($message);
		
		if ( $beforeResponse !== true) {
			
			SERVERWS::reply('user', 'expired-session', $beforeResponse );
			SERVERWS::getSender()->close();
			
		}
		
		
		#print('actionFeedSubmit');
     
		

	
		$error = MessageController::validateFeedSubmit($message);
		
		if (  $error === false ) {
			
			
				$auth = 'sess_' . $message['auth'];
		
				$feed =  $message['feed'];

				$title = $feed['title'];
				$body = $feed['body'];
						
				
				$cookie = Session::getSessionCookie($auth);
					
			
			
				$id = $cookie['user_id'];
				$response = User::publishAction($id, $title, $body);
					
				
			
			
		} else {
			
			static::debug("$error");
			$response = array(
								'approved' => false,
								'why' => "$error"
							);
			
		}
		
		
		
		
		
		if ( $response['approved'] ){
			SERVERWS::reply('publish', 'feed-approval', $response);
			SERVERWS::broadcastExcludingSender('notification', 'new-feed', [
				'userId' => $response['feed']['user_id'],
				'feedId' => $response['feed']['feedId'],
				'title' => $response['feed']['title'],
				'body' => $response['feed']['body']
			]);
		} else 
			SERVERWS::reply('error', 'add', $response);
			
			
		
		
		
       # Message::addToHistory($author, $text);
       
    }
}