<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Auth;

class Password extends \Core\Controller
{

	public function before() {
		
		$user = Auth::getUser();
		
		if ( Auth::getUser() ){
			View::renderTemplate('Home/index.html',[
				"user"=>$user
			]);
			exit;
		}
		
		
	}

  
	public function forgotAction() {
		
		if ( isset($_GET['email']) && $_GET['email'] !== '') {
			if (filter_var($_GET['email'], FILTER_VALIDATE_EMAIL) !== false){
					View::renderTemplate('Password/forgot.html', [
						"email" => $_GET['email']
					]);
					exit();
			}
		}
		
		
		View::renderTemplate('Password/forgot.html');
		
	}
	
	public function requestResetAction() {
		
		
		if (User::emailExists($_POST['email'], $this->id ?? null)){
			
			User::sendPasswordReset($_POST['email']);
			View::renderTemplate("Password/reset_requested.html");
			
		} else {
			echo "<h1>Mejl ne postoji.</h1>";
		}
		
		
	}
	
	public function resetAction() {
		
		$token = $this->route_params['token'];
		
		$user = $this->getUserOrExit($token);
	
		View::renderTemplate('Password/reset.html', [
			"token" => $token
		]);
	
		
		
	}
	
	public function resetPasswordAction() {
		
		$token = $_POST['token'];
		
		
		$user = $this->getUserOrExit($token);
		
		if ( $user->resetPassword($_POST['password'])) {
			View::renderTemplate('Password/reset_success.html');
		} else {
			View::renderTemplate('Password/reset.html', [
				'token' => $token,
				'user'  => $user
			]);
			
		}
		
		
		
	}
	
	public function getUserOrExit($token) {
		
		$user = User::findByPasswordReset($token);
		
		if ($user) {
			return $user;
		} else {
			View::renderTemplate('Password/token_expired.html');
			exit;
		}
		
	}

}
