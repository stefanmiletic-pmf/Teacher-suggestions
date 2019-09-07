<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;
use \App\Flash;
use \App\Models\User;

class Profile extends Authenticated
{

    public function before()
    {
        parent::before();

        $this->user = Auth::getUser();
		
    }
    
    public function showAction()
    {
		
        View::renderTemplate('Profile/show.html', [
            'user' => $this->user,
			"departments" => User::findDepartments()
        ]);
    }
    
    public function updateAction()
    {
        if ($this->user->updateProfile()) {

            Flash::addMessage('Sacuvano.');
            $this->redirect('/FeedProvider/show');

        } else {
            View::renderTemplate('Profile/show.html', [
                'user' => $this->user,
				"departments" => User::findDepartments()
            ]);

        }
    }
	
	
}
