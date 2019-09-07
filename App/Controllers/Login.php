<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Auth;
use \App\Flash;
/**
 * Home controller
 *
 * PHP version 7.0
 */
class Login extends \Core\Controller
{
	


    public function newAction()
    {
		
		if ( Auth::getUser() )
			View::renderTemplate('Feed/feedpanel.html');
		else	
			View::renderTemplate('Login/new.html');
		
    }
	
	public function createAction()
    {
		
		$user = User::authenticate($_POST['email'], $_POST['password']);
		$remember_me = isset($_POST['remember_me']);
		
		if($user) {
				Auth::login($user, $remember_me);
				Flash::addMessage('Uspešna prijava. ');
				$this->redirect(Auth::getReturnToPage());
		}else {
			
			Flash::addMessage('Neuspešna prijava.', Flash::WARNING);
			View::renderTemplate('Login/new.html',[
				'email' => $_POST['email'],
				'remember_me' => $remember_me
			]);
			
			
		}
    }
	
	
	public function destroyAction() {
		
		
		if ( !Auth::getUser() ) {
			Flash::addMessage('Nisi se ni prijavio a vec bi da se odjavis.');
			$this->redirect('/');
			
		} else {
			
			Auth::logout();
			$this->redirect('/login/show-logout-message');
			
		}
		
		
	}
	
	public function showLogoutMessageAction() {
		
		$this->redirect('/');
		
	}
	

}
