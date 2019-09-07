<?php
namespace App;


class UploadImage
{
	
	public static $defaultImageAvatar = "profiledefault.png";
	
	public static function validateImage() {
		
		if ( isset($_FILES["profileImage"]["name"]) ) {
			
			if($_FILES['profileImage']['size'] > 200000) {
			
				return [
					'action'=>false,
					'response'=>"Slika treba biti manja od 200Kb"
				];
			
			}
			
		}
		



		return [
				'action'=>true,
				'response'=>"OK"
			];
		
	}
	
	public static function formatFilePath() {
		
		
		$profileImageName = time() . '-' . basename($_FILES["profileImage"]["name"]);
		
		return $profileImageName;
		
	}

	public static function isReady($filePath=null) {
		
		if ( $filePath ) {
			$profileImageName = $filePath;
		} else {
			$profileImageName = static::formatFilePath();
		}
		
		
		
		$target_dir = "images/";
		$target_file = $target_dir . $profileImageName;
		
		if(move_uploaded_file($_FILES["profileImage"]["tmp_name"], $target_file)) {
			return [
				'action'=>true,
				'response'=>$profileImageName
			];
		} else {
			return [
				'action'=>false,
				'response'=>"Serverska greška: move_uploaded_file."
			];
		}

		
	}
	
	
	public static function isReadyToChangeImage($old_image_path, $new_image_path) {
		
		$profileImageName = $old_image_path;
		
		
		if ( strcmp("profiledefault.png",$profileImageName) !== 0) {
			
			$target_dir = "images/";
			$target_file = $target_dir . $profileImageName;
			
			if (file_exists($target_file)) {
				unlink($target_file);
				
				return static::isReady($new_image_path);
				
			} else {
				return [
					'action'=>false,
					'response'=>"Serverska greška: stara slika ne postoji."
				];
			}
			
			
				
		} else {
			
			return static::isReady($new_image_path);
			
		}
		
		
		

		
	}
	
	
	
	
}
