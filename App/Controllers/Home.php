<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;

class Home extends \Core\Controller
{

    public function indexAction()
    {
		
		$user = Auth::getUser();
		if ( $user ) {
			 View::renderTemplate('Home/index.html', [
				"user" => $user
			]);
		} else {
			
			 View::renderTemplate('Login/new.html');
		}
		
       
    }
}
