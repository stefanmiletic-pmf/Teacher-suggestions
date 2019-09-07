<?php

namespace App\Controllers;

use \App\Pagination;
use \Core\View;
use \App\Models\User;
use \App\Auth;


use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


class Admin extends AuthenticatedAdmin
{

	public function before(){
        parent::before();
        $this->user = Auth::getUser();
    }
	
	
	public function showAction() {
			View::renderTemplate('Admin/admin_panel.html',[
				"departments" => User::findDepartments(),
				"cabinets" => User::findCabinets(),
				"user" => $this->user
			]);
		
	}
	
	

	public function deleteUserAction() {
		
		$id = $_POST['id'];
		if ( $this->user->deleteUserWithID((int)$id) !== 0) {
			echo "success";
		} else {
			echo "error";
		}
		
		#$text = View::getTemplate('Admin/deleted_email.txt');
		#$html = View::getTemplate('Admin/deleted_email.html');
		#Mail::send($user->email, "Izbrisan.", $text, $html);
		
	}
	
	
	
	public function showUsersPageAction() {
		
			$pagination = new Pagination('/Admin/show-users-page');
			$users = $this->user->findUsersPage($pagination);
			
			
			#var_dump($_SESSION['LAST_SQL']);
			
			if (!$users)
				$pagination = null;
			
			echo json_encode([
				"pagination" => $pagination,
				"users" => $users
			]);
	}
	
	
	
	public function departmentsGroupByAction() {
			
			 echo json_encode([
				 "departments" => User::findDepartmentsGroupBy()
			 ]);
		
	}
	
	public function exportExcelAction() {
		
		
		if ( !isset($_SESSION['LAST_SQL']) ){
			$_SESSION['LAST_SQL'] = User::$defaultUsersPageSQL;
		}
		
		
		if ( $_SESSION['LAST_SQL'] === '' ){
			return;
		}
		
		User::exportToExcel(User::executeLastQuery());
		
	}
	
	public function exportPdfAction() {
		
		
		if ( !isset($_SESSION['LAST_SQL']) ){
			$_SESSION['LAST_SQL'] = User::$defaultUsersPageSQL;
		}
		
		if ( $_SESSION['LAST_SQL'] === '' ){
			return;
		}
		
		
		User::exportToPdf(User::executeLastQuery());
		
	}


}
