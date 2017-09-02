<?php
error_reporting (E_ALL);

define ('DIRSEP', DIRECTORY_SEPARATOR);
$site_path = realpath(dirname(__FILE__) . DIRSEP) . DIRSEP;
define ('site_path', $site_path);

include ('components/tools.php');

// подключение всех классов
__autoload('registry');
__autoload('router');
__autoload('controller');

// создание глобального обьекта
$registry = new Registry();

$db = new PDO('mysql:host=localhost;dbname=tasker', 'root', '');
$registry->set ('db', $db);

$router = new Router($registry);
$registry->set ('router', $router);
$router->setPath (site_path . 'controllers');

session_start();

$router->delegate();
?>