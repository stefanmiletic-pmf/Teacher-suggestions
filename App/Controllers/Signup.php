<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Auth;
use \App\UploadImage;


class Signup extends \Core\Controller
{

	public function before() {
		
		$user = Auth::getUser();
		
		if ( Auth::getUser() ){
			View::renderTemplate('Home/index.html',[
				"user"=>$user
			]);
			exit;
			#return false;
		}
		
		
	}


    public function newAction()
    {
		
		$departments = User::findDepartments();
		
        View::renderTemplate('Signup/new.html',[
			"departments" => $departments
		]);
		
    }
	
	
    public function createAction()
    {
				
		#UploadImage::uploadImage();
		
		$user = new User($_POST);
		if ( $user->save() ) {
			
			$user->sendActivationEmail();
			$this->redirect('/signup/success');
			
		} else {
			
			View::renderTemplate('Signup/new.html',[
				'user' => $user,
				"departments" => User::findDepartments()
			]);
		}
		
		
	
	
		
    }
	
	public function successAction() {
			View::renderTemplate('Signup/success.html');
	}
	
	public function activateAction() {
		
		if ( User::activate($this->route_params['token']) ) {
			$this->redirect('/signup/activated');
		}else {
			$this->redirect('/signup/error');
		}
		
		
	}
	
	public function errorAction() {
			View::renderTemplate('Signup/error.html');
	}
	
	public function activatedAction() {
		View::renderTemplate('Signup/activated.html');
	}
	


}
