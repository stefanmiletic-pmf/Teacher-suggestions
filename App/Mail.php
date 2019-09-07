<?php

namespace App;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



/**
 * Mail configuration
 *
 * PHP version 7.0
 */
class Mail
{
	
	
	public static function send($to, $subject, $text, $html) {
			
		// Instantiation and passing `true` enables exceptions
		$mail = new PHPMailer(true);
		try {
			//Server settings
			$mail->SMTPDebug = 0;                                       // Enable verbose debug output
			$mail->isSMTP();                                            // Set mailer to use SMTP
			$mail->Host       = 'smtp.gmail.com';  // Specify main and backup SMTP servers
			$mail->SMTPAuth   = true;                                   // Enable SMTP authentication
			$mail->Username   = 'EMAIL';                     // SMTP username
			$mail->Password   = 'PASSWORD';                               // SMTP password
			$mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
			$mail->Port       = 587;                                    // TCP port to connect to

			//Recipients
			$mail->setFrom('EMAIL', 'FULL NAME');
			$mail->addAddress($to);     // Add a recipient
			
			
			                                  // Set email format to HTML
			$mail->Subject = $subject;
			$mail->Body    = $html;
			$mail->AltBody = $text;
			
			
			// Content
			$mail->isHTML(true);

			$mail->send();
		} catch (Exception $e) {
			echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
		}
				
	}
	
}
