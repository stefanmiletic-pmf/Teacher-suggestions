<?php

namespace Core;
use \App\Auth;
use \App\Flash;

/**
 * Base controller
 *
 * PHP version 7.0
 */
abstract class Controller
{

    /**
     * Parameters from the matched route
     * @var array
     */
    protected $route_params = [];

    /**
     * Class constructor
     *
     * @param array $route_params  Parameters from the route
     *
     * @return void
     */
    public function __construct($route_params)
    {
        $this->route_params = $route_params;
    }

    /**
     * Magic method called when a non-existent or inaccessible method is
     * called on an object of this class. Used to execute before and after
     * filter methods on action methods. Action methods need to be named
     * with an "Action" suffix, e.g. indexAction, showAction etc.
     *
     * @param string $name  Method name
     * @param array $args Arguments passed to the method
     *
     * @return void
     */
    public function __call($name, $args)
    {
        $method = $name . 'Action';

        if (method_exists($this, $method)) {
            if ($this->before() !== false) {
                call_user_func_array([$this, $method], $args);
                $this->after();
            }
        } else {
            throw new \Exception("Method $method not found in controller " . get_class($this));
        }
    }

    /**
     * Before filter - called before an action method.
     *
     * @return void
     */
    protected function before()
    {
		
		
		if ( isset($_SESSION['user_id']) ) {
				
			if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
				
				session_unset();     
				session_destroy(); 
				session_start();
				
				
				Flash::addMessage('Istakla sesija, prijavi se opet. ');
				$this->redirect("/");
				
			}
			
			$_SESSION['LAST_ACTIVITY'] = time(); 
			
		} 
		
    }

    /**
     * After filter - called after an action method.
     *
     * @return void
     */
    protected function after()
    {
    }
	
	public function redirect($url) {
		
		#https://en.wikipedia.org/wiki/HTTP_303
		header('Location: http://' . $_SERVER['HTTP_HOST'] . $url, true, 303);
		exit;
		
	}
	
	public function requireLogin() {
		
		if ( ! Auth::getUser() ) {
			
			
			Auth::rememberRequestedPage();
			$this->redirect('/login');
			
		}
		
	}
	
	public function requireAdmin() {
		
		$user = Auth::getUser();
		
		
		if ( !$user || ( $user && !$user->isAdmin()) ) {
			
			
			Flash::addMessage('Nemaš privilegije.', Flash::INFO);
			
			Auth::rememberRequestedPage();
			
			$this->redirect('/login');
		} 
		
	}
	
	


}
