<?php

namespace App\Controllers;
use \App\Flash;

abstract class Authenticated extends \Core\Controller
{


  	
	public function before() {
		parent::before();
		
		$this->requireLogin();
	}
	

}
