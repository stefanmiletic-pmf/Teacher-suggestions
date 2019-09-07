<?php

namespace App;



use \App\Models\User;
use \App\Models\RememberedLogin;

/**
 * Pagination
 *
 * PHP version 7.0
 */
class Pagination
{
	
	public static function paginationCalc($total_rows, &$pagination) {
		
		$adjacents = 1;
		$limit = 3;
		$total_pages = ceil($total_rows / $limit);
		
		

		
		if(isset($_GET['page']) && $_GET['page'] != "") {
		  
		  
			if ( $_GET['page'] <= $total_pages) {
				$page = $_GET['page'];
			} else {
				$page = $total_pages;
			}
			
			$offset = $limit * ($page-1);
			
		  
		} else {
			$page = 1;
			$offset = 0;
		}
		  
		  
		
	
	  $start = -1;                                
	  $end   = -1; 
	
		if ( $total_pages != 0 ) {
		
			  if($total_pages <= $adjacents * 2) {
				$start = 1;
				$end   = $total_pages;
			  } else {
				if(($page - $adjacents) >= 1) { 
				  if(($page + $adjacents) <= $total_pages) { 
					$start = ($page - $adjacents);            
					$end   = ($page + $adjacents);   
				  } else {             
					$start = ($total_pages - $adjacents);  
					$end   = $total_pages;               
				  }
				} else {               
				  $start = 1;                                
				  $end   = 1 + $adjacents ;             
				}
			  }
		  
		  
		}
		
		  
		$pagination->total_rows = $total_rows;
		$pagination->offset = $offset;
		$pagination->page = $page;
		$pagination->total_pages = $total_pages;
		$pagination->start = $start;
		$pagination->end = $end;
		$pagination->limit = $limit;
		  
		 
		return array('offset' => $offset, 'limit' => $limit);
			
	}


	
	public function __construct($controller,
								$offset = 0, 
								$page = 1,
								$total_pages = 0,
								$start = 0,
								$end = 0,
								$total_rows = 0) {
		
		$this->offset = $offset;
		$this->page = $page;
		$this->total_pages = $total_pages;
		$this->start = $start;
		$this->end = $end;
		$this->controller = $controller;
		$this->total_rows = $total_rows;
		
	}
	
}
