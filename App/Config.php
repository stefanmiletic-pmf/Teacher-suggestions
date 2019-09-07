<?php
namespace App;


date_default_timezone_set("Europe/Belgrade");

class Config
{

    const SEND_MAIL = false;
	
    const DB_HOST = 'localhost';
    const DB_NAME = 'nastavnicki_predlozi';
    const DB_USER = 'root';

    const DB_PASSWORD = 'PASSWORD';
    const SHOW_ERRORS = true;
	
	
    const SECRET_KEY = '7lG7Zr8BmdkVyijzFqM7q7Wpw8ZO0blK';
	
	
	
	
}
