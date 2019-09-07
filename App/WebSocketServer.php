<?php
namespace App\Sockets;

#require 'vendor/autoload.php';
require dirname(__DIR__) . '/vendor/autoload.php';


use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use App\Sockets\Models\User;
use App\Sockets\Helpers\Session;
define("WAMP_TMP_PATH", "C:\\wamp64\\tmp\\");

class SERVERWS implements MessageComponentInterface
{
    /** @var \SplObjectStorage $clients */
    protected static $clients;

    /** @var mixed $sender */
    protected static $sender;

    /** @var \stdClass[] $controllers */
    protected static $controllers = array();

    /** @var array $parameters */
    protected static $parameters = array();

    /** @var bool $debugMode Whether it's on Debug Mode. */
    protected static $debugMode = true;

	
	protected static $objInfoMapping = array();

    public function __construct() {
		
        static::$clients = new \SplObjectStorage();

        spl_autoload_register(function($class)
        {
            $file = __DIR__ . "/" . str_replace(__NAMESPACE__ . '/', '', str_replace('\\', '/', $class)) . ".php";
            if (file_exists($file))
            {
                /** @noinspection PhpIncludeInspection */
                require_once $file;
            }
        });
    }
	
	

    public function onOpen(ConnectionInterface $connection) {
		static::log("\n");
		#static::debug('onOpen');
		
		
		
		$str=$connection->httpRequest->getUri()->getQuery();   
		$regex = '/auth=([^&#]*)/';
		$matches=array();
		
		
		if ( preg_match($regex, $str, $matches) ) {
		    
			
			$sess = 'sess_' . $matches[1];
			$rawCookie = Session::getRawSessionCookie($sess);
			
			
			if ( !isset($rawCookie) ) {
			
				$connection->close();
				return;
			
			}
			
			
			static::$sender = $connection;
			static::$clients->attach($connection);
	
	
	
			if ( isset(static::$objInfoMapping[$sess]) ) {
					
					static::reply('User', 'duplicate', []);
					static::$sender->close();
					return;
					
			} else {
				static::$objInfoMapping[$sess] = $connection;
				static::$sender->sess = $sess;
			}
		
		
		
			
			if ( !Session::validateAndUpdateLastActivity($sess, $rawCookie) ) {
				
				
				static::debug("session expired [$sess]");
				
				
				
				static::reply('Session', 'expired', []);
				static::$sender->close();
				
				return;
				
			}
			
			$cookie =  Session::unserialize($rawCookie);
			$id = $cookie['user_id'];
			
			if ( !$id ) {
				$connection->close();
				return;
				
			} else {
				
				static::$sender->user_id = $id;
				
			}
			
			
			
		
		} else {
			
			static::debug("auth missing [$sess]");
			static::reply('user', 'auth-missing', []);
			static::$sender->close();
			
			return;
		}
		
		
        static::debug('Klijent #' . static::$sender->resourceId . ' je konektovan, user_id ' . static::$sender->user_id . '. Sada su ' . static::$clients->count() . ' korisnika online. ');
		
		
		
    }

    public function onMessage(ConnectionInterface $connection, $message) {
		#static::debug('onMessage');
		
        static::$sender = $connection;
        static::decodeMessage($message);
    }
	


    public function onClose(ConnectionInterface $connection) {
		#static::debug('onClose');
        static::$sender = $connection;
        static::$clients->detach($connection);
		
		
		unset(static::$objInfoMapping[static::$sender->sess]);
		
		
		static::debug('Klijent #' . static::$sender->resourceId . ' je diskonektovan, user_id ' . static::$sender->user_id . '. Ostali su ' . static::$clients->count() . ' korisnika online. ');
		
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {
		#static::debug('onError');
        static::$sender = $connection;
        static::log("Greška: {$e->getMessage()}");
        $connection->close();
    }

    public static function broadcast($controller, $action, array $parameters = array())
    {
		#static::debug('broadcast');
        $message = static::encodeMessage($controller, $action, $parameters);
        static::debug("Šaljem svim korisnicima poruku: $message");
        foreach (static::$clients as $client)
        {
            $client->send($message);
        }
    }

    public static function broadcastExcludingSender($controller, $action, array $parameters = array())
    {
		#static::debug('broadcastExcludingSender');
        $message = static::encodeMessage($controller, $action, $parameters);
        static::debug("Šaljem svim korisnicima, osim pošiljaocu poruku: $message");
        foreach (static::$clients as $client)
        {
            if ($client !== static::$sender)
            {
                $client->send($message);
            }
        }
    }

    public static function reply($controller, $action, array $parameters = array())
    {
		#static::debug('reply');
        $message = static::encodeMessage($controller, $action, $parameters);
        static::debug("Šaljem klijentu #" . static::$sender->resourceId . " poruku: $message");
        static::$sender->send($message);
    }

    /**
     * @return \SplObjectStorage
     */
    public static function getClients()
    {
        return static::$clients;
    }

    /**
     * @return mixed
     */
    public static function getSender()
    {
        return static::$sender;
    }

    /**
     * @return array
     */
    public static function getParameters()
    {
        return static::$parameters;
    }

    /**
     * Returns the parameter an specifc parameter value. If the paramter does not exist, returns the default value.
     *
     * @param string $name Name of the parameter to be retrieved.
     * @param mixed $defaultValue Value to be returned in case the paramter does not exist.
     *
     * @return mixed|null
     */
    public static function getParameter($name, $defaultValue = null)
    {
        if (array_key_exists($name, static::$parameters))
        {
            return static::$parameters[$name];
        }
        else
        {
            return $defaultValue;
        }
    }

    /**
     * Encodes a messsage in JSON format.
     *
     * @param $controller
     * @param $action
     * @param array $parameters
     *
     * @return string
     */
    protected static function encodeMessage($controller, $action, array $parameters = null)
    {
        if (is_null($parameters))
        {
            $arr = array($controller, $action);
        }
        else
        {
            $arr = array($controller, $action, $parameters);
        }

        return json_encode($arr);
    }

    /**
     * Decodes a JSON messsage and calls runs the spectific controller action.
     *
     * @param $message
     */
    protected static function decodeMessage($message)
    {
		
			
        $request = json_decode($message, true);
        if (is_null($request) || empty($request[0]) || empty($request[1]))
        {
            return;
        }

        $controllerName = str_replace(' ', '', ucwords(str_replace('-', ' ', $request[0]))) . 'Controller';

        $actionName = 'action' . str_replace(' ', '', ucwords(str_replace('-', ' ', $request[1])));

        if (!isset(static::$controllers[$controllerName]))
        {
			
            $className = __NAMESPACE__ . '\\Controllers\\' . $controllerName;

            if (!class_exists($className))
            {
                return;
            }

            static::$controllers[$controllerName] = new $className();
        }

        $controller = static::$controllers[$controllerName];

        if (!empty($request[2]) && is_array($request[2]))
        {
            static::$parameters = $request[2];
        }
		
        if (is_callable(array($controller, $actionName)))
        {
			
            $controller->$actionName();
        }
    }

    /**
     * Logs a message to console.
     *
     * @param string $message Message to log
     */
    public static function log($message)
    {
        echo '[' . gmdate('Y-m-d H:i:s') . ' GMT] ' . $message . PHP_EOL;
    }

    /**
     * Logs a message to console if running on Debug Mode.
     *
     * @param string $message Message to log
     */
    public static function debug($message)
    {
        if (static::$debugMode)
        {
				static::log("Socket:: $message");
        }
    }
}


$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new SERVERWS()
        )
    ),
    2593
);

SERVERWS::debug("Server pokrenut.");
$server->run();
