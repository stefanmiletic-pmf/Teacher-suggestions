**php7, mvc, oop, mysql, javascript, composer, export-to-excel, export-to-pdf, phpmailer
ratcher-php-server, twig, bootstrap, jquery, hideShowPassword**

# Table of Contents
1. [Ukratko - Summary](#sec1)
2. [Video specifikacija - Video specification](#sec2)
3. [Pdf specifikacija - Pdf specification](#sec3)
4. [Instalacija - Installation](#sec4)

## Ukratko - Summary <a name="sec1"></a>
Ova platforma omogućava objavljivanje predloga nastavnika jedne obrazovno-vaspitne ustanove.

This platform gives teachers from one institution option to share their suggestions with other among same institution.

## Video specifikacija - Video specification <a name="sec2"></a>
https://www.youtube.com/watch?v=3RmUDs5ip_4

## Pdf specifikacija - Pdf specification <a name="sec3"></a>
Nastavnicki predlozi.pdf

## Instalacija - Installation <a name="sec4"></a>

Testirano na WAMP serveru - Tested on WAMP server:

Apache/2.4.37 (Win64) <br />
PHP/7.2.14 - Port defined for Apache: 80 <br />
MySQL/5.7.24 <br />

-------------------------------

1. Napraviti novi virtualni host na WAMP serveru, u daljem tekstu MS94PROJEKAT - kao virtualni host,
sa putanjom to public foldera: \path\to\MS94PROJEKAT\public

	Make virtual host.
-------------------------------

2. Kreirati novu praznu bazu. (u daljem tekstu ime baze: nastavnicki_predlozi)
2.1. POSTAVITI COLLATION NA:
	utf8_unicode_ci
	
	Create database with utf8_unicode_ci collation.
-------------------------------


	hint: (C:\wamp64\bin\mysql\mysql5.7.24\bin)
3. Pokrenuti komandu  mysql -h localhost -u root -p  nastavnicki_predlozi < databaseSetup.sql

	Init database.
-------------------------------

4. Pokrenuti 'composer install'.


	Run 'composer install'.
-------------------------------

5. U fajlu \App\Config postaviti varijable na odgovarajuci nacin:
	 DB_HOST = 'localhost';
     DB_NAME = 'nastavnicki_predlozi';
     DB_USER = 'root';
     DB_PASSWORD = 'SIFRA';

	hint: (umesto 'root' postaviti odgovarajuceg user ako ima potrebe)
	hint: (umesto 'localhost' postaviti odgovarajuceg HOST ako ima potrebe)

	Enter right credentials for connecting to the database.
-------------------------------

6. U fajlu \App\Config varijablu SEND_MAIL, po zelji, postaviti na true a onda postaviti odgovarajucu konfiguraciju SVOG naloga u fajlu \App\Mail (linije 29,30, 35) sa koga ce biti poslat aktivacioni mejl i mejl za promenu sifre. Takodje u ovom slucaju kreirati novog korisnika sa REALNOM mejl adresom.
Obratno, rucno aktivirati korisnika u bazi: nastavnicki_predlozi, tabela users, kolona is_active. Postaviti na 1.

	Edit in file \App\Config variable SEND_MAIL if you want the activation and reset password mail to be sent to the user.
	Otherwise do it manually.
-------------------------------
7. Svi korisnici imaju sifru 123456,
	korisnici:
	admin@pmf.edu,
	milan@pmf.edu,
	snezana@pmf.edu,
	bojan@pmf.edu,
	milena@pmf.edu,
	mila@pmf.edu,
	marija@pmf.edu,
	marko@pmf.edu
	

	hint: (admin@pmf.edu je admin)

	All users have password: 123456.
-------------------------------


8. Pokrenuti Web Socket server. Fajl se nalazi \App\WebSocketServer.php.

	hint: (Komanda: php WebSocketServer.php)


	Run \App\WebSocketServer.php: php WebSocketServer.php.
-------------------------------

9. Pokrenuti aplikaciju u pretrazivacu: MS94PROJEKAT.

	Run virtual hosted application in browser.
-------------------------------
