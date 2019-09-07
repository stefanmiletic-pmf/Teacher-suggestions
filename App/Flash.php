<?php

namespace App;

/**
 * Flash configuration
 *
 * PHP version 7.0
 */
class Flash
{
	
	const SUCCESS = 'success';
	const INFO = 'info';
	const WARNING = 'warning';


	
   public static function addMessage($message, $type = Flash::SUCCESS) {
	   
	   if ( !isset($_SESSION['flash_notification'] ) ) {
		   $_SESSION['flash_notification'] = [];
	   }
	   
	   $_SESSION['flash_notification'][] = [
		'body' => $message, 'type' => $type
	   
	   ];
	   
   }
   
   public static function getMessages() {
	   
	    if (isset($_SESSION['flash_notification'] ) ) {
			
			$res = $_SESSION['flash_notification'];
			unset($_SESSION['flash_notification']);
		   return $res;
	   }
	   
   }
}
