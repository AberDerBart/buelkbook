<?php
/**
 * For dev use only! Quick way to run buelkbook without spinning up apache. Run the 
 * following command in main folder to spin up a buelkbook instance on port 8080:
 *
 * php -S localhost:8080 dev/phphtacces.php
 */

if (preg_match('#^/api/(.*)$#', $_SERVER["REQUEST_URI"], $matches)) {
	chdir('api');
	$_GET['q'] = $matches[1];
	include_once("index.php");
} else if (!file_exists(getcwd() . $_SERVER["REQUEST_URI"])) {
	include("index.html");
} else {
	return false;
}
?>