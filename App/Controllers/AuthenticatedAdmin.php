<?php

namespace App\Controllers;
use \App\Flash;

/**
 * Items controller
 *
 * PHP version 7.0
 */
abstract class AuthenticatedAdmin extends \Core\Controller
{


  	
	public function before() {
		parent::before();
		
		$this->requireAdmin();
		
	}
	

}
