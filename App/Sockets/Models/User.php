<?php
namespace App\Sockets\Models;

use App\Sockets\SERVERWS;

class User
{
    public static function getUserList()
    {
        $clients = SERVERWS::getClients();
        $userList = array();

        foreach ($clients as $client)
        {
            $userList[] = array(
                'id' => $client->resourceId,
				'user_id' => $client->user_id
            );
        }

        return $userList;
    }
	
	public static function publishAction($id, $title, $body) {
	
		
	
		$user = \App\Auth::getUser($id);
		if ( $user ) {
			
			$response = $user->publishFeed($title, $body);
			
			if ( !$response['action'] ){
				
				return array(
							'approved' => false,
							'feed' => null
						);
		
			}
			
			$feed_id = $response['feed_id'];
			
			if ( $feed_id ) {
				
		
				return array(
				
					'approved' => true,
					'feed' => array(
					
						'createdAt' => time(),
						'department' => $user->department,
						'feedId' => $feed_id,
						'fullName' => $user->fullName,
						'email' => $user->email,
						'liked_id' => null,
						'liked_times' => 0,
						'name' => $user->name,
						'profile_image_path' => $user->profile_image_path,
						'title' => $title,
						'body' => $body,
						'user_id' => $user->id
						
					)
				);
			}
		} 
		
		return array(
					'approved' => false,
					'feed' => null
				);
		
		
	
	
	
	}
	

	
}