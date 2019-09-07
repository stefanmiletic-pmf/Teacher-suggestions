<?php
namespace App\Sockets\Helpers;
use Exception;
use App\Sockets\SERVERWS;

class Session {
	

	protected static $debugMode = true;
	
	
	
	public static function debug($message)
    {
        if (static::$debugMode)
        {
            SERVERWS::debug("Session:: $message\n");
        }
    }
	
	
    public static function unserialize($session_data) {
        $method = ini_get("session.serialize_handler");
        switch ($method) {
            case "php":
                return self::unserialize_php($session_data);
                break;
            case "php_binary":
                return self::unserialize_phpbinary($session_data);
                break;
            default:
				static::debug("Unsupported session.serialize_handler: " . $method . ". Supported: php, php_binary");
                #throw new Exception("Unsupported session.serialize_handler: " . $method . ". Supported: php, php_binary");
        }
    }

    private static function unserialize_php($session_data) {
		
		//console("unserialize_php");
		
		#var_dump($session_data);
        $return_data = array();
        $offset = 0;
        while ($offset < strlen($session_data)) {
			
			
			#print(" substr($session_data \n $offset): ");
			#print(" \n");
			
			#print(" \n");
			#print(substr($session_data, $offset));
			#print(" \n");
			
			#print(" \n");
			#print(". strstr(substr($session_data \n   $offset), "|"): " );
			#print(" \n");
			
			#print(" \n");
			#print(strstr(substr($session_data, $offset), "|"));
			#print(" \n");
			#print(" \n");
			
			
            if (!strstr(substr($session_data, $offset), "|")) {
                throw new Exception("invalid data, remaining: " . substr($session_data, $offset));
            }
            $pos = strpos($session_data, "|", $offset);
            $num = $pos - $offset;
            $varname = substr($session_data, $offset, $num);
            $offset += $num + 1;
            $data = unserialize(substr($session_data, $offset));
            $return_data[$varname] = $data;
            $offset += strlen(serialize($data));
			
			#print(" \n");
			#print("SLEDECI\n");
			#print(" \n");
        }
        return $return_data;
    }

    private static function unserialize_phpbinary($session_data) {
        $return_data = array();
        $offset = 0;
        while ($offset < strlen($session_data)) {
            $num = ord($session_data[$offset]);
            $offset += 1;
            $varname = substr($session_data, $offset, $num);
            $offset += $num;
            $data = unserialize(substr($session_data, $offset));
            $return_data[$varname] = $data;
            $offset += strlen(serialize($data));
        }
        return $return_data;
    }
	
	
	
	public static function validateAndUpdateLastActivity($sess_id, $session_data) {
		
		
		$start = strpos($session_data, "LAST_ACTIVITY");
		if ( $start === -1 ){
			
			
			static::debug('LAST_ACTIVITY in the cookie not found');
			return false;
			
		}
		
		$start += strlen("LAST_ACTIVITY");
		
		$start = strpos($session_data, ":", $start);
		
		if ( $start === -1  ){
			
			
			static::debug('cookie-wrong format [:]');
			return false;
			
		}
		
		$start += 1;
		
		$end = strpos($session_data, ";", $start);
		
		if ( $end === -1 )
			$end = strlen($session_data);
		
		
		$prev_activity = (int) substr($session_data, $start, $end-$start);
		
		
		if (time() - $prev_activity > 1800) {
			
			static::debug('session expired');
			return false;
			
		}
		
		
		$replacement = strval(time());


		$newData = substr_replace($session_data,$replacement,$start,strlen($replacement));
		if ( static::writeSessionCookie($sess_id, $newData) )
			return true;
		else
			return false;
		

	}
	
	
	public static function writeSessionCookie($sessionId, $newSessionData) {
		
			
		$myfile = false;
		try {
			$myfile = fopen(WAMP_TMP_PATH . $sessionId, "w");
		} catch ( Exception $e ) {
			static::debug('writeSessionCookie exception');
			#var_dump($e);
			
		} 
		
		
		


		if ( $myfile !== false ){
			
			fwrite($myfile, $newSessionData);
			fclose($myfile);
			
			return true;
			
		}
		else
			return false;
		
	}
	
	public static function getRawSessionCookie($sessionId) {
		
		$myfile = false;
		try {
			$myfile = fopen(WAMP_TMP_PATH . $sessionId, "r");
		} catch ( Exception $e ) {
			static::debug('getRawSessionCookie exception');
			#var_dump($e);
		} 
		
		
		if ( $myfile !== false ){
			$buffer = fgets($myfile);
			fclose($myfile);
			
			return $buffer;
			
		}
		else
			return false;
	}
	
	
	public static function getSessionCookie( $sessionId) {
		
		
		
		$cookie = static::getRawSessionCookie($sessionId);
		
		if ($cookie) 
			return Session::unserialize($cookie);
		 else 
			return false;
		
		
	}
	
	
}